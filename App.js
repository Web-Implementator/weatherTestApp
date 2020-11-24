import React from 'react';
import {
  SegmentedControlIOS,
  LayoutAnimation,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  Image,
  View,
  TextInput,
  Text,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { BlurView, VibrancyView } from "@react-native-community/blur";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      blurOpacity: false,
    };
  }

  render() {
    return (
      <LinearGradient colors={['#f6bfaf', '#eac895', '#e0d180']} style={styles.container}>

        <View style={[styles.mb10, styles.plr10]}>
          <View style={[styles.logo, styles.mb5]}>
            <Text style={[styles.titleMini, {}]}>W</Text>
            <Text style={[styles.titleMini, {position: 'relative', left: -5}]}>W</Text>
          </View>

          <Text style={[styles.titleFull, styles.mb15]}>whatweather?</Text>

          <Text style={[styles.textInfo, styles.mb10]}>Type in your location and we tell you what weather to expect.</Text>
          <TextInput
            style={styles.inputCity}
            placeholder="Your city"
            placeholderTextColor="#000"
            onFocus={this.focusInput}
            onEndEditing={this.focusInput}
          />
        </View>

        <View style={{position: 'relative', flex: 1}}>
          <BlurView
            style={[styles.absolute, { opacity: this.state.blurOpacity==true?1:0 }]}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />

          <View style={[styles.mt20, styles.mb20, styles.textCenter]}>
            <Text style={{fontFamily: "Roboto-Black",fontSize: 50}}>25 C</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  focusInput = () => {
    // LayoutAnimation.easeInEaseOut();
    this.setState({ blurOpacity: !this.state.blurOpacity })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50
  },
  logo: {
    flexDirection: 'row', flexWrap: 'wrap'
  },
  titleMini: {
    fontFamily: "Roboto-Black",
    fontSize: 30
  },
  titleFull: {
    fontFamily: "Roboto-Bold",
    fontSize: 14
  },
  textInfo: {
    fontFamily: "Roboto-Regular"
  },
  inputCity: {
    position: 'relative',
    zIndex: 0,

    fontFamily: "Roboto-Medium",
    fontSize: 20,

    height: 60,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,

    //ios
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: {
      height: 0,
      width: 0
    },
    //android
    elevation: 3
  },

  textCenter: {
    alignItems: 'center'
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 2,
  },

  plr10: {
    paddingLeft: 10,
    paddingRight: 10
  },
  mt5: {
    marginTop: 5
  },
  mt20: {
    marginTop: 20
  },
  mb5: {
    marginBottom: 5
  },
  mb10: {
    marginBottom: 10
  },
  mb15: {
    marginBottom: 15
  },
  mb20: {
    marginBottom: 20
  }
});

export default App;
