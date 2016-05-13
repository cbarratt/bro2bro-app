import React, {
  Component,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  AsyncStorage,
  Text,
  View
} from 'react-native';

import Constants from '../constants';

class Register extends Component {
  constructor(){
    super();

    this.state = {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      error: "",
      errors: [],
      showProgress: false,
    }
  }

  redirect(routeName, accessToken) {
    this.props.navigator.push({
      name: routeName
    });
  }

  storeToken(responseData) {
    AsyncStorage.setItem('access_token', responseData, (err) => {
      if (err) {
        throw err;
      }
    }).catch((err) => {
      console.log("error is: " + err);
    });
  }

  backHome() {
    this.redirect('root');
  }

  async onLoginPressed() {
    this.setState({showProgress: true})

    try {
      let response = await fetch(`${Constants.API_URL}/api/v1/registrations`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            username: this.state.username,
            first_name: this.state.firstname,
            last_name: this.state.lastname,
            email: this.state.email,
            password: this.state.password,
          }
        })
      });

      let res = await response.text();

      if (response.status >= 200 && response.status < 300) {
        const respJson = JSON.parse(res);
        const accessToken = respJson.jwt;

        this.storeToken(accessToken);
        this.setState({showProgress: false});
        this.setState({error: ""});
        this.redirect('home');
      } else {
        const errors = JSON.parse(res).errors;

        let errorMessages = [];

        errors.map(error => {
          const key = Object.keys(error)[0];
          errorMessages.push(`${key} ${error[key]}`);
        });

        this.setState({errors: errorMessages});

        throw error;
      }
    } catch(error) {
      this.setState({error: error});
      this.setState({showProgress: false});
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>
          Register Bro!
        </Text>
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={ (text)=> this.setState({username: text}) }
          style={styles.input} placeholder="Username">
        </TextInput>
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={ (text)=> this.setState({firstname: text}) }
          style={styles.input} placeholder="First Name">
        </TextInput>
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={ (text)=> this.setState({lastname: text}) }
          style={styles.input} placeholder="Last Name">
        </TextInput>
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
        <TouchableHighlight onPress={this.onLoginPressed.bind(this)} style={styles.button}>
          <Text style={styles.buttonText}>
            Sign me up, bro!
          </Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={this.backHome.bind(this)} style={styles.button}>
          <Text style={styles.buttonText}>
            Take me back bro
          </Text>
        </TouchableHighlight>

        <Errors errors={this.state.errors}/>

        <ActivityIndicatorIOS animating={this.state.showProgress} size="large" style={styles.loader} />
      </View>
    );
  }
}

const Errors = (props) => {
  return (
    <View>
      {props.errors.map((error, i) => <Text key={i}> {error} </Text>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10,
    paddingTop: 0
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
  heading: {
    fontSize: 30,
    paddingTop: 20,
    paddingBottom: 20
  },
  error: {
    color: 'red',
    paddingTop: 10
  },
  success: {
    color: 'green',
    paddingTop: 10
  },
  loader: {
    marginTop: 20
  }
});

export default Register
