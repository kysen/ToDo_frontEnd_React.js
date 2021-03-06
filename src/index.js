import React from "react";
import ReactDOM from "react-dom";

import "./styles/styles.css";
import TodoItem from "./todoItem";
import Axios from "axios";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      todo: "",
      todos: []
    };
  }

  componentDidMount() {
    fetch("http://127.0.0.1:5000/todos")
      .then(response => response.json())
      .then(data =>
        this.setState({
          todos: data
        })
      );
  }

  onChange = event => {
    this.setState({
      todo: event.target.value
    });
  };

  renderTodos = () => {
    return this.state.todos.map(item => {
      return (
        <TodoItem key={item.id} item={item} deleteItem={this.deleteItem} />
      );
    });
  };

  addTodo = event => {
    event.preventDefault();

    Axios({
      method: "post",
      url: "http://127.0.0.1:5000/add-todo",
      headers: { "content-type": "application/json" },
      data: {
        title: this.state.todo,
        done: false
      }
    })
      .then(data => {
        this.setState({
          todos: [...this.state.todos, data.data],
          todo: ""
        });
      })
      .catch(error => console.log(error));
  };

  deleteItem = id => {
    fetch(`http://127.0.0.1:5000/todo/${id}`, {
      method: "DELETE"
    })
      .then(
        this.setState({
          todos: this.state.todos.filter(item => {
            return item.id !== id;
          })
        })
      )
      .catch(error => console.log(error));
  };

  render() {
    return (
      <div className="app">
        <h1>To-Do List</h1>
        <form className="add-todo">
          <input
            type="text"
            placeholder="Add To-Do"
            onChange={this.onChange}
            value={this.state.todo}
          />
          <button onClick={this.addTodo}>Add</button>
        </form>
        {this.renderTodos()}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
