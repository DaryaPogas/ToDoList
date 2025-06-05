import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="about-page">
      <h2>About This Todo App</h2>
      <p>
        This is a todo list app built with React, React Router,
        and styled-components. It allows you to create, manage, and organize
        your tasks efficiently.
      </p>
      <p>Features:</p>
      <ul>
        <li>Add new tasks</li>
        <li>Mark tasks as completed</li>
        <li>Edit existing tasks</li>
        <li>Filter and sort tasks</li>
      </ul>
      <p>Created by Darya Pogas</p>
      <Link to="/" className="back-link">
        ← Back to Todo List
      </Link>
    </div>
  );
}
