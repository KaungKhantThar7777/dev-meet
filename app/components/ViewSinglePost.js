import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import { Link, useParams, Redirect } from "react-router-dom";
import Moment from "react-moment";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown";
import ReactTooktip from "react-tooltip";
import NotFound from "./NotFound";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

import Axios from "axios";
const ViewSinglePost = () => {
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState([]);
  const [deleteAttemptCount, setDeleteAttemptCount] = useState(0);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const isOwner = () => {
    if (appState.loggedIn) {
      return appState.user.username === post.author.username;
    }
    return false;
  };
  const handleDelete = () => {
    const sureToDelete = window.confirm(
      "Are you sure to delete this post?"
    );
    if (sureToDelete) {
      setDeleteAttemptCount((prev) => prev + 1);
    }
  };
  useEffect(() => {
    const request = Axios.CancelToken.source();

    async function fetchPost() {
      const res = await Axios.get(`/post/${id}`, {
        cancelToken: request.token,
      });
      setPost(res.data);

      setIsLoading(false);
    }
    fetchPost();

    return () => {
      request.cancel();
    };
  }, []);

  useEffect(() => {
    if (deleteAttemptCount) {
      const request = Axios.CancelToken.source();

      async function fetchPost() {
        const res = await Axios.delete(
          `/post/${id}`,
          { data: { token: appState.user.token } },
          {
            cancelToken: request.token,
          }
        );
        if (res.data === "Success") {
          setDeleteSuccess(true);
        }
      }
      fetchPost();

      return () => {
        request.cancel();
      };
    }
  }, [deleteAttemptCount]);

  if (deleteSuccess) {
    dispatch({
      type: "flashMessage",
      payload: "Deleted successfully",
    });
    setTimeout(() => {
      dispatch({
        type: "flashMessage",
      });
    }, 2000);
    return <Redirect to={`/profile/${post.author.username}`} />;
  }
  if (!isLoading && !post) {
    return <NotFound />;
  }
  if (isLoading) {
    return <LoadingDotsIcon />;
  }
  return (
    <Page title="View Single Post">
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/posts/${post._id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooktip id="edit" />{" "}
            <a
              onClick={handleDelete}
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger">
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooktip id="delete" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on <Moment format="DD/MM/YYYY">{post.createdDate}</Moment>
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} />
      </div>
    </Page>
  );
};

export default ViewSinglePost;
