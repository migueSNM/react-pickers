import React, { Component } from 'react';
import './App.css';
import './components/TaskPicker/TaskPicker'
import TaskPicker from "./components/TaskPicker";

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      returnedTaskIds: [],
    };

  }

  handleReturnedIds = (ids) => {
    this.setState({
      returnedTaskIds: ids,
    })
  };

  render() {
    return (
      <div className="App">
        <TaskPicker handleReturnedIds = {this.handleReturnedIds}/>
      </div>
    );
  }
}

export default App;
