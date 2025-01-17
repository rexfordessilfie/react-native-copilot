import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CopilotProvider,
  CopilotStep,
  walkthroughable,
  useCopilot,
} from "@rexfordessilfie/react-native-copilot";

const WalkthroughableText = walkthroughable(Text);
const WalkthroughableImage = walkthroughable(Image);

function App() {
  const { start, copilotEvents } = useCopilot();
  const { start: start2, copilotEvents: copilotEvents2 } = useCopilot("tour2");
  const [secondStepActive, setSecondStepActive] = useState(true);
  const [lastEvent, setLastEvent] = useState();

  const ref = React.useRef(null);

  useEffect(() => {
    copilotEvents?.on("stepChange", (step) => {
      setLastEvent(`stepChange: ${step?.name ?? ""}`);
    });
    copilotEvents?.on("start", () => {
      setLastEvent(`start`);
    });
    copilotEvents?.on("stop", () => {
      setLastEvent(`stop`);
    });
  }, [copilotEvents]);

  useEffect(() => {
    copilotEvents2?.on("stepChange", (step) => {
      setLastEvent(`stepChange: ${step?.name ?? ""}`);
    });
    copilotEvents2?.on("start", () => {
      setLastEvent(`start`);
    });
    copilotEvents2?.on("stop", () => {
      setLastEvent(`stop`);
    });
  }, [copilotEvents2]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView ref={ref} contentContainerStyle={styles.container}>
        <CopilotStep
          text="Hey! This is the first step of the tour!"
          order={1}
          name="openApp"
        >
          <WalkthroughableText style={styles.title}>
            {'Welcome to the demo of\n"React Native Copilot"'}
          </WalkthroughableText>
        </CopilotStep>

        <CopilotStep
          text="Hey! This is the first step of the tour 2!"
          order={2}
          name="tour2Openapp"
          tourKey="tour2"
        >
          <WalkthroughableText style={styles.title}>
            {'Welcome to the demo 2 of\n"React Native Copilot"'}
          </WalkthroughableText>
        </CopilotStep>

        <View style={styles.middleView}>
          <CopilotStep
            active={secondStepActive}
            text="Here goes your profile picture!"
            order={2}
            name="secondText"
          >
            <WalkthroughableImage
              source={{
                uri: "https://pbs.twimg.com/profile_images/527584017189982208/l3wwN-l-_400x400.jpeg",
              }}
              style={styles.profilePhoto}
            />
          </CopilotStep>
          <View style={styles.activeSwitchContainer}>
            <Text>Profile photo step activated?</Text>
            <View style={{ flexGrow: 1 }} />
            <Switch
              onValueChange={(secondStepActive) => {
                setSecondStepActive(secondStepActive);
              }}
              value={secondStepActive}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              start(undefined, ref.current);
            }}
          >
            <Text style={styles.buttonText}>START THE TUTORIAL!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              start2(undefined, ref.current);
            }}
          >
            <Text style={styles.buttonText}>START THE 2nd TUTORIAL!</Text>
          </TouchableOpacity>
          <View style={styles.eventContainer}>
            <Text>{lastEvent && `Last event: ${lastEvent}`}</Text>
          </View>
        </View>

        <View style={{ height: Dimensions.get("screen").height / 2 }} />

        <CopilotStep
          tourKey="tour2"
          text="This step is hidden by scroll view"
          name="hiddenText"
          order={3}
        >
          <WalkthroughableText>Text Hidden By Scroll</WalkthroughableText>
        </CopilotStep>
      </ScrollView>
      <View style={styles.row}>
        <CopilotStep
          text="Here is an item in the corner of the screen."
          order={3}
          name="thirdText"
        >
          <WalkthroughableText style={styles.tabItem}>
            <Ionicons name="apps" size={25} color="#888" />
          </WalkthroughableText>
        </CopilotStep>

        <CopilotStep
          text="Here is an item in the corner of the screen."
          order={2}
          name="tour2Airplane"
          tourKey="tour2"
        >
          <WalkthroughableText style={styles.tabItem}>
            <Ionicons
              style={styles.tabItem}
              name="airplane"
              size={25}
              color="#888"
            />
          </WalkthroughableText>
        </CopilotStep>

        <Ionicons
          style={styles.tabItem}
          name="ios-globe"
          size={25}
          color="#888"
        />
        <Ionicons
          style={styles.tabItem}
          name="ios-navigate-outline"
          size={25}
          color="#888"
        />
        <Ionicons
          style={styles.tabItem}
          name="ios-rainy"
          size={25}
          color="#888"
        />
      </View>
    </SafeAreaView>
  );
}

const AppwithProvider = () => (
  <CopilotProvider stopOnOutsideClick androidStatusBarVisible>
    <App />
  </CopilotProvider>
);

export default AppwithProvider;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 25,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  profilePhoto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginVertical: 20,
  },
  middleView: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#2980b9",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabItem: {
    flex: 1,
    textAlign: "center",
  },
  activeSwitchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
    paddingHorizontal: 25,
  },
  eventContainer: {
    marginTop: 20,
  },
});
