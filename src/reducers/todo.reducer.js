const actions = {
  //actions in useEffect that loads todos
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  //found in useEffect and addTodo to handle failed requests
  setLoadError: 'setLoadError',
  //actions found in addTodo
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  //found in helper functions
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  //reverts todos when requests fail
  revertTodo: 'revertTodo',
  //action on Dismiss Error button
  clearError: 'clearError',
};

function reducer(state = initialState, action) {
  switch (action.type) {

    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true
      };

    case actions.loadTodos:
      return {
        ...state,
        todoList: action.records.map((record) => ({
          id: record.id,
            ...record.fields,
            createdTime: record.createdTime,
            isCompleted: record.fields.isCompleted || false
        })),
        isLoading: false
      };

    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false
      };

    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };

    case actions.addTodo:
      return {
        ...state,
        todoList: [
          {
            id: action.record.id,
            ...action.record.fields,
            createdTime: action.record.createdTime,
            isCompleted: action.record.fields.isCompleted || false,
          },
          ...state.todoList],
        isSaving: false
      }

    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };

    case actions.updateTodo: {
      const updatedTodoList = state.todoList.map((todo) =>
        todo.id === action.editedTodo.id
          ? {
              ...action.editedTodo,
              createdTime: action.editedTodo.createdTime || todo.createdTime,
            }
          : todo
      )

      const updatedState = {
        ...state,
        todoList: updatedTodoList,
      };

      if (action.error) {
        updatedState.errorMessage = `${action.error.message}. Reverting changes...`;
      }

      return updatedState;
    }

    case actions.completeTodo: {
      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.id
          ? {
              ...todo,
              isCompleted: true,
            }
          : todo
      );
      return {
        ...state,
        todoList: updatedTodos,
      };
    }

    case actions.revertTodo:{
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.originalTodo.id ? action.originalTodo : todo
        ),
        errorMessage: `${action.error.message}. Reverting changes...`,
      };
    }

    case actions.clearError:
      return {
        ...state,
        errorMessage: ''
      };

    default:
      return state;
  }
}

const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
};

export { initialState, actions, reducer };
