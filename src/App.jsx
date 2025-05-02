import { useEffect, useState } from 'react'
import './App.css'
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm'
import TodoListItem from './features/TodoList/TodoListItem'

function App() {
  const [todoList, setTodoList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect (() => {
    const fetchTodos = async () => {
      setIsLoading(true)

      try {
        const options = {
          method:'GET',
          headers: {
            "Authorization": token
          }
        }
        const resp = await fetch(url, options)

        if(!resp.ok){
          throw new Error(resp.statusText)
        }
        const response = await resp.json()
        const fetchedTodos = response.records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          }
          if(!todo.isCompleted){
            todo.isCompleted = false
          } return todo
        })
        setTodoList([...fetchedTodos])

      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTodos()
  }, [])

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
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoadng={isLoading}
      />
      {errorMessage (
        <div className="error-message">
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App
