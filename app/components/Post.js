import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
const Post = ({ post, onClick }) => {
  return (
    <Link
      onClick={onClick}
      key={post._id}
      to={`/posts/${post._id}`}
      className="list-group-item list-group-item-action">
      <img className="avatar-tiny" src={post.author.avatar} />
      <strong>{post.title}</strong> by{" "}
      <span className="font-weight-bold">{post.author.username}</span>{" "}
      on {<Moment format="DD/MM/YYYY">{post.createdDate}</Moment>}
    </Link>
  );
};

export default Post;
