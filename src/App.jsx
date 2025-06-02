import { useEffect, useState, useCallback } from 'react';
import { Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import styles from './App.module.css';
import './App.css';

import backgroundImage from '../src/assets/images/todo-seamless-backgr.jpg';

import TodosPage from './pages/TodosPage';
import Header from './shared/Header';
import About from './pages/About';
import NotFound from './pages/NotFound';

const AppContainer = styled.div`
  background: url(${backgroundImage});
  padding: 20px;
  min-height: 100vh;
`;

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');

  const [queryString, setQueryString] = useState('');
  const [debouncedQueryString, setDebouncedQueryString] = useState('');

  const [title, setTitle] = useState('Todo List');
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  
  const filteredTodos = todoList.filter((todo) => !todo.isCompleted);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTodos.length / itemsPerPage)
  );
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const currentTodos = filteredTodos.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setTitle('Todo List');
        break;
      case '/about':
        setTitle('About');
        break;
      default:
        setTitle('Not Found');
    }
  }, [location]);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeQueryParams = useCallback(() => {
    const sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    const searchQuery = debouncedQueryString
      ? `&filterByFormula=SEARCH("${debouncedQueryString}",{title})`
      : '';
    return `${sortQuery}${searchQuery}`;
  }, [sortField, sortDirection, debouncedQueryString]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQueryString(queryString);
    }, 500);
    return () => clearTimeout(timerId);
  }, [queryString]);

  useEffect(() => {
    const fetchAllTodos = async () => {
      setIsLoading(true);
      let allTodos = [];
      let offset = '';
      try {
        do {
          const fullUrl = `${url}?pageSize=100&${encodeQueryParams()}${
            offset ? `&offset=${offset}` : ''
          }`;

          const resp = await fetch(encodeURI(fullUrl), {
            headers: {
              Authorization: token,
            },
          });

          if (!resp.ok) throw new Error(resp.statusText);

          const data = await resp.json();

          const todos = data.records.map((record) => ({
            id: record.id,
            ...record.fields,
            createdTime: record.createdTime,
            isCompleted: record.fields.isCompleted || false,
          }));

          allTodos = [...allTodos, ...todos];
          offset = data.offset;
        } while (offset);

        setTodoList(allTodos);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTodos();
  }, [encodeQueryParams]);

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

    try {
      setIsSaving(true);
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error('Failed to save new todo');

      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
        createdTime: records[0].createdTime,
        isCompleted: records[0].fields.isCompleted || false,
      };

      setTodoList((prev) => [savedTodo, ...prev]);
      setSearchParams({ page: 1 }); 
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const completeTodo = async (id) => {
    const originalTodos = [...todoList];

    const updatedList = todoList.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: true } : todo
    );
    setTodoList(updatedList);

    try {
      const todoToUpdate = todoList.find((todo) => todo.id === id);
      const payload = {
        records: [
          {
            id: id,
            fields: {
              title: todoToUpdate.title,
              isCompleted: true,
            },
          },
        ],
      };

      const resp = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error('Failed to complete todo');
    } catch (error) {
      console.error(error);
      setTodoList(originalTodos);
      setErrorMessage(error.message);
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

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

    try {
      const resp = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error('Failed to update todo');

      const { records } = await resp.json();
      const updatedTodo = {
        id: records[0].id,
        ...records[0].fields,
        isCompleted: records[0].fields.isCompleted || false,
      };

      setTodoList((prev) =>
        prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting changes...`);
      setTodoList((prev) =>
        prev.map((todo) => (todo.id === originalTodo.id ? originalTodo : todo))
      );
    }
  };

  return (
    <AppContainer>
      <Header title={title} />
      <div className={styles.container}>
        <Routes>
          <Route
            path="/"
            element={
              <TodosPage
                todoList={currentTodos} 
                isLoading={isLoading}
                errorMessage={errorMessage}
                isSaving={isSaving}
                sortField={sortField}
                sortDirection={sortDirection}
                queryString={queryString}
                handleAddTodo={handleAddTodo}
                completeTodo={completeTodo}
                updateTodo={updateTodo}
                setSortDirection={setSortDirection}
                setSortField={setSortField}
                setQueryString={setQueryString}
                totalPages={totalPages} 
                currentPage={currentPage}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AppContainer>
  );
}

export default App;
