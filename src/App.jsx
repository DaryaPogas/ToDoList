import { useState } from 'react'
import './App.css'
import TodoList from './TodoList'
import TodoForm from './TodoForm'
import TodoListItem from './TodoListItem'

function App() {
  const [todoList, setTodoList] = useState([])

  const handleAddTodo = (newTodo) => {
    setTodoList([...todoList, newTodo]) 
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo = {handleAddTodo}/>
      <TodoList todoList={todoList}/>
    </div>
  )
}

export default App
