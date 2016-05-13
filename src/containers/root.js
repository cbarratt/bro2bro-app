import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  AsyncStorage,
  Text,
  View
} from 'react-native';

import Constants from '../constants';

class Root extends Component {
  componentWillMount() {
    this.getToken();
  }

  navigate(routeName) {
    this.props.navigator.push({
      name: routeName
    });
  }

  async getToken() {
    try {
      let accessToken = await AsyncStorage.getItem('access_token');

      if(!accessToken) {
        console.log('Token not set');
      } else {
        this.verifyToken(accessToken)
      }
    } catch(error) {
      console.log('Something went wrong');
    }
  }

  async verifyToken(token) {
    let request = new Request(`${Constants.API_URL}/api/v1/user`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': token,
      })
    });

    try {
      let response = await fetch(request);
      let res = await response.text();

      if (response.status >= 200 && response.status < 300) {
        this.navigate('home');
      } else {
          let error = res;
          throw error;
      }
    } catch(error) {
        console.log("error response: " + error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bro2Bro</Text>
        <Text style={styles.text}>Welcome to the app where you can connect with your bro's</Text>

        <TouchableHighlight onPress={ this.navigate.bind(this, 'register')} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={ this.navigate.bind(this, 'login')} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10,
    paddingTop: 180
  },
  button: {
    height: 50,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center'
  },
  text: {
    paddingBottom: 20
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  title: {
    fontSize: 25,
    marginBottom: 15
  }
});

export default Root
