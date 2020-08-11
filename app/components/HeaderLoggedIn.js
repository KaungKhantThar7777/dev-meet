import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import ReactTooltip from "react-tooltip";

const HeaderLoggedIn = () => {
  const logout = () => {
    dispatch({ type: "logout" });
  };
  const dispatch = useContext(DispatchContext);
  const { user, unreadChatCount } = useContext(StateContext);
  const handleSearchOpen = (e) => {
    e.preventDefault();

    dispatch({ type: "openSearch" });
  };
  return (
    <div className="flex-row my-4 my-md-0 mr-3">
      <a
        data-tip="Search"
        data-for="search"
        href="#"
        onClick={handleSearchOpen}
        className="text-white mr-3 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <ReactTooltip place="bottom" id="search" />
      <span
        onClick={() => dispatch({ type: "toggleChat" })}
        data-tip="Chat"
        data-for="chat"
        className="mr-3 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        {unreadChatCount > 0 && (
          <span className="chat-count-badge bg-info text-white">
            {unreadChatCount}{" "}
          </span>
        )}
      </span>
      <ReactTooltip place="bottom" id="chat" />
      <Link
        data-tip="My Profile"
        data-for="profile"
        to={`/profile/${user.username}`}
        className="mr-3">
        <img className="small-header-avatar" src={user.avatar} />
      </Link>
      <ReactTooltip place="bottom" id="profile" />
      <Link className="btn btn-sm btn-info mr-2" to="/create-post">
        Create Post
      </Link>{" "}
      <button className="btn btn-sm btn-secondary" onClick={logout}>
        Sign Out
      </button>
    </div>
  );
};

export default HeaderLoggedIn;
