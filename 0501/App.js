import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import TaskAppender from "./Components/TaskAppender";
import TaskList from "./Components/TaskList";
import Confirm from "./Components/modal/Confirm";
import Alert from "./Components/modal/Modal";
import taskReducers, { actionType } from "./reducers/TaskReducers";

function App() {
  console.log("Call [App] Component");
  console.log("Rendered [App] Component");

  const [isLoading, setIsLoading] = useState(true);
  const [todoLists, todoDispatcher] = useReducer(taskReducers, []);

  const fetchCall = async () => {
    setIsLoading(true);

    const response = await fetch("http://192.168.210.11:8888/api/v1/task", {
      method: "GET",
    });
    console.log(response);

    const json = await response.json();
    console.log(json);

    setIsLoading(false);
    todoDispatcher({ type: actionType.init, payload: json.body });
  };

  useEffect(() => {
    fetchCall();
  }, []);

  const alertRef = useRef();
  const allDoneConfirmRef = useRef();
  const doneConfirmRef = useRef();

  const [allDoneConfirmMessage, setAllDoneConfirmMessage] = useState();
  const [alertMessage, setAlertMessage] = useState();

  const taskCount = {
    done: todoLists.filter((item) => item.done).length,
    process: todoLists.filter((item) => !item.done).length,
  };

  const addNewTodoHandler = useCallback((task, dueDate, priority) => {
    const addFetch = async (fnCallback) => {
      const response = await fetch("http://192.168.210.11:8888/api/v1/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          dueDate,
          priority,
          isDone: false,
        }),
      });

      const json = await response.json();
      console.log(json);

      if (json.status === 201) {
        fnCallback(json.body.taskId);
      }
    };

    addFetch((taskId) => {
      todoDispatcher({
        type: actionType.add,
        payload: { taskId, task, dueDate, priority },
      });
    });
  }, []);

  const doneTodoHandler = (event) => {
    const todoId = event.currentTarget.value;
    setAllDoneConfirmMessage(
      `${todoId} task를 완료할까요? 이 작업은 되돌릴 수 없습니다.`
    );
    doneConfirmRef.current.open();
    doneConfirmRef.todoId = todoId;
  };

  const doneTodoItemHandler = () => {
    const doneFetch = async (fnCallback) => {
      const response = await fetch(
        `http://192.168.210.11:8888/api/v1/task/${doneConfirmRef.todoId}`,
        { method: "PUT" }
      );

      const json = await response.json();
      console.log(json);

      if (json.status === 200) {
        fnCallback(json.body);
      }
    };

    doneFetch((taskId) => {
      todoDispatcher({
        type: actionType.done,
        payload: { id: taskId },
      });
      doneConfirmRef.current.close();
    });
  };

  const doneAllTodoHandler = useCallback(
    (event) => {
      const processingTodoLength = todoLists.filter(
        (todo) => !todo.done
      ).length;
      if (event.currentTarget.checked && processingTodoLength === 0) {
        setAlertMessage("완료할 Task가 없습니다.");
        event.currentTarget.checked = false;
        alertRef.current.open();
        return;
      }

      if (event.currentTarget.checked) {
        event.currentTarget.checked = false;
        setAllDoneConfirmMessage(
          "모든 task를 완료할까요? 이 작업은 되돌릴 수 없습니다."
        );

        allDoneConfirmRef.current.open();
      }
    },
    [todoLists]
  );

  const allDoneOkHandler = () => {
    todoDispatcher({ type: actionType.allDone, payload: {} });
    allDoneConfirmRef.current.close();
  };

  return (
    <>
      <div className="wrapper">
        <header>React Todo</header>
        <TaskList>
          <TaskList.TaskHeader
            taskCount={taskCount}
            onCheckboxClick={doneAllTodoHandler}
          />
          {isLoading && <div>data를 불러오는 중입니다.</div>}
          {!isLoading &&
            todoLists.map((item) => (
              <TaskList.TaskItem
                key={item.id}
                id={item.id}
                task={item.task}
                dueDate={item.dueDate}
                priority={item.priority}
                done={item.done}
                onCheckboxClick={doneTodoHandler}
              />
            ))}
        </TaskList>
        <TaskAppender onButtonClick={addNewTodoHandler} />
      </div>
      <Alert ref={alertRef}>
        <div>
          <h3>{alertMessage}</h3>
        </div>
      </Alert>
      <Confirm ref={allDoneConfirmRef} okHandler={allDoneOkHandler}>
        <div>{allDoneConfirmMessage}</div>
      </Confirm>
      <Confirm ref={doneConfirmRef} okHandler={doneTodoItemHandler}>
        <div>{allDoneConfirmMessage}</div>
      </Confirm>
    </>
  );
}

export default App;
