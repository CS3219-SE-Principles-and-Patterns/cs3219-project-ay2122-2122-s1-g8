import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { isElement, isElementOfType, act } from "react-dom/test-utils";
import { expect } from "chai";
import { createMemoryHistory } from 'history';
var jsdom = require("mocha-jsdom");

global.document = jsdom({
  url: "http://localhost:3030/"
});

import HomePage from "../components/HomePage";
import LoginPage from "../components/UserManagement/LoginPage";
import RegisterPage from "../components/UserManagement/RegisterPage";
import EditorPage from "../components/Editor/EditorPage";
import NavBar from "../components/NavBar/NavBar";
import Question from "../components/Editor/question";

let rootContainer;

const history = createMemoryHistory();

const mockedParams = {
  match: { params: { id: 'test' } }
};


beforeEach(() => {
  rootContainer = document.createElement("div");
  document.body.appendChild(rootContainer);
});

afterEach(() => {
  document.body.removeChild(rootContainer);
  rootContainer = null;
});

describe("HomePage Component Testing", () => {

  it("Renders Choose your difficulty level Title", () => {
    act(() => {
      ReactDOM.render(<HomePage />, rootContainer);
    });
    const h1 = rootContainer.querySelector("h1");
    expect(h1.textContent).to.equal("Choose your difficulty level");
  });

  it('renders without crashing', () => {
   act(() => {
     ReactDOM.render(<HomePage />, rootContainer);
   });
   expect(isElement(<HomePage />)).to.equal(true);
   expect(isElementOfType(<HomePage />, HomePage)).to.equal(true);
 });

});

describe("LoginPage Component Testing", () => {

  it("Renders Login to start prepping now! Title", () => {
    act(() => {
      ReactDOM.render(<Router history={history}><LoginPage /></Router>, rootContainer);
    });
    const h1 = rootContainer.querySelector("h1");
    expect(h1.textContent).to.equal("Login to start prepping now!");
  });

  it('renders without crashing', () => {
   act(() => {
     ReactDOM.render(<Router history={history}><LoginPage /></Router>, rootContainer);
   });
   expect(isElement(<LoginPage />)).to.equal(true);
   expect(isElementOfType(<LoginPage />, LoginPage)).to.equal(true);
 });

});

describe("RegisterPage Component Testing", () => {

  it("Renders Sign up for an account on PeerPrep! Title", () => {
    act(() => {
      ReactDOM.render(<Router history={history}><RegisterPage /></Router>, rootContainer);
    });
    const h1 = rootContainer.querySelector("h1");
    expect(h1.textContent).to.equal("Sign up for an account on PeerPrep!");
  });

  it('renders without crashing', () => {
   act(() => {
     ReactDOM.render(<Router history={history}><RegisterPage /></Router>, rootContainer);
   });
   expect(isElement(<RegisterPage />)).to.equal(true);
   expect(isElementOfType(<RegisterPage />, RegisterPage)).to.equal(true);
 });

});

describe("NavBar Component Testing", () => {

  it('renders without crashing', () => {
    act(() => {
      ReactDOM.render(<NavBar />, rootContainer);
    });
    expect(isElement(<NavBar />)).to.equal(true);
    expect(isElementOfType(<NavBar />, NavBar)).to.equal(true);
  });

});

//EditorPage testing

/*describe("Question Component Testing", () => {

  it('renders without crashing', () => {
    act(() => {
      ReactDOM.render(<Question />, rootContainer);
    });
    expect(isElement(<Question />)).to.equal(true);
    expect(isElementOfType(<Question />, Question)).to.equal(true);
  });

});*/
