import React, { useContext, useRef, useEffect } from "react";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import io from "socket.io-client";

const Chat = () => {
  const socket = useRef(null);
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const { isChatOpen, user } = useContext(StateContext);
  const { username, avatar, token } = user;
  const dispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    chatMessages: [],
    fieldValue: "",
  });

  useEffect(() => {
    chatField.current.focus();
    dispatch({ type: "resetUnreadCount" });
  }, [isChatOpen]);

  useEffect(() => {
    socket.current = io.connect("http://localhost:8080", {
      transports: ["websocket"],
    });
    socket.current.on("chatFromServer", (message) => {
      setState((draft) => {
        draft.chatMessages.push(message);
      });
    });

    return () => socket.current.disconnect();
  }, []);

  useEffect(() => {
    if (state.chatMessages.length > 0) {
      chatLog.current.scrollTop = chatLog.current.scrollHeight;
      if (!isChatOpen) {
        dispatch({ type: "increaseUnreadCount" });
      }
    }
  }, [state.chatMessages]);
  const handleSubmit = (e) => {
    e.preventDefault();
    //send message to server
    socket.current.emit("chatFromBrowser", {
      message: state.fieldValue,
      token,
    });

    setState((draft) => {
      draft.chatMessages.push({
        message: draft.fieldValue,
        username,
        avatar,
      });
      draft.fieldValue = "";
    });
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setState((draft) => {
      draft.fieldValue = value;
    });
  };
  return (
    <div
      id="chat-wrapper"
      className={
        "chat-wrapper shadow border-top border-left border-right " +
        (isChatOpen && "chat-wrapper--is-visible")
      }>
      <div className="chat-title-bar bg-dark p-2 ">
        Chat
        <span
          onClick={() => {
            dispatch({ type: "closeChat" });
          }}
          className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((messageObj, index) => {
          if (messageObj.username === user.username) {
            return (
              <div className="chat-self" key={index}>
                <div className="chat-message">
                  <div className="chat-message-inner">{messageObj.message}</div>
                </div>
                <img
                  className="chat-avatar avatar-tiny"
                  src={messageObj.avatar}
                />
              </div>
            );
          } else {
            return (
              <div className="chat-other" key={index}>
                <Link to={`/profile/${messageObj.username}`}>
                  <img className="avatar-tiny" src={messageObj.avatar} />
                </Link>
                <div className="chat-message">
                  <div className="chat-message-inner">
                    <Link to={`/profile/${messageObj.username}`}>
                      <strong>{messageObj.username}:</strong>
                    </Link>{" "}
                    {messageObj.message}
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        id="chatForm"
        className="chat-form border-top">
        <input
          ref={chatField}
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
          onChange={handleChange}
          value={state.fieldValue}
        />
      </form>
    </div>
  );
};

export default Chat;

// https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128 dog-avatar
