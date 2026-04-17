import React, { useState, useEffect, useRef, useReducer } from "react";
import { io } from "socket.io-client";

export let socket;

const initialState = [];

// 2. Define reducer function
function reducer(state, action) {
  switch (action.type) {
    case "add":
      return action.data;
    case "update":
      return [...state, action.data];
    default:
      throw new Error();
  }
}

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, dispatch] = useReducer(reducer, initialState);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    socket = io("http://localhost:85", {
      path: "/socket.io",
      transports: ["websocket"],
      query: { accessToken },
    });
    socket.on("userdetails", (data) => {
      setUserId(data);
      console.log(`Current User: ${data}`);
    });
    socket.on("pvt_msg", (data) => {
      console.log(
        `private messages: ${JSON.stringify(data)} ${JSON.stringify(messages)}`,
      );
      dispatch({ type: "update", data });
    });
    return () => {
      socket.close();
    };
  }, []);

  // 1. Fetch User List (Mocking an API call)
  useEffect(() => {
    fetch("http://localhost:85/user/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200) {
          setUsers(result.data);
          if (result.data.length > 0) setActiveUser(result.data[0]); // Default to first user
        }
      });
  }, []);

  useEffect(() => {
    if (activeUser)
      fetch(`http://localhost:85/chat/get/${activeUser._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === 200) {
            dispatch({ type: "add", data: result.data });
          }
        });
  }, [activeUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      message: inputText,
      senderId: userId,
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    fetch(`http://localhost:85/chat/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ receiverId: activeUser._id, message: inputText }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200)
          console.log(`Successful Server response ${result}`);
        else console.error(`server response ${result}`);
      });

    dispatch({ type: "update", data: newMessage });
    setInputText("");
  };

  return (
    <div style={styles.appContainer}>
      {/* --- Sidebar: User List --- */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>Contacts</div>
        <div style={styles.userList}>
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => setActiveUser(user)}
              style={{
                ...styles.userItem,
                backgroundColor:
                  activeUser?._id === user._id ? "#e7f3ff" : "transparent",
              }}
            >
              <div style={styles.avatar}>{user.name.charAt(0)}</div>
              <div style={styles.userInfo}>
                <div style={styles.userName}>{user.name}</div>
                <div
                  style={{
                    ...styles.status,
                    color: user.status === "online" ? "#28a745" : "#6c757d",
                  }}
                >
                  {user.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Main: Chat Interface --- */}
      <div style={styles.chatMain}>
        <div style={styles.header}>
          <h3>
            {activeUser ? `Chatting with ${activeUser.name}` : "Select a user"}
          </h3>
        </div>

        <div style={styles.messageBox}>
          {messages.map((msg) => (
            <div
              key={msg._id}
              style={{
                ...styles.message,
                alignSelf: msg.senderId === userId ? "flex-end" : "flex-start",
                backgroundColor:
                  msg.senderId === userId ? "#007bff" : "#f0f0f0",
                color: msg.senderId === userId ? "white" : "black",
              }}
            >
              <div style={styles.messageText}>{msg.message}</div>
              <div style={styles.timestamp}>{msg.createdAt}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} style={styles.inputArea}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            style={styles.input}
          />
          <button type="submit" style={styles.sendButton}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  appContainer: {
    display: "flex",
    height: "90vh",
    maxWidth: "1000px",
    margin: "20px auto",
    border: "1px solid #ddd",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  },
  sidebar: {
    width: "260px",
    borderRight: "1px solid #ddd",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    padding: "20px",
    fontSize: "18px",
    fontWeight: "bold",
    borderBottom: "1px solid #eee",
  },
  userList: { flex: 1, overflowY: "auto" },
  userItem: {
    display: "flex",
    padding: "12px 15px",
    cursor: "pointer",
    transition: "0.2s",
    alignItems: "center",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#007bff",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "12px",
    fontWeight: "bold",
  },
  userName: { fontWeight: 500, fontSize: "14px" },
  status: { fontSize: "12px", textTransform: "capitalize" },
  chatMain: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f9f9f9",
  },
  header: {
    padding: "15px 20px",
    backgroundColor: "white",
    borderBottom: "1px solid #ddd",
  },
  messageBox: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  message: {
    padding: "10px 14px",
    borderRadius: "12px",
    maxWidth: "70%",
    position: "relative",
  },
  messageText: { fontSize: "14px" },
  timestamp: {
    fontSize: "10px",
    marginTop: "4px",
    textAlign: "right",
    opacity: 0.7,
  },
  inputArea: {
    padding: "20px",
    backgroundColor: "white",
    display: "flex",
    borderTop: "1px solid #ddd",
  },
  input: {
    flex: 1,
    padding: "12px 18px",
    borderRadius: "25px",
    border: "1px solid #ddd",
    outline: "none",
    marginRight: "10px",
  },
  sendButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Chat;
