import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

const HeaderLoggedIn = () => {
  const logout = () => {
    dispatch({ type: "logout" });
  };
  const dispatch = useContext(DispatchContext);
  const { user } = useContext(StateContext);
  const handleSearchOpen = (e) => {
    e.preventDefault();

    dispatch({ type: "openSearch" });
  };
  return (
    <div className="flex-row my-3 my-md-0 mr-3">
      <a
        href="#"
        onClick={handleSearchOpen}
        className="text-white mr-3 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <span className="mr-3 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <Link to={`/profile/${user.username}`} className="mr-3">
        <img className="small-header-avatar" src={user.avatar} />
      </Link>
      <Link className="btn btn-sm btn-info mr-2" to="/create-post">
        Create Post
      </Link>
      <button className="btn btn-sm btn-secondary" onClick={logout}>
        Sign Out
      </button>
    </div>
  );
};

export default HeaderLoggedIn;
