import React, { useEffect } from "react";
import Container from "./Container";
const Page = ({ children, title, wide }) => {
  useEffect(() => {
    document.title = `${title} | DevMeet`;
    window.scroll(0, 0);
  }, []);
  return <Container wide={wide}>{children}</Container>;
};

export default Page;
