import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import { Link, useParams, Redirect } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import NotFound from "./NotFound";
import Axios from "axios";

const EditPost = (props) => {
  const { user } = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const initialState = {
    id: useParams().id,
    isFetching: true,
    isSaving: false,
    sendCount: 0,
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    permissionDeny: false,
    notFound: false,
  };
  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.payload.title;
        draft.body.value = action.payload.body;
        draft.isFetching = false;
        if (action.payload.author.username !== user.username)
          draft.permissionDeny = true;

        return;
      case "titleChange":
        draft.title.value = action.payload;
        draft.title.hasErrors = false;
        return;
      case "bodyChange":
        draft.body.value = action.payload;
        draft.body.hasErrors = false;
        return;
      case "sendRequest":
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++;
        }
        return;
      case "sendRequestStarted":
        draft.isSaving = true;
        return;
      case "sendRequestFinished":
        draft.isSaving = false;
        return;
      case "titleRules":
        if (!action.payload.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = "Title should not be empty";
        }
        return;
      case "bodyRules":
        if (!action.payload.trim()) {
          draft.body.hasErrors = true;
          draft.body.message = "Body Content should not be empty";
        }
        return;
      case "notFound":
        draft.notFound = true;
      default:
        return;
    }
  };
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "titleRules", payload: state.title.value });
    dispatch({ type: "bodyRules", payload: state.body.value });
    dispatch({ type: "sendRequest" });
  };
  useEffect(() => {
    const request = Axios.CancelToken.source();

    async function fetchPost() {
      const res = await Axios.get(`/post/${state.id}`, {
        cancelToken: request.token,
      });
      if (res.data)
        dispatch({ type: "fetchComplete", payload: res.data });
      else dispatch({ type: "notFound" });
    }
    fetchPost();

    return () => {
      request.cancel();
    };
  }, []);
  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "sendRequestStarted" });
      const request = Axios.CancelToken.source();

      async function fetchPost() {
        const res = await Axios.post(
          `/post/${state.id}/edit`,
          {
            title: state.title.value,
            body: state.body.value,
            token: user.token,
          },
          {
            cancelToken: request.token,
          }
        );
        dispatch({ type: "sendRequestFinished" });
        appDispatch({
          type: "flashMessage",
          payload: "Congrats! Post was updated successfully.",
        });
        props.history.push(`/posts/${state.id}`);
      }
      fetchPost();

      return () => {
        request.cancel();
      };
    }
  }, [state.sendCount]);
  if (state.notFound) {
    return <NotFound />;
  }
  if (state.isFetching) {
    return <LoadingDotsIcon />;
  }

  if (state.permissionDeny) {
    appDispatch({
      type: "flashMessage",
      payload: "You do not have permission to edit this post",
    });

    return <Redirect to="/" />;
  }
  return (
    <Page title="Edit Post">
      <Link className="btn btn-info btn-sm" to={`/posts/${state.id}`}>
        &laquo; Back to post
      </Link>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            value={state.title.value}
            onChange={(e) =>
              dispatch({
                type: "titleChange",
                payload: e.target.value,
              })
            }
            onBlur={(e) =>
              dispatch({
                type: "titleRules",
                payload: e.target.value,
              })
            }
          />
          {state.title.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label
            htmlFor="post-body"
            className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={state.body.value}
            onChange={(e) =>
              dispatch({
                type: "bodyChange",
                payload: e.target.value,
              })
            }
            onBlur={(e) =>
              dispatch({ type: "bodyRules", payload: e.target.value })
            }></textarea>
          {state.body.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button
          className="btn btn-block btn-info"
          disabled={state.isSaving}>
          {state.isSaving ? "Updating..." : "Update Post"}
        </button>
      </form>
    </Page>
  );
};

export default EditPost;
