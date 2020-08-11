import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import Moment from "react-moment";
import LoadingDotsIcon from "./LoadingDotsIcon";

const ProfileFollowing = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [following, setFollowing] = useState([]);
  useEffect(() => {
    const request = Axios.CancelToken.source();
    async function fetchfollowing() {
      const res = await Axios.get(`/profile/${username}/following`, {
        cancelToken: request.token,
      });
      console.log(res);
      setFollowing(res.data);
      setIsLoading(false);
    }
    fetchfollowing();

    return () => {
      request.cancel();
    };
  }, [username]);
  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <div className="list-group">
      {following.map((following, index) => {
        return (
          <Link
            key={index}
            to={`/profile/${following.username}`}
            className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={following.avatar} />
            <span className="ml-2">{following.username}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default ProfileFollowing;
