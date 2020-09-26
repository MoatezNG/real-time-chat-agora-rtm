/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";

import { IMessage } from "../models/IMessage";
import randomColor from "randomcolor";
import { RtmClient, RtmMessage } from "../types/AgoraRTMTypes";

const USER_ID = Math.floor(Math.random() * 1000000001);

const useAgoraRtm = (userName: string, client: RtmClient) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const channel = useRef(client.createChannel("channelId")).current;
  const color = useRef(randomColor({ luminosity: "dark" })).current;
  const initRtm = async () => {
    await client.login({
      uid: USER_ID.toString(),
    });
    await channel.join();
    await client.setLocalUserAttributes({
      name: userName,
      color,
    });
  };
  useEffect(() => {
    initRtm();
    // eslint-disable-next-line consistent-return
  }, []);

  useEffect(() => {
    channel.on("ChannelMessage", (data, uid) => {
      handleMessageReceived(data, uid);
    });
  }, []);
  const handleMessageReceived = async (data: RtmMessage, uid: string) => {
    const user = await client.getUserAttributes(uid);
    console.log(data);
    if (data.messageType === "TEXT") {
      const newMessageData = { user, message: data.text };
      setCurrentMessage(newMessageData);
    }
  };

  const [currentMessage, setCurrentMessage] = useState<IMessage>();
  const sendChannelMessage = async (text: string) => {
    channel
      .sendMessage({ text })
      .then(() => {
        setCurrentMessage({
          user: { name: "Current User (Me)", color },
          message: text,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (currentMessage) setMessages([...messages, currentMessage]);
  }, [currentMessage]);

  return { sendChannelMessage, messages };
};
export default useAgoraRtm;
