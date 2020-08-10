import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import Moment from "react-moment";
import LoadingDotsIcon from "./LoadingDotsIcon";

const ProfilePosts = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const request = Axios.CancelToken.source();
    async function fetchPosts() {
      const profilePosts = await Axios.get(
        `/profile/${username}/posts`
      );
      setPosts(profilePosts.data);
      setIsLoading(false);
    }
    fetchPosts();

    return () => {
      request.cancel();
    };
  }, []);
  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <div className="list-group">
      {posts.map((post) => {
        return (
          <Link
            key={post._id}
            to={`/posts/${post._id}`}
            className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={post.author.avatar} />
            <strong>{post.title}</strong> on{" "}
            {<Moment format="DD/MM/YYYY">{post.createdDate}</Moment>}
          </Link>
        );
      })}
    </div>
  );
};

export default ProfilePosts;
