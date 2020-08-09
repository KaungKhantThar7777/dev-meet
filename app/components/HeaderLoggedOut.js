import React, { useState, useContext } from "react";
import Axios from "axios";
import ExampleContext from "../ExampleContext";
const HeaderLoggedOut = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setLoggedIn } = useContext(ExampleContext);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await Axios.post("/login", {
        username,
        password,
      });
      if (res.data) {
        localStorage.setItem("dev-meet-token", res.data.token);
        localStorage.setItem("dev-meet-name", res.data.username);
        localStorage.setItem("dev-meet-avatar", res.data.avatar);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      console.log(res);
    } catch (err) {
      console.log("There was a problem", err);
    }
  };

  return (
    <form className="mb-0 pt-2 pt-md-0" onSubmit={handleSubmit}>
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="username"
            className="form-control form-control-sm input-dark"
            type="text"
            placeholder="Username"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>{" "}
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="password"
            className="form-control form-control-sm input-dark"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>{" "}
        <div className="col-md-auto">
          <button className="btn btn-info btn-sm"> Sign In </button>{" "}
        </div>{" "}
      </div>{" "}
    </form>
  );
};

export default HeaderLoggedOut;
