import React, { useState, useEffect } from "react";
import Axios from "axios";
import Page from "./Page";
import { useParams } from "react-router-dom";
import ProfilePosts from "./ProfilePosts";
const Profile = () => {
  const [profileData, setProfileData] = useState({
    counts: { postCount: 0, followerCount: 0, followingCount: 0 },
    isFollowing: false,
    profileAvatar:
      "https://gravatar.com/avatar/489102ec74f9098895690ca7b3146?s=128",
    profileUsername: "",
  });

  const { username } = useParams();
  useEffect(() => {
    const request = Axios.CancelToken.source();

    async function fetchData() {
      const profileData = await Axios.post(`/profile/${username}`);

      setProfileData(profileData.data);
    }

    fetchData();
    return () => {
      request.cancel();
    };
  }, []);

  const {
    profileUsername,
    profileAvatar,
    isFollowing,
    counts: { postCount, followerCount, followingCount },
  } = profileData;
  return (
    <Page title="Profile">
      <h2>
        <img className="avatar-small" src={profileAvatar} />{" "}
        {profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="nav-item nav-link">
          Posts: {postCount}
        </a>
        <a href="#" className="active nav-item nav-link">
          Followers: {followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {followingCount}
        </a>
      </div>

      <ProfilePosts />
    </Page>
  );
};

export default Profile;
