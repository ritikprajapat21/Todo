import React, { useEffect, useRef, useState } from 'react'
import { AiFillEdit, AiFillDelete } from "react-icons/ai"
import { MdDone } from "react-icons/md"
import { Draggable } from 'react-beautiful-dnd'
import './styles.css'

import { Todo } from './model'

interface Props {
    todo: Todo
    todos: Todo[]
    index: number
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

const SingleTodo: React.FC<Props> = ({ todo, todos, setTodos, index }) => {

    const [edit, setEdit] = useState<boolean>(false)
    const [editTodo, setEditTodo] = useState<string>(todo.todo)

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [edit])

    const handleDone = (id: number) => {
        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
            )
        )
    }

    const handleDelete = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id))
    }

    const handleEdit = (e: React.FormEvent, id: number) => {
        e.preventDefault()

        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, todo: editTodo } : todo
            )
        )

        setEdit(false)
    }

    return (
        <Draggable draggableId={todo.id.toString()} index={index}>
            {
                (provided) => (
                    <form
                        className='todos__single'
                        onSubmit={e => handleEdit(e, todo.id)}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                    >
                        {
                            edit ? (
                                <input
                                    type='text'
                                    ref={inputRef}
                                    value={editTodo}
                                    onChange={e => setEditTodo(e.target.value)}
                                    className='todos__single--text'
                                />
                            ) : (
                                todo.isDone ? (
                                    <s className="todos__single--text">{todo.todo}</s>
                                ) : (
                                    <span className="todos__single--text">{todo.todo}</span>
                                )
                            )
                        }

                        <div>
                            <span className="icon" onClick={() => {
                                if (!edit && !todo.isDone) {
                                    setEdit(!edit)
                                }
                            }}>
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
                )
            }
        </Draggable>
    )
}

export default SingleTodo