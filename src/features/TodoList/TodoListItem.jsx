import { useState, useEffect } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);

  const handleCancel = () => {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  };

  const handleEdit = (e) => {
    setWorkingTitle(e.target.value);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    onUpdateTodo({
      id: todo.id,
      title: workingTitle,
      isCompleted: todo.isCompleted,
    });
    setIsEditing(false);
  };

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`edit-${todo.id}`}
              label="Edit Todo"
              value={workingTitle}
              onChange={handleEdit}
            />
            <button
              type="button"
              onClick={handleCancel}
              style={{ marginLeft: '8px' }}
            >
              Cancel
            </button>

            <button type="submit" style={{ marginLeft: '8px' }}>
              Update
            </button>
          </>
        ) : (
          <>
            <label>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />

              <span onClick={() => setIsEditing(true)}>{todo.title}</span>
            </label>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
