import React, { Component } from "react";
import RichTextEditor from "./components/RichTextEditor";
import "./App.css";
class App extends React.Component {
  render() {
    return (
      <div>
        <div className="App">
          <RichTextEditor />
        </div>
      </div>
    );
  }
}

export default App;
