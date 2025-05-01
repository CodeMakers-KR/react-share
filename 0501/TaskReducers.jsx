export const actionType = {
  done: "DONE",
  allDone: "ALL-DONE",
  add: "ADD",
  init: "INIT",
};

export default function taskReducers(state, action) {
  const type = action.type;
  const payload = action.payload;

  if (type === actionType.init) {
    return [...payload];
  } else if (type === actionType.add) {
    return [
      ...state,
      {
        id: "item" + (state.length + 1),
        task: payload.task,
        dueDate: payload.dueDate,
        priority: payload.priority,
        done: false,
      },
    ];
  } else if (type === actionType.done) {
    return state.map((task) => {
      if (task.id === payload.id) {
        task.done = true;
      }
      return task;
    });
  } else if (type === actionType.allDone) {
    return state.map((task) => {
      task.done = true;
      return task;
    });
  }
  return state;
}
