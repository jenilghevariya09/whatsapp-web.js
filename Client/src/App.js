// import "./App.css";
import io from "socket.io-client";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
const socket = io.connect("http://localhost:3009", {});
function App() {
  var num = 0;
  const [session, setSession] = useState("");
  const [qrCode, setQrCode] = useState("");
  // const [oldSessionId] = useState("");
  const createSessionForWhatsapp = () => {
    socket.emit("createSession", {
      id: session,
    });
  };
  const [id, setId] = useState("bomb");
  // const [message, setMessage] = useState({});

  useEffect(() => {
    socket.emit("connected", "Hello from client");
    socket.on("qr", (data) => {
      const { qr } = data;
      console.log("QR RECEIVED", qr);
      setQrCode(qr);
    });
    socket.on("getMessage", (data) => {
      console.log('==========> data', data);
      // setMessage(data)
    });

    socket.on("ready", (data) => {
      console.log(data);
      const { id } = data;
      setId(id);
    });

    socket.on("allChats", (data) => {
      console.log("allChats", data);
    });

    socket.on("sendMessages", (data) => {
      console.log("sendMessages", data);
    });

  }, []);


  const getAllChats = () => {
    socket.emit("getAllChats", { id });
  };
  const sendMessage = () => {
    const numbers = ["91YOUR_NUMBER@c.us"]; 

    socket.emit("sendMessage", {
      sessionId: id, numbers: numbers, caption: `Message from Bot ${num + 1}`
    });
    num = num + 1
  };



  return (
    <div className="App">
      <h1>Whatsapp Web JS Client</h1>
      <h1>Open Whatsapp and Scan Qr Code</h1>

      {/* <div>
        <input
          type="text"
          value={oldSessionId}
          onChange={(e) => {
            setOldSessionId(e.target.value);
          }}
        />
        <button onClick={getOldSession}>Get old session</button>
      </div> */}
      <div
        style={{
          marginBottom: "40px",
        }}
      >
        <input
          type="text"
          value={session}
          onChange={(e) => {
            setSession(e.target.value);
          }}
        />
        <button onClick={createSessionForWhatsapp}>Create session</button>
      </div>

      <div
        style={{
          marginBottom: "24px",
        }}
      >
        {id !== "" && <button onClick={getAllChats}>Get all chats</button>}
        {<button onClick={sendMessage}>Send Message</button>}
      </div>
      {qrCode && <QRCode value={qrCode} />}
    </div>
  );
}

export default App;
