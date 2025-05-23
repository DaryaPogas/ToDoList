import { useRef, useState } from 'react';
import styled from 'styled-components';
import  TextInputWithLabel  from '../shared/TextInputWithLabel';


const StyledButton = styled.button`
  font-style: ${(props) => (props.disabled ? 'italic' : 'normal')};
`;


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
      <StyledButton disabled={workingTodo.length === 0}>Add Todo</StyledButton>
    </form>
  );
};

export default TodoForm;
