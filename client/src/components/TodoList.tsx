import React from "react";
import "./styles.css";
import { Todo } from "./model";
import SingleTodo from "./SingleTodo";
import { Droppable } from "react-beautiful-dnd";

interface Props {
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
    completedTodos: Todo[];
    setCompletedTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const TodoList: React.FC<Props> = ({
    todos,
    setTodos,
    completedTodos,
    setCompletedTodos,
}) => {
    return (
        <div className="container">
            <Droppable droppableId="TodoList">
                {(provided) => (
                    <div className="todos" ref={provided.innerRef} {...provided.droppableProps}>
                        <span className="todos__heading">Active Task</span>
                        {todos.map((todo, index) => (
                            <SingleTodo
                                index={index}
                                todo={todo}
                                setTodos={setTodos}
                                todos={todos}
                                key={todo.id}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <Droppable droppableId="CompletedList">
                {
                    (provided) => (
                        <div className="todos remove" ref={provided.innerRef} {...provided.droppableProps}>
                            <span className="todos__heading">Completed Task</span>
                            {completedTodos.map((todo, index) => (
                                <SingleTodo
                                    index={index}
                                    todo={todo}
                                    setTodos={setCompletedTodos}
                                    todos={completedTodos}
                                    key={todo.id}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )
                }
            </Droppable>
        </div>
    );
};

export default TodoList;
