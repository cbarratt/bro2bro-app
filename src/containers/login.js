import React, {
  Component,
  StyleSheet,
  AsyncStorage,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ActivityIndicatorIOS,
  Alert
} from 'react-native';

import Constants from '../constants';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      error: "",
      showProgress: false
    }
  }

  redirect(routeName, accessToken) {
    this.props.navigator.push({
      name: routeName
    });
  }

  backHome() {
    this.redirect('root');
  }

  storeToken(responseData) {
    AsyncStorage.setItem('access_token', responseData, (err) => {
      if (err) {
        console.log("an error");
        throw err;
      }
      console.log("success");
    }).catch((err)=> {
      console.log("error is: " + err);
    });
  }

  validate() {
    if (this.state.email == '' || this.state.password == '') {
      this.setState({error: 'Please enter all your details'})
    } else {
      this.onLoginPressed();
    }
  }

  incorrectLogin() {
    Alert.alert(
      'Oops! An error occured...',
      this.state.error,
      [
        {text: 'Let me try again', onPress: () => console.log('OK Pressed')},
      ]
    )
  }

  async onLoginPressed() {
    this.setState({showProgress: true})

    try {
      let response = await fetch(`${Constants.API_URL}/api/v1/sessions`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: {
            email: this.state.email,
            password: this.state.password,
          }
        })
      });

      const res = await response.text();

      if (response.status >= 200 && response.status < 300) {
        const respJson = JSON.parse(res);
        const accessToken = respJson.jwt;

        this.setState({showProgress: false})
        this.storeToken(accessToken);
        this.redirect('home');
      } else {
        let error = JSON.parse(res);
        throw error;
      }
    } catch(error) {
      this.setState({error: error.error});
      this.setState({showProgress: false});
      this.incorrectLogin();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>
          Log in to the Bromatrix
        </Text>

        <Text style={styles.error}>
          {this.state.error}
        </Text>

        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={ (text)=> this.setState({email: text}) }
          style={styles.input} placeholder="Email">
        </TextInput>

        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={ (text)=> this.setState({password: text}) }
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}>
        </TextInput>

        <TouchableHighlight onPress={this.validate.bind(this)} style={styles.button}>
          <Text style={styles.buttonText}>
            Login
          </Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={this.backHome.bind(this)} style={styles.button}>
          <Text style={styles.buttonText}>
            Take me back bro
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#F5FCFF',
    padding: 10,
    paddingTop: 80
  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec',
    borderRadius: 10
  },
  heading: {
    fontSize: 30,
    paddingTop: 20,
    paddingBottom: 20
  },
  error: {
    color: 'red',
    paddingTop: 10
  },
  loader: {
    marginTop: 20
  },
  button: {
    height: 50,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
});

export default Login;
