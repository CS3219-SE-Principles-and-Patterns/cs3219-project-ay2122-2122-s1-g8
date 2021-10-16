import React from "react";
import ReactDOM from "react-dom";
import { isElement, isElementOfType, act } from "react-dom/test-utils";
import { expect } from "chai";
var jsdom = require("mocha-jsdom");

global.document = jsdom({
  url: "http://localhost:3030/"
});

import HomePage from "../components/HomePage";

let rootContainer;

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