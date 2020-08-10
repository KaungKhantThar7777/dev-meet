import React, { useContext } from "react";
import StateContext from "../StateContext";
const FlashMessage = () => {
  const { flashMessage } = useContext(StateContext);

  if (!flashMessage) {
    return null;
  }
  return (
    <div className="floating-alerts mx-auto">
      <div className="alert alert-success w-100 text-center floating-alert shadow-sm">
        {flashMessage}
      </div>
    </div>
  );
};

export default FlashMessage;
