import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import RichTextEditor from "./components/RichTextEditor";
import HomePage from "./components/HomePage";
import LoginPage from "./components/UserManagement/LoginPage";
import RegisterPage from "./components/UserManagement/RegisterPage";
import "./App.css";

class App extends Component {
  render (){
    return (
      <div>
          <Router>
            <Switch>
              <Route exact path='/' component={RichTextEditor} />
              <Route exact path='/home' component={HomePage}/>
              <Route exact path='/login' component={LoginPage} />
              <Route exact path='/register' component={RegisterPage} />
              <Route exact path='/editor' component={RichTextEditor} />
            </Switch>
          </Router>
      </div>
    )
  }
}

export default App;
