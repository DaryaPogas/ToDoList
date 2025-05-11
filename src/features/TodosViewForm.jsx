import React from "react";

const TodosViewForm = ({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString
}) => {

  const preventRefresh = (event) =>{
    event.preventDefault()
  };

  const handleClear = () => {
    setQueryString('');
  };

  return (
    <form onSubmit={preventRefresh}>
      <div className="form-control">
        <label htmlFor="search">Search todos:</label>
        <input
          id="search"
          type="text"
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
        />
        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </div>

      <div className="form-control">
        <label htmlFor="sort-by">Sort by</label>
        <select
          id="sort-by"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>
      </div>

      <div className="form-control">
        <label htmlFor="sort-direction">Direction</label>
        <select
          id="sort-direction"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      
    </form>
  );
};

export default TodosViewForm;
