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
import EditPost from "./components/EditPost";
import FlashMessage from "./components/FlashMessage";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import Search from "./components/Search";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import { CSSTransition } from "react-transition-group";
import Chat from "./components/Chat";

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
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  };
  const removeFlashMessage = () => {
    setTimeout(() => dispatch({ type: "flashMessage" }), 2000);
  };
  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.payload;

        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "flashMessage":
        draft.flashMessage = action.payload;
        removeFlashMessage();
        return;
      case "openSearch":
        draft.isSearchOpen = true;
        return;
      case "closeSearch":
        draft.isSearchOpen = false;
        return;
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen;
        return;
      case "closeChat":
        draft.isChatOpen = false;
        return;
      case "increaseUnreadCount":
        draft.unreadChatCount++;
        return;
      case "resetUnreadCount":
        draft.unreadChatCount = 0;
        return;
      default:
        return;
    }
  };
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("dev-meet-token", state.user.token);

      localStorage.setItem("dev-meet-name", state.user.username);
      localStorage.setItem("dev-meet-avatar", state.user.avatar);
    } else {
      localStorage.removeItem("dev-meet-token");
      localStorage.removeItem("dev-meet-name");
      localStorage.removeItem("dev-meet-avatar");
    }
  }, [state.loggedIn]);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          <FlashMessage />
          <div>
            <Header />
            <Switch>
              <Route path="/profile/:username" component={Profile} />
              <Route
                exact
                path="/"
                render={() =>
                  state.loggedIn ? <Home /> : <HomeGuest />
                }
              />
              <Route
                exact
                path="/create-post"
                component={CreatePost}
              />
              <Route
                exact
                path="/posts/:id"
                component={ViewSinglePost}
              />
              <Route
                exact
                path="/posts/:id/edit"
                component={EditPost}
              />
              <Route exact path="/about-us" component={About} />
              <Route exact path="/terms" component={Terms} />
              <Route component={NotFound} />
            </Switch>
          </div>
          <CSSTransition
            in={state.isSearchOpen}
            timeout={330}
            classNames="search-overlay"
            unmountOnExit>
            <Search />
          </CSSTransition>
          <Chat />
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
