import React, { useContext, useEffect } from "react";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import Axios from "axios";
import Moment from "react-moment";
import { Link } from "react-router-dom";
const Search = () => {
  const dispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

  const handleTyping = (e) => {
    if (e.keyCode === 27) {
      dispatch({ type: "closeSearch" });
    }
  };
  useEffect(() => {
    document.addEventListener("keyup", handleTyping);
    return () => document.removeEventListener("keyup", handleTyping);
  }, []);

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState((draft) => {
        draft.show = "loading";
      });
      const delay = setTimeout(() => {
        setState((draft) => {
          draft.requestCount++;
        });
      }, 3000);

      return () => clearTimeout(delay);
    } else {
      setState((draft) => {
        draft.show = "neither";
      });
    }
  }, [state.searchTerm]);
  useEffect(() => {
    if (state.requestCount) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchPosts() {
        try {
          const res = await Axios.post(
            "/search",
            { searchTerm: state.searchTerm },
            { cancelToken: ourRequest.token }
          );

          setState((draft) => {
            draft.results = res.data;
            draft.show = "results";
          });
        } catch (err) {
          console.log("Something went wrong", err);
        }
      }
      fetchPosts();
      return () => ourRequest.cancel();
    }
  }, [state.requestCount]);
  const handleChange = (e) => {
    const value = e.target.value;
    setState((draft) => {
      draft.searchTerm = value;
    });
  };
  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label
            htmlFor="live-search-field"
            className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field text-muted"
            placeholder="What are you interested in?"
            onChange={handleChange}
          />
          <span
            onClick={() => dispatch({ type: "closeSearch" })}
            className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div
            className={
              "circle-loader mt-3 " +
              (state.show === "loading" && "circle-loader--visible")
            }></div>
          <div
            className={`live-search-results ${
              state.show === "results" &&
              "live-search-results--visible"
            }`}>
            <div className="list-group shadow-sm">
              <div className="list-group-item active">
                <strong>Search Results</strong> (
                {state.results.length}{" "}
                {state.results.length === 1 ? "item" : "items"} found)
              </div>
              {state.results.map((post) => {
                return (
                  <Link
                    onClick={() => dispatch({ type: "closeSearch" })}
                    key={post._id}
                    to={`/posts/${post._id}`}
                    className="list-group-item list-group-item-action">
                    <img
                      className="avatar-tiny"
                      src={post.author.avatar}
                    />
                    <strong>{post.title}</strong>{" "}
                    <span className="text-muted small">
                      by {post.author.username}
                    </span>{" "}
                    on{" "}
                    {
                      <Moment format="DD/MM/YYYY">
                        {post.createdDate}
                      </Moment>
                    }
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
