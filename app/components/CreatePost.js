import React, { useState, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [wasSuccess, setWasSuccess] = useState(false);
  const {
    user: { token },
  } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await Axios.post("/create-post", {
        title,
        body,
        token,
      });
      setWasSuccess(res.data);
    } catch (err) {
      console.log(err);
      setWasSuccess(false);
    }
  };

  if (wasSuccess) {
    dispatch({
      type: "flashMessage",
      payload: "Congrats! You created post successfully",
    });
    setTimeout(() => {
      dispatch({ type: "flashMessage" });
    }, 2000);

    return <Redirect to={`/posts/${wasSuccess}`} />;
  }
  return (
    <Page title="Create Post">
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
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
            value={body}
            onChange={(e) => setBody(e.target.value)}></textarea>
        </div>

        <button className="btn btn-block btn-info">Save Post</button>
      </form>
    </Page>
  );
};

export default CreatePost;
