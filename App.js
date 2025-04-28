function App() {
  return (
    <div class="wrapper">
      <header>React Todo</header>
      <ul class="tasks">
        <li class="tasks-header">
          <input id="checkall" type="checkbox" />
          <label>Task</label>
          <span class="due-date">Due Date</span>
          <span class="priority">Proiority</span>
        </li>
        <li class="task-item">
          <input id="todo_1" type="checkbox" />
          <label for="todo_1">React Component 마스터</label>
          <span class="due-date">2025-12-31</span>
          <span class="priority">1</span>
        </li>
      </ul>
      <footer>
        <input type="text" placeholder="Task" />
        <input type="date" />
        <select>
          <option>우선순위</option>
          <option value="1">높음</option>
          <option value="2">보통</option>
          <option value="3">낮음</option>
        </select>
        <button type="button">Save</button>
      </footer>
    </div>
  );
}

export default App;
