import { useRef, useState } from 'react';
import  TextInputWithLabel  from '../shared/TextInputWithLabel';

const TodoForm = ({ onAddTodo }) => {
  const [workingTodo, setWorkingTodo] = useState('');
  const inputRef = useRef(null);

  function handleAddTodo(event) {
    event.preventDefault();

    const newTodo = {
      id: Date.now(),
      title: workingTodo,
    };
    //console.log(newTodo);

    onAddTodo(newTodo);
    setWorkingTodo('');
    inputRef.current?.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        value={workingTodo}
        onChange={(event) => setWorkingTodo(event.target.value)}
      />
      <button disabled={workingTodo.length === 0}>Add Todo</button>
    </form>
  );
};

export default TodoForm;
