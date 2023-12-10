import React, { useEffect, useRef, useState } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import { Draggable } from "react-beautiful-dnd";
import "./styles.css";

import { Todo } from "./model";

interface Props {
  todo: Todo;
  todos: Todo[];
  index: number;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setCompletedTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const SingleTodo: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  index,
  setCompletedTodos,
}) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<string>(todo.todo);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  const updateTodo = async (todo: Todo) => {
    const body = { isDone: todo.isDone, todo: todo.todo };
    const response = await fetch(`http://localhost:5000/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log(response);
  };

  const handleDone = (id: number) => {
    const newTodosList = todos.filter((todo) => todo.id !== id);
    const newCompletedTodo = todos.filter((todo) => todo.id === id)[0];
    setCompletedTodos((prev) => [...prev, newCompletedTodo]);
    setTodos(newTodosList);

    const todo = todos.filter((todo) => todo.id === id);
    console.log(todo);
    updateTodo(todo[0]);
  };

  const handleDelete = async (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    const response = await fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    });
    console.log(response);
  };

  const handleEdit = (e: React.FormEvent, id: number) => {
    e.preventDefault();

    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, todo: editTodo } : todo))
    );

    const todo = todos.filter((todo) => todo.id === id);
    updateTodo(todo[0]);

    setEdit(false);
  };

  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided, snapshot) => (
        <form
          className={`todos__single ${snapshot.isDragging ? "drag" : ""}`}
          onSubmit={(e) => handleEdit(e, todo.id)}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          {edit ? (
            <input
              type="text"
              ref={inputRef}
              value={editTodo}
              onChange={(e) => setEditTodo(e.target.value)}
              className="todos__single--text"
            />
          ) : (
            <span className="todos__single--text">{todo.todo}</span>
          )}

          <div>
            <span
              className="icon"
              onClick={() => {
                if (!edit && !todo.isDone) {
                  setEdit(!edit);
                }
              }}
            >
              <AiFillEdit />
            </span>
            <span className="icon" onClick={() => handleDelete(todo.id)}>
              <AiFillDelete />
            </span>
            <span className="icon" onClick={() => handleDone(todo.id)}>
              <MdDone />
            </span>
          </div>
        </form>
      )}
    </Draggable>
  );
};

export default SingleTodo;
