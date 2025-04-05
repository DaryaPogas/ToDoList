import { useRef } from "react";

const TodoForm  = ({onAddTodo}) => {
    const todoTitleInput = useRef(null)
    
    function handleAddTodo (event){
        event.preventDefault()

        const title = event.target.title.value
        const newTodo = {
            id: Date.now(), 
            title: title,
        };
        console.log(newTodo);

        onAddTodo(newTodo)
        event.target.title.value = '';
        todoTitleInput.current.focus();
    }

    return (
      <form onSubmit={handleAddTodo}>
        <label htmlFor="todoTitle">Todo</label>
        <input 
            type="text"
            id="todoTitle" 
            name="title" 
            ref={todoTitleInput}/>
        <button>Add Todo</button>
      </form>
    );
}

export default TodoForm