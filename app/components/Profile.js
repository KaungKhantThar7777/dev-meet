import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import Page from "./Page";
import { useParams, NavLink, Switch, Route } from "react-router-dom";
import ProfilePosts from "./ProfilePosts";
import ProfileFollowers from "./ProfileFollowers";
import ProfileFollowing from "./ProfileFollowing";
import { useImmer } from "use-immer";
import StateContext from "../StateContext";

const Profile = () => {
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      counts: { postCount: 0, followerCount: 0, followingCount: 0 },
      isFollowing: false,
      profileAvatar:
        "https://gravatar.com/avatar/489102ec74f9098895690ca7b3146?s=128",
      profileUsername: "",
    },
  });

  const { username } = useParams();
  const {
    profileUsername,
    profileAvatar,
    isFollowing,
    counts: { postCount, followerCount, followingCount },
  } = state.profileData;
  useEffect(() => {
    const request = Axios.CancelToken.source();

    async function fetchData() {
      const res = await Axios.post(`/profile/${username}`);

      setState((draft) => {
        draft.profileData = res.data;
      });
    }

    fetchData();
    return () => {
      request.cancel();
    };
  }, [username]);

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const request = Axios.CancelToken.source();

      async function fetchData() {
        const res = await Axios.post(
          `/addFollow/${profileUsername}`,
          { token: appState.user.token },
          { cancelToken: request.token }
        );
        console.log(res);
        setState((draft) => {
          draft.profileData.isFollowing = true;
          draft.profileData.counts.followerCount++;
          draft.followActionLoading = false;
        });
      }

      fetchData();
      return () => {
        request.cancel();
      };
    }
  }, [state.startFollowingRequestCount]);

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const request = Axios.CancelToken.source();

      async function fetchData() {
        const res = await Axios.post(
          `/removeFollow/${profileUsername}`,
          { token: appState.user.token },
          { cancelToken: request.token }
        );
        console.log(res);
        setState((draft) => {
          draft.profileData.isFollowing = false;
          draft.profileData.counts.followerCount--;
          draft.followActionLoading = false;
        });
      }

      fetchData();
      return () => {
        request.cancel();
      };
    }
  }, [state.stopFollowingRequestCount]);

  const startFollow = () => {
    setState((draft) => {
      draft.startFollowingRequestCount++;
    });
  };
  const stopFollow = () => {
    setState((draft) => {
      draft.stopFollowingRequestCount--;
    });
  };
  return (
    <Page title="Profile">
      <h2>
        <img className="avatar-small" src={profileAvatar} />{" "}
        {profileUsername}
        {appState.loggedIn &&
          !isFollowing &&
          appState.user.username !== profileUsername &&
          profileUsername && (
            <button
              onClick={startFollow}
              disabled={state.followActionLoading}
              className="btn btn-primary btn-sm ml-2">
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
        {appState.loggedIn &&
          isFollowing &&
          appState.user.username !== profileUsername &&
          profileUsername && (
            <button
              onClick={stopFollow}
              disabled={state.followActionLoading}
              className="btn btn-success btn-sm ml-2">
              Following <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink
          to={`/profile/${username}`}
          className="nav-item nav-link">
          Posts: {postCount}
        </NavLink>
        <NavLink
          to={`/profile/${username}/followers`}
          className="nav-item nav-link">
          Followers: {followerCount}
        </NavLink>
        <NavLink
          to={`/profile/${username}/following`}
          className="nav-item nav-link">
          Following: {followingCount}
        </NavLink>
      </div>

      <Switch>
        <Route
          exact
          path="/profile/:username"
          component={ProfilePosts}
        />
        <Route
          path="/profile/:username/followers"
          component={ProfileFollowers}
        />
        <Route
          path="/profile/:username/following"
          component={ProfileFollowing}
        />
      </Switch>
    </Page>
  );
};

export default Profile;
