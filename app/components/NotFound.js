import React from "react";
import { Link } from "react-router-dom";
import Page from "./Page";
const NotFound = () => {
  return (
    <Page title="Not found">
      <h4 className="not-found text-muted">
        Oops! we cannot find the page
      </h4>
      <p className="lead text-muted">
        You can always return to <Link to="/">home</Link> to get fresh
        start
      </p>
    </Page>
  );
};

export default NotFound;
