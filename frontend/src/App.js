import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/UserManagement/LoginPage";
import RegisterPage from "./components/UserManagement/RegisterPage";
import EditorPage from "./components/Editor/EditorPage";

import ProtectedRoutes from "./auth/router/ProtectedRoutes";
import LocalStorageService from "./auth/services/LocalStorageService";
import "./App.css";

function App() {
  const [isAuth, setisAuth] = useState(false);

  useEffect(() => {
    if (LocalStorageService.isAuth()) {
      setisAuth(true);
    } else {
      setisAuth(false);
    }
  }, []);

  return (
    <div>
      <Router>
        <Switch>
          <ProtectedRoutes exact path="/" component={HomePage} />
          <ProtectedRoutes exact path="/editor-page" component={EditorPage} />
          <Route
            exact
            path="/register"
            render={() => (!isAuth ? <RegisterPage /> : <Redirect to="/" />)}
          />
          <Route
            exact
            path="/login"
            render={() => (!isAuth ? <LoginPage /> : <Redirect to="/" />)}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
