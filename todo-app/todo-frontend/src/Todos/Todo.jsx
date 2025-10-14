

const Todo = (props) => {
    const { todo, deleteTodo, completeTodo } = props;

    const onClickDelete = (todo) => () => {
        deleteTodo(todo)
    }

    const onClickComplete = (todo) => () => {
        completeTodo(todo)
    }

    const doneInfo = (
          <>
            <span>This todo is done</span>
            <span>
              <button onClick={onClickDelete(todo)}> Delete </button>
            </span>
          </>
        )

        const notDoneInfo = (
          <>
            <span>
              This todo is not done
            </span>
            <span>
              <button onClick={onClickDelete(todo)}> Delete </button>
              <button onClick={onClickComplete(todo)}> Set as done </button>
            </span>
          </>
        )

    return (
        <div>
            <span className='todoText'>{todo.text}</span>
            {todo.done ? doneInfo : notDoneInfo}
        </div>
    );
};

export default Todo;