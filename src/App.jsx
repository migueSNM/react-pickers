import React, { Component } from 'react';
import './App.css';
import './components/TaskPicker/TaskPicker'
import TaskPicker from "./components/TaskPicker";
import TaskTemplatePicker from "./components/TaskTemplatePicker";

class App extends Component {
  render() {
    return (
      <div className="App">
        <TaskPicker/>
        <TaskTemplatePicker/>
      </div>
    );
  }
}

export default App;
