import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
} from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

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

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

Axios.defaults.baseURL = "http://localhost:8080";

const Main = () => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("dev-meet-token")),
    flashMessage: null,
    user: {
      token: localStorage.getItem("dev-meet-token"),
      username: localStorage.getItem("dev-meet-name"),
      avatar: localStorage.getItem("dev-meet-avatar"),
    },
  };
  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.payload;
        debugger;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "flashMessage":
        draft.flashMessage = action.payload;
        return;
      default:
        return;
    }
  };
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("dev-meet-token", state.user.token);
      debugger;
      localStorage.setItem("dev-meet-name", state.user.username);
      localStorage.setItem("dev-meet-avatar", state.user.avatar);
    } else {
      localStorage.removeItem("dev-meet-token");
      localStorage.removeItem("dev-meet-name");
      localStorage.removeItem("dev-meet-avatar");
    }
    debugger;
  }, [state.loggedIn]);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          <FlashMessage />
          <Header />
          <Switch>
            <Route
              exact
              path="/"
              render={() =>
                state.loggedIn ? <Home /> : <HomeGuest />
              }
            />
            <Route exact path="/create-post" component={CreatePost} />
            <Route
              exact
              path="/posts/:id"
              component={ViewSinglePost}
            />
            <Route exact path="/about-us" component={About} />
            <Route exact path="/terms" component={Terms} />
          </Switch>
          <Footer />
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

ReactDOM.render(<Main />, document.querySelector("#app"));
if (module.hot) {
  module.hot.accept();
}
