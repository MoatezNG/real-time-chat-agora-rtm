import React, { useState } from "react";

import "./App.css";
import useAgoraRtm from "./hooks/useAgoraRtm";
import AgoraRTM from "agora-rtm-sdk";
import { RtmClient } from "./types/AgoraRTMTypes";
import { makeid } from "./helpers/randomId";

const client = AgoraRTM.createInstance("YOUR-API-KEY");
const randomUseName = makeid(5);
function App() {
  const [textArea, setTextArea] = useState("");
  const { messages, sendChannelMessage } = useAgoraRtm(
    randomUseName,
    client as RtmClient
  );
  const submitMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.charCode === 13) {
      e.preventDefault();
      if (textArea.trim().length === 0) return;
      sendChannelMessage(e.currentTarget.value);
      setTextArea("");
    }
  };
  return (
    <div className="App">
      <div className="d-flex flex-column py-5 px-3">
        {messages.map((data, index) => {
          return (
            <div className="row" key={`chat${index + 1}`}>
              <h5 className="font-size-15" style={{ color: data.user.color }}>
                {`${data.user.name} :`}
              </h5>
              <p className="text-break">{` ${data.message}`}</p>
            </div>
          );
        })}
      </div>
      <div>
        <textarea
          placeholder="Type your message here"
          className="form-control"
          onChange={(e) => setTextArea(e.target.value)}
          aria-label="With textarea"
          value={textArea}
          onKeyPress={submitMessage}
        />
      </div>
    </div>
  );
}

export default App;
