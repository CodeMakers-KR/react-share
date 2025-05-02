import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import TaskAppender from "./TaskAppender";
import TaskList from "./TaskList";
import Confirm from "../modal/Confirm";
import Alert from "../modal/Modal";
import taskReducers, { actionType } from "../../reducers/TaskReducers";
import { addTask, allDoneTasks, doneTask, loadTasks } from "../../http/http";
import { useFetch } from "../../hooks/useFetch";

const TaskMain = () => {
  console.log("Call [TaskMain] Component");
  console.log("Rendered [TaskMain] Component");

  const [todoLists, todoDispatcher] = useReducer(taskReducers, []);

  const {
    fetchedData: loadData,
    isLoading: loaded,
    error: fetchError,
  } = useFetch(todoLists, loadTasks);
  console.log("loadData: ", loadData);
  console.log("loaded:", loaded);
  console.log("fetchError:", fetchError);

  const { fetchedData, isLoading, error } = useFetch(todoLists, loadTasks);
  console.log(fetchedData);
  console.log(isLoading);
  console.log(error);

  useEffect(() => {
    if (!isLoading) {
      todoDispatcher({ type: actionType.init, payload: fetchedData.body });
    }
  }, [isLoading, fetchedData]);

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
      const json = await addTask({ task, dueDate, priority });

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
      const json = await doneTask(doneConfirmRef.todoId);

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
    const allDoneFetch = async (fnCallback) => {
      const json = await allDoneTasks();
      if (json.status === 200) {
        fnCallback();
      }
    };

    allDoneFetch(() => {
      todoDispatcher({ type: actionType.allDone, payload: {} });
      allDoneConfirmRef.current.close();
    });
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
};
export default TaskMain;
