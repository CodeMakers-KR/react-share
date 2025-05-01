export async function loadTasks() {
  const response = await fetch("http://localhost:8888/api/v1/task");

  const json = await response.json();

  if (json.status === 200) {
    return json;
  }

  throw new Error(response.statusMessage);
}

export async function getTask(taskId) {
  const response = await fetch(`http://localhost:8888/api/v1/task/${taskId}`);

  const json = await response.json();
  if (json.status === 200) {
    return json;
  }

  throw new Error(response.statusMessage);
}

export async function addTask({ task, dueDate, priority }) {
  const response = await fetch("http://localhost:8888/api/v1/task", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task,
      dueDate,
      priority,
      isDone: false,
    }),
  });

  const json = await response.json();
  if (json.status === 201) {
    return json;
  }

  throw new Error(response.statusMessage);
}

export async function doneTask(taskId) {
  const response = await fetch(`http://localhost:8888/api/v1/task/${taskId}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();
  if (json.status === 200) {
    return json;
  }

  throw new Error(json.statusMessage);
}

export async function allDoneTasks() {
  const response = await fetch("http://localhost:8888/api/v1/task", {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();
  if (json.status === 200) {
    return json;
  }

  throw new Error(json.statusMessage);
}
