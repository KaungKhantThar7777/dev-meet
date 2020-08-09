import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
} from "react-router-dom";
import Axios from "axios";

//components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessage from "./components/FlashMessage";
import ExampleContext from "./ExampleContext";

Axios.defaults.baseURL = "http://localhost:8080";

const Main = () => {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("dev-meet-token"))
  );
  const [flashMessage, setFlashMessage] = useState();

  return (
    <ExampleContext.Provider value={{ setFlashMessage, setLoggedIn }}>
      <Router>
        {flashMessage && <FlashMessage msg={flashMessage} />}
        <Header loggedIn={loggedIn} />
        <Switch>
          <Route
            exact
            path="/"
            render={() => (loggedIn ? <Home /> : <HomeGuest />)}
          />
          <Route exact path="/create-post" component={CreatePost} />
          <Route exact path="/posts/:id" component={ViewSinglePost} />
          <Route exact path="/about-us" component={About} />
          <Route exact path="/terms" component={Terms} />
        </Switch>
        <Footer />
      </Router>
    </ExampleContext.Provider>
  );
};

ReactDOM.render(<Main />, document.querySelector("#app"));
if (module.hot) {
  module.hot.accept();
}
