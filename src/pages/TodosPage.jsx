import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import TodoList from '../features/TodoList/TodoList';
import TodoForm from '../features/TodoForm';
import TodosViewForm from '../features/TodosViewForm';

export default function TodosPage({
  todoList,
  isLoading,
  errorMessage,
  isSaving,
  sortField,
  sortDirection,
  queryString,
  handleAddTodo,
  completeTodo,
  updateTodo,
  setSortDirection,
  setSortField,
  setQueryString,
  totalPages,
  currentPage,
  onPageChange,
  itemsPerPage
})
{
const navigate = useNavigate();

useEffect(() => {
  if (
    isNaN(currentPage) ||
    currentPage < 1 ||
    (totalPages > 0 && currentPage > totalPages)
  ) {
    onPageChange(1);
    navigate('/?page=1');
  }
}, [currentPage, totalPages, navigate, onPageChange]);

  return (
    <div className="todos-page">
      <TodoForm onAddTodo={handleAddTodo} isSaving={isSaving} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              onPageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <TodosViewForm
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />
      {errorMessage && (
        <div className="error-message">
          <hr />
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}