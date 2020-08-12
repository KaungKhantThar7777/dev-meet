import React, { useState, useContext } from "react";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
const HeaderLoggedOut = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useContext(DispatchContext);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await Axios.post("/login", {
        username,
        password,
      });
      if (res.data) {
        dispatch({
          type: "flashMessage",
          payload: "Successfully Logged In",
        });
        dispatch({ type: "login", payload: res.data });
      } else {
        dispatch({ type: "logout" });
        dispatch({
          type: "flashMessage",
          payload: "Invalid username / password",
        });
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
