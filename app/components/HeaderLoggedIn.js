import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ExampleContext from "../ExampleContext";
const HeaderLoggedIn = () => {
  const logout = () => {
    localStorage.removeItem("dev-meet-token");
    localStorage.removeItem("dev-meet-name");
    localStorage.removeItem("dev-meet-avatar");
    setLoggedIn(false);
  };
  const { setLoggedIn } = useContext(ExampleContext);
  return (
    <div className="flex-row my-3 my-md-0 mr-3">
      <a href="#" className="text-white mr-3 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <span className="mr-3 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <a href="#" className="mr-3">
        <img
          className="small-header-avatar"
          src={localStorage.getItem("dev-meet-avatar")}
        />
      </a>
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
