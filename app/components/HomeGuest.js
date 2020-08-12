import React, { useState, useEffect, useContext } from "react";
import { useImmerReducer, useImmer } from "use-immer";
import Page from "./Page";
import Axios from "axios";
import { CSSTransition } from "react-transition-group";
import DispatchContext from "../DispatchContext";
const HomeGuest = () => {
  const appDispatch = useContext(DispatchContext);
  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: null,
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: "",
      hasErrors: false,
      message: null,
      isUnique: false,
      checkCount: 0,
    },
    password: {
      value: "",
      hasErrors: false,
      message: null,
    },
    submitCount: 0,
  };

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "usernameImmediately":
        draft.username.hasErrors = false;
        draft.username.value = action.payload;
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true;
          draft.username.message =
            "Username can't exceed 30 characters";
        }
        if (
          draft.username.value &&
          !/^([a-zA-Z0-9]+)$/.test(draft.username.value)
        ) {
          draft.username.hasErrors = true;
          draft.username.message =
            "Username can contain only letters and numbers";
        }
        return;
      case "usernameAfterDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true;
          draft.username.message =
            "Username must be at least 3 characters long.";
        }
        if (!draft.username.hasErrors && !action.noRequest) {
          draft.username.checkCount++;
        }
        return;
      case "usernameUniqueResults":
        if (action.payload) {
          draft.username.hasErrors = true;
          draft.username.isUnique = false;
          draft.username.message = "That username is already taken";
        }
        return;
      case "emailImmediately":
        draft.email.hasErrors = false;
        draft.email.value = action.payload;
        return;
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.message =
            "Please provide a valid email address.";
        }
        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.hasErrors = false;
          draft.email.message = null;
          draft.email.checkCount++;
        }

        return;
      case "emailUniqueResults":
        if (action.payload) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.message = "That email is already used";
        }
        return;
      case "passwordImmediately":
        draft.password.hasErrors = false;
        draft.password.value = action.payload;
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true;
          draft.password.message =
            "Password should not exceed 50 characters.";
        }
        return;
      case "passwordAfterDelay":
        if (draft.password.value.length < 6) {
          draft.password.hasErrors = true;
          draft.password.message =
            "Password must be at least 6 characters long.";
        }
        return;
      case "submitCount":
        if (
          !draft.username.hasErrors &&
          !draft.email.hasErrors &&
          !draft.password.hasErrors &&
          !draft.username.isUnique &&
          !draft.email.isUnique
        ) {
          draft.submitCount++;
        }
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(
        () => dispatch({ type: "usernameAfterDelay" }),
        800
      );
      return () => clearTimeout(delay);
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.username.checkCount) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchUserExist() {
        try {
          const res = await Axios.post(
            "/doesUsernameExist",
            { username: state.username.value },
            { cancelToken: ourRequest.token }
          );

          dispatch({
            type: "usernameUniqueResults",
            payload: res.data,
          });
        } catch (err) {
          console.log("Something went wrong", err);
        }
      }
      fetchUserExist();
      return () => ourRequest.cancel();
    }
  }, [state.username.checkCount]);

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(
        () => dispatch({ type: "emailAfterDelay" }),
        800
      );
      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.email.checkCount) {
      const ourRequest = Axios.CancelToken.source();
      const fetchEmailExist = async () => {
        try {
          const res = await Axios.post(
            "doesEmailExist",
            { email: state.email.value },
            { cancelToken: ourRequest.token }
          );

          dispatch({ type: "emailUniqueResults", payload: res.data });
        } catch (err) {
          console.log(err);
        }
      };
      fetchEmailExist();

      return () => ourRequest.cancel();
    }
  }, [state.email.checkCount]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(
        () => dispatch({ type: "passwordAfterDelay" }),
        800
      );
      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  useEffect(() => {
    if (state.submitCount) {
      const ourRequest = Axios.CancelToken.source();

      const register = async () => {
        try {
          const res = await Axios.post("/register", {
            username: state.username.value,
            email: state.email.value,
            password: state.password.value,
          });

          appDispatch({ type: "login", payload: res.data });
          appDispatch({
            type: "flashMessage",
            payload: `Congrats ${res.data.username}! Welcome to your new account`,
          });
        } catch (err) {
          console.log("Something went wrong :(");
        }
      };

      register();

      return () => ourRequest.cancel();
    }
  }, [state.submitCount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({
      type: "usernameImmediately",
      payload: state.username.value,
    });
    dispatch({
      type: "usernameAfterDelay",
      payload: state.username.value,
      noRequest: true,
    });
    dispatch({
      type: "emailImmediately",
      payload: state.email.value,
    });
    dispatch({
      type: "emailAfterDelay",
      payload: state.email.value,
      noRequest: true,
    });
    dispatch({
      type: "passwordImmediately",
      payload: state.password.value,
    });
    dispatch({
      type: "passwordAfterDelay",
      payload: state.password.value,
    });

    dispatch({ type: "submitCount" });
  };
  return (
    <Page title="Welcome!" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3"> Remember Writing ? </h1>{" "}
          <p className="lead text-muted">
            Are you sick of short tweets and impersonal &ldquo;shared
            &rdquo; posts that are reminiscent of the late 90 &rsquo;
            s email forwards ? We believe getting back to actually
            writing is the key to enjoying the internet again.{" "}
          </p>{" "}
        </div>{" "}
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label
                htmlFor="username-register"
                className="text-muted mb-1">
                <small> Username </small>{" "}
              </label>{" "}
              <input
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
                value={state.username.value}
                onChange={(e) =>
                  dispatch({
                    type: "usernameImmediately",
                    payload: e.target.value,
                  })
                }
              />
              <CSSTransition
                in={state.username.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>{" "}
            <div className="form-group">
              <label
                htmlFor="email-register"
                className="text-muted mb-1">
                <small> Email </small>{" "}
              </label>{" "}
              <input
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
                value={state.email.value}
                onChange={(e) =>
                  dispatch({
                    type: "emailImmediately",
                    payload: e.target.value,
                  })
                }
              />
              <CSSTransition
                in={state.email.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">
                  {state.email.message}
                </div>
              </CSSTransition>
            </div>{" "}
            <div className="form-group">
              <label
                htmlFor="password-register"
                className="text-muted mb-1">
                <small> Password </small>{" "}
              </label>{" "}
              <input
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Create a password"
                value={state.password.value}
                onChange={(e) =>
                  dispatch({
                    type: "passwordImmediately",
                    payload: e.target.value,
                  })
                }
              />
              <CSSTransition
                in={state.password.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">
                  {state.password.message}
                </div>
              </CSSTransition>
            </div>{" "}
            <button
              type="submit"
              className="py-1 mt-4 btn btn-info btn-block">
              Sign up{" "}
            </button>{" "}
          </form>{" "}
        </div>{" "}
      </div>{" "}
    </Page>
  );
};

export default HomeGuest;
