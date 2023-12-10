import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import "./App.css";

import InputField from "./components/InputField";
import { Todo } from "./components/model";
import TodoList from "./components/TodoList";

const App: React.FC = () => {
  // For user Input
  const [todo, setTodo] = useState<string>("");

  // For list of todos
  const [todos, setTodos] = useState<Todo[]>([]);

  // For todos set completed
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const getTodos = async () => {
      try {
        // Fetching created todos from database
        const response = await fetch("http://localhost:5000/todos");
        const data = await response.json();

        console.log(data);
        setTodos((prev) => (prev ? [...prev, ...data] : [...data]));
      } catch (error: any) {
        console.error(error.message);
      }
    };

    getTodos();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTodo = { id: todos.length + 1, todo, isDone: false };
    if (todo) {
      setTodos([...todos, newTodo]);
      setTodo("");
    }

    const response = await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });

    console.log(response);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    let add,
      active = [...todos],
      complete = [...completedTodos];

    if (source.droppableId === "TodoList") {
      add = active.splice(source.index, 1)[0];
    } else {
      add = complete.splice(source.index, 1)[0];
    }

    if (destination.droppableId === "CompletedList") {
      add = { ...add, isDone: true };
      complete.splice(destination.index, 0, add);
    } else {
      add = { ...add, isDone: false };
      active.splice(destination.index, 0, add);
    }

    setTodos(active);
    setCompletedTodos(complete);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <span className="heading">Task Manager</span>
        <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
        <TodoList
          todos={todos}
          setTodos={setTodos}
          completedTodos={completedTodos}
          setCompletedTodos={setCompletedTodos}
        />
      </div>
    </DragDropContext>
  );
};

export default App;
