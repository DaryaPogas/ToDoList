import { useState } from 'react'
import './App.css'
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm'
import TodoListItem from './features/TodoList/TodoListItem'

function App() {
  const [todoList, setTodoList] = useState([])

  const handleAddTodo = (newTodo) => {
    const markedTodo = {...newTodo, isCompleted:false}
    setTodoList([...todoList, markedTodo]) 
  }

  const completeTodo = (id) => {
    const updatedTodo = todoList.map((todo) => {
      if (todo.id === id){
        return {...todo, isCompleted:true}
      }
      return todo
    })
    setTodoList([...updatedTodo])
  }


    const updateTodo = (editedTodo) => {
      setTodoList(
        todoList.map((todo) =>
          todo.id === editedTodo.id
            ? { ...todo, title: editedTodo.title }
            : todo
        )
      );
    };

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo = {handleAddTodo}/>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
    </div>
  )
}

export default App
