import React from 'react';
import {
  PermissionsAndroid,
  LayoutAnimation,
  TouchableOpacity,
  ToastAndroid,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  Image,
  View,
  TextInput,
  Text,
  Platform,
  Switch,
  Keyboard,
  Alert,
} from 'react-native';

import { BlurView, VibrancyView } from "@react-native-community/blur";
import Geolocation from '@react-native-community/geolocation';

import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const language = [
  { // Index RU - 0
    'day_1': 'Понедельник',
    'day_2': 'Вторник',
    'day_3': 'Среда',
    'day_4': 'Четверг',
    'day_5': 'Пятница',
    'day_6': 'Суббота',
    'day_7': 'Воскресенье',
    'info': 'Введите свое местоположение, и мы сообщим Вам, какую погоду стоит ожидать.',
    'app_name': 'Какая погода?',
    'placeholder': 'Ваш город',
    'error_limit_weather': 'В настоящий момент сервер погоды не доустпен, лимит!'
  },
  { // Index US - 1
    'day_1': 'Monday',
    'day_2': 'Tuesday',
    'day_3': 'Wednesday',
    'day_4': 'Thursday',
    'day_5': 'Friday',
    'day_6': 'Saturday',
    'day_7': 'Sunday',
    'info': 'Type in your location and we tell you what weather to expect.',
    'app_name': 'whatweather',
    'placeholder': 'Your city',
    'error_limit_weather': 'The weather server is currently unavailable, limit!'
  }
]

const API_KEY_WEATHER = '66beb59157e26efaafe714eba5e57a11'; // Ключ https://openweathermap.org/
const API_KEY_GOOGLE = 'AIzaSyCQE_AwReUMflM1VWYNyBvB5t-lUjy2BUw'; // Ключ https://google.com/

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      geoStatus: 0,
      geoResult: '',

      currentCity: null,
      currentTemp: null,
      currencySky: null,

      blurOpacity: true,

      dateArr: [],
      tempArr: [],

      language: 1,
      isEnabled: 0,

      backgroundColor: ['#f6bfaf', '#eac895', '#e0d180']
    };
  }

  async componentDidMount() {
    await this.hasLocationPermission();

    const Data = new Date();
    var dateArr = [Data.getDay(), 0, 0, 0, 0];
    for (var i = 1; i <= 4; i++) {

      nextDay = dateArr[i - 1] + 1;
      if (nextDay > 6) nextDay = 0;

      dateArr[i] = nextDay;
    }
  }

  render() {
    return (
      <LinearGradient colors={this.state.backgroundColor} style={styles.container}>

        <View style={[styles.mb10, styles.plr10]}>

          <View style={styles.flexRow}>
            <View style={[styles.flexRow, {width: '70%'}]}>
              <Text style={[styles.titleMini, {}]}>W</Text>
              <Text style={[styles.titleMini, {position: 'relative', left: -5}]}>W</Text>
            </View>
            <View style={[{width: '30%', justifyContent: 'center'}, styles.flexRow]}>
              <View style={{justifyContent: 'center', paddingRight: 5}}>
                <Text style={{fontFamily: 'Roboto-Bold', textAlign: 'right'}}>US</Text>
              </View>
              <Switch
                trackColor={{ false: "#000", true: "#000" }}
                thumbColor={this.state.currentTemp>15?"#f6bfaf":"#b3f4d5"}
                ios_backgroundColor="#000"
                onValueChange={this.toggleSwitch}
                value={this.state.isEnabled}
              />
              <View style={{justifyContent: 'center', paddingLeft: 5}}>
                <Text style={{fontFamily: 'Roboto-Bold', textAlign: 'right'}}>RU</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.titleFull, styles.mb15]}>{language[this.state.language].app_name}</Text>

          <Text style={[styles.textInfo, styles.mb10]}>{language[this.state.language].info}</Text>

          <View style={{position: 'relative'}}>
            <TextInput
              style={styles.inputCity}
              placeholder={language[this.state.language].placeholder}
              placeholderTextColor="#000"
              onFocus={this.focusInput}
              onEndEditing={this.unFocusInput}
              defaultValue={this.state.currentCity}
              onChangeText={(text) => {
                this.setState({ currentCity: text });
              }}
              value={this.state.currentCity}
            />
            <TouchableOpacity onPress={() => this.updateCity() } style={{position: 'absolute', right: 15, top: 15}}>
              <FontAwesome5 style={{fontSize: 30}} name={'arrow-right'} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{flex: 1, position: 'relative'}}>
          <BlurView
            style={[styles.absolute, { opacity: this.state.blurOpacity==true?1:0 }]}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />

          {this.state.currentTemp!==null
            ?
          <View style={[styles.mt20, styles.mb20, styles.textCenter]}>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              <View style={{justifyContent: 'center', marginRight: 10}}>
                <FontAwesome5 style={{fontSize: 30}} name={this.currentIcon(this.state.currencySky)} solid />
              </View>
              <Text style={{fontFamily: "Roboto-Black", fontSize: 60}}>{this.state.currentTemp}</Text>
              <FontAwesome5 style={{fontSize: 30}} name={this.state.currentTemp > 15 ? 'temperature-high' : 'temperature-low'} />
            </View>
          </View>
            :
            <></>
          }

          <View style={[{flex: 1}, styles.plr10]}>
            {
              this.state.tempArr.map((item, index) => {
                if (typeof item !== 'undefined' && item !== null) return (
                  <View key={index} style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                    <View style={{flex: .65}}>
                      <Text style={{fontSize: 20}}>{this.currentDay(index)}</Text>
                    </View>
                    <View style={{flex: .2}}>
                      <Text style={{fontSize: 20}}>{item[0].temp}</Text>
                    </View>
                    <View style={{flex: .15}}>
                      <FontAwesome5 style={{fontSize: 30}} name={this.currentIcon(item[0].sky)} solid />
                    </View>
                  </View>
                )
              })
            }
          </View>


        </View>
      </LinearGradient>
    );
  }

  toggleSwitch = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ language: this.state.language==0?1:0, isEnabled: !this.state.isEnabled });
  }

  currentDay = (i) => {
    if (i == 1) return language[this.state.language].day_1;
    else if (i == 2) return language[this.state.language].day_2;
    else if (i == 3) return language[this.state.language].day_3;
    else if (i == 4) return language[this.state.language].day_4;
    else if (i == 5) return language[this.state.language].day_5;
    else if (i == 6) return language[this.state.language].day_6;
    else if (i == 7) return language[this.state.language].day_7;
  }

  currentIcon = (i) => {
    if (i == 'Clear') return 'sun';
    else if (i == 'Clouds') return 'cloud-sun';
    else if (i == 'Rain') return 'cloud-rain';
    else if (i == 'Snow') return 'snowflake';
    else if (i == 'Drizzle') return 'cloud-showers-heavy';
    else i;
  }

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios') return this.getGeopisition();

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return this.getGeopisition();

    const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      this.setState({ geoStatus: 1 });
      ToastAndroid.show('Вы запретели приложению доступ к геопозиции!', ToastAndroid.LONG);
    }
    else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      this.setState({ geoStatus: 1 });
      ToastAndroid.show('Вы запретели приложению доступ к геопозиции!', ToastAndroid.LONG);
    }
    else if (status === PermissionsAndroid.RESULTS.GRANTED) returnthis.getGeopisition();
  }

  updateCity = async () => {
    Keyboard.dismiss();
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address='+this.state.currentCity+'&key=AIzaSyCQE_AwReUMflM1VWYNyBvB5t-lUjy2BUw'
    )
      .then((response) => response.json())
      .then((responseData) => {
          if (responseData['results'].length > 0) {
            this.getWeather(responseData['results'][0]['geometry']['location']['lat'], responseData['results'][0]['geometry']['location']['lng']);
          }
      })
      .done();
  }

  getGeopisition = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        await this.getCity(lat, lng);
        this.getWeather(lat, lng);
      },
      (error) => {
        setTimeout(() => { this.getGeopisition() }, 1000);
      },
    );
  }

  getCity = (lat, lng) => {
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&result_type=locality&key='+API_KEY_GOOGLE
    )
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData['results'].length > 0) this.setState({ currentCity: responseData['results'][0]['address_components'][0]['long_name'] });
      })
      .done();
  }

  getWeather = (lat, lng) => {
    var tArr = [];
    fetch(
      'http://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lng+'&appid='+API_KEY_WEATHER
    )
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.cod == 429) return Alert.alert('Weather', language[this.state.language].error_limit_weather);
        if (typeof responseData.list == 'undefined') return Alert.alert('Weather', 'Ошибка загрузки погоды, попробуйте чуть позже...');
        responseData.list.map((item, index) => {
          let d = new Date(item.dt * 1000);
          let temp = Math.round(item.main.temp - 273);
          let sky = item.weather[0].main;

          if (index == 0) {
            LayoutAnimation.easeInEaseOut();
            this.setState({ currentTemp: temp, currencySky: sky, backgroundColor: temp>15?['#f6bfaf', '#eac895', '#e0d180']:['#b3f4d5', '#c8e3aa', '#dfd181'] });
          }

          let day_id = d.getDay();
          if (d.getDay() === 0) day_id = 7;

          tArr[day_id] = [{
            'temp': temp,
            'sky': sky
          }];
        })

        this.setState({ tempArr: tArr });

        this.unFocusInput();
      })
      .done();
  }

  focusInput = (value) => {
    this.setState({ blurOpacity: true })
  }
  unFocusInput = (value) => {
    this.setState({ blurOpacity: false })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50
  },
  flexRow: {
    flexDirection: 'row'
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
