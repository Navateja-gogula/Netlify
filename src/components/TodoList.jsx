import React from "react";

function TodoList({ todos, completeTodo, removeTodo }) {
  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`todo ${todo.isComplete ? "complete" : ""}`}
        >
          <div onClick={() => completeTodo(todo.id)}>{todo.text}</div>
          <button className="remove-button" onClick={() => removeTodo(todo.id)}>
            X
          </button>
        </div>
      ))}
    </div>
  );
}

export default TodoList;
