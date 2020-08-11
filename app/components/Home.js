import React, { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import Page from "./Page";
import StateContext from "../StateContext";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import Post from "./Post";
const Home = () => {
  const { user } = useContext(StateContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchHomeFeed = async () => {
      const res = await Axios.post(
        "/getHomeFeed",
        { token: user.token },
        { cancelToken: ourRequest.token }
      );
      setState((draft) => {
        draft.feed = res.data;
        draft.isLoading = false;
      });
    };

    fetchHomeFeed();
  }, []);

  if (state.isLoading) {
    return <LoadingDotsIcon />;
  }
  return (
    <Page title="You Feed">
      {state.feed.length === 0 && (
        <>
          <h2 className="text-center mt-5">
            Hello <strong>{user.username}</strong>, your feed is
            empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you
            follow. If you don&rsquo;t have any friends to follow
            that&rsquo;s okay; you can use the &ldquo;Search&rdquo;
            feature in the top menu bar to find content written by
            people with similar interests and then follow them.
          </p>
        </>
      )}
      {state.feed.length > 0 && (
        <>
          <h2 className="text-center my-4">
            Latest Posts from Those You Have Followed
          </h2>
          <div className="list-group">
            {state.feed.map((feed) => {
              return <Post post={feed} key={feed._id} />;
            })}
          </div>
        </>
      )}
    </Page>
  );
};

export default Home;
