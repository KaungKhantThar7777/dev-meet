import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className=" bg-dark border-top text-center small text-muted py-3">
      <p>
        <Link to="/" className="mx-1 text-muted">
          Home
        </Link>{" "}
        |
        <Link className="mx-1 text-muted" to="/about-us">
          About Us
        </Link>{" "}
        |
        <Link className="mx-1 text-muted" to="/terms">
          Terms
        </Link>
      </p>
      <p className="m-0">
        Copyright &copy; 2020{" "}
        <Link to="/" className="text-muted">
          DevMeet
        </Link>
        . All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
