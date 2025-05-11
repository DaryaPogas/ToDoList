import { useEffect, useState } from 'react'
import './App.css'
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm'
import TodoListItem from './features/TodoList/TodoListItem'
import TodosViewForm from './features/TodosViewForm'

function App() {
  const [todoList, setTodoList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [sortField, setSortField] = useState('createdTime')
  const [sortDirection, setSortDirection] = useState('desc')

  const [queryString, setQueryString] = useState('');

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeUrl = ({ sortField, sortDirection, queryString }) => {
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  let searchQuery = '';

  if (queryString){
    searchQuery = `&filterByFormula=SEARCH("${queryString}",{title})`;
  }
  return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  };

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
        const resp = await fetch(
          encodeUrl({ sortField, sortDirection, queryString }),
          options
        );

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
  }, [sortField, sortDirection, queryString])

  const handleAddTodo = async (newTodo) => {

    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(
        encodeUrl({ sortField, sortDirection, queryString }),
        options
      );
      if(!resp.ok){
        throw new Error('Failed')
      }
      const {records} = await resp.json()
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      }

      if(!records[0].fields.isCompleted) {savedTodo.isCompleted = false;}
      setTodoList([...todoList, savedTodo]);

    }catch (error) {
      console.error(error)
      setErrorMessage(error.message);
    }finally{
      setIsSaving(false)
    } 
  }

  const completeTodo = async (id) => {

    const originalTodos = [...todoList]

    const updatedTodo = todoList.map((todo) => {
      if (todo.id === id){
        return {...todo, isCompleted:true}
      }
      return todo
    })
    setTodoList(updatedTodo)

  try {
    const todoToUpdate = todoList.find(todo => todo.id === id);
    
    const payload = {
      records: [{
        id: id,
        fields: {
            title: todoToUpdate.title,
            isCompleted: true 
          }
        }
      ]
    };
    const response = await fetch(
      encodeUrl({ sortField, sortDirection, queryString }), {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

     if (!response.ok) {
      throw new Error('Failed');
    }

    const { records } = await response.json();
    const serverUpdatedTodo = {
      id: records[0].id,
      title: records[0].fields.title,
      isCompleted: records[0].fields.isCompleted || false 
    };

    setTodoList(prevTodos => 
      prevTodos.map(todo => 
        todo.id === serverUpdatedTodo.id ? serverUpdatedTodo : todo
      )
    );

  } catch (error) {
    console.error(error);
    setTodoList(originalTodos);
    setErrorMessage(error.message);
  }
};
    
    
    const updateTodo = async (editedTodo) => {
      const originalTodo = todoList.find((todo) => todo.id === editedTodo.id)

      const payload = {
        records: [
          {
            id: editedTodo.id,
            fields: {
              title: editedTodo.title,
              isCompleted: editedTodo.isCompleted,
            },
          },
        ],
      };

      const options = {
        method: 'PATCH',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      try {
        const resp = await fetch(
          encodeUrl({ sortField, sortDirection, queryString }),
          options
        );
        if (!resp.ok) {
          throw new Error('Failed');
        }

        const { records } = await resp.json();
        
        const updatedTodo = {
          id: records[0].id,
          ...records[0].fields,
        };

        if (!records[0].fields.isCompleted) {
          updateTodo.isCompleted = false;
        }

         const updatedTodos = todoList.map((todo) =>
           todo.id === updatedTodo.id ? { ...updatedTodo } : todo
         );

        setTodoList([...updatedTodos]);
      } catch (error) {
        console.error(error);
        setErrorMessage(`${error.message}. Reverting todo...`);

         const revertedTodos = todoList.map((todo) =>
           todo.id === originalTodo.id ? originalTodo : todo
         );

         setTodoList([...revertedTodos])
      } finally {
        setIsSaving(false);
      } 

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
        isLoading={isLoading}
      />
      <hr />
      <TodosViewForm
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      {errorMessage &&(
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
