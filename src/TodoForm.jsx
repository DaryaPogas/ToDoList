import { useState } from "react";

const TodoForm  = ({onAddTodo}) => {
    const [workingTodo, setWorkingTodo]= useState('')
    
    function handleAddTodo (event){
        event.preventDefault()

        const newTodo = {
            id: Date.now(), 
            title: workingTodo,
        };
        //console.log(newTodo);

        onAddTodo(newTodo)
        setWorkingTodo('');
    }

    return (
      <form onSubmit={handleAddTodo}>
        <label htmlFor="todoTitle">Todo</label>
        <input 
            type="text"
            id="todoTitle" 
            name="title" 
            value={workingTodo}
            onChange={(event) => setWorkingTodo(event.target.value)}
            />
        <button disabled={workingTodo.length === 0}>Add Todo</button>
      </form>
    );
}

export default TodoForm