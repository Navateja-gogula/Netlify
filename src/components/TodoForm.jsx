import React, { useState } from "react";

function TodoForm({ onSubmit }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: Math.floor(Math.random() * 10000),
      text: input,
      isComplete: false,
    });
    setInput("");
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a to-do"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="todo-input"
      />
      <button className="todo-button">Added </button>
    </form>
  );
}

export default TodoForm;
