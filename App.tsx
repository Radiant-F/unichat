import { StatusBar } from "expo-status-bar";
import { SetStateAction, useEffect, useState } from "react";
import { Button, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StreamChat } from "stream-chat";
import {
  OverlayProvider,
  Chat,
  ChannelList,
  Channel,
  MessageList,
  MessageInput,
} from "stream-chat-expo";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

const API_KEY = "dwjb8apx9kx3";
const client = StreamChat.getInstance(API_KEY);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [selectedCh, setSelectedCh] = useState<any>(null);

  useEffect(() => {
    const connectUser = async () => {
      try {
        await client.connectUser(
          {
            id: "radiant",
            name: "Radiant Fadilah",
            image:
              "https://res.cloudinary.com/dbdih4uiv/image/upload/v1648174433/ximzrkcmow9obrhnjb2l.jpg",
          },
          client.devToken("radiant")
        );

        // creating a channel
        const channel = client.channel("messaging", "unichat", {
          name: "UniChat Channel",
        });
        await channel.watch();
      } catch (error) {
        console.log(error);
      }
    };
    connectUser();

    return () => client.disconnectUser();
  }, []);

  const selectChannel = (channel) => {
    console.log(channel);
    setSelectedCh(channel);
  };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <OverlayProvider>
          <Chat client={client}>
            {selectedCh ? (
              <Channel channel={selectedCh}>
                <MessageList />
                <MessageInput />
                <Text>channel selected: {selectedCh}</Text>
              </Channel>
            ) : (
              <ChannelList onSelect={selectChannel} />
            )}
            {/* <Navigation colorScheme={colorScheme} /> */}
          </Chat>
        </OverlayProvider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
