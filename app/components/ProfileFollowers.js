import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import Moment from "react-moment";
import LoadingDotsIcon from "./LoadingDotsIcon";

const ProfileFollowers = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  useEffect(() => {
    const request = Axios.CancelToken.source();
    async function fetchFollowers() {
      const res = await Axios.get(`/profile/${username}/followers`, {
        cancelToken: request.token,
      });
      console.log(res);
      setFollowers(res.data);
      setIsLoading(false);
    }
    fetchFollowers();

    return () => {
      request.cancel();
    };
  }, [username]);
  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <div className="list-group">
      {followers.map((follower, index) => {
        return (
          <Link
            key={index}
            to={`/profile/${follower.username}`}
            className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={follower.avatar} />
            <span className="ml-2">{follower.username}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default ProfileFollowers;
