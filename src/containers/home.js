import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS,
  AsyncStorage,
  Text,
  View
} from 'react-native';

class Home extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoggenIn: "",
      showProgress: false,
      accessToken: "",
      bros: []
    }
  }

  componentWillMount() {
    this.getToken();
    this.getBros();
  }

  async getToken() {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');

      if (!accessToken) {
        this.redirect('login');
      } else {
        this.setState({accessToken: accessToken})
      }
    } catch(error) {
      this.redirect('login');
    }
  }

  async deleteToken() {
    try {
      await AsyncStorage.removeItem('access_token')

      this.redirect('root');
    } catch(error) {
      console.log("Something went wrong");
    }
  }

  async getBros() {
    const accessToken = await AsyncStorage.getItem('access_token');

    try {
      let response = await fetch(`${Constants.API_URL}/api/v1/bros`, {
        headers: {
          'Authorization': accessToken,
        },
      });

      let res = await response.text();
      const respJson = JSON.parse(res);

      if (response.status >= 200 && response.status < 300) {
          let brosArray = [];

          respJson.bros.map(bro => {
            brosArray.push(`${bro.first_name} ${bro.last_name}`)
          });

          this.setState({bros: brosArray});
      } else {
          let error = res;
          throw error;
      }
    } catch(error) {
        this.setState({error: error});
        console.log("error " + error);
        this.setState({showProgress: false});
    }
  }

  redirect(routeName) {
    this.props.navigator.push({
      name: routeName,
      passProps: {
        accessToken: this.state.accessToken
      }
    });
  }

  onLogout() {
    this.setState({showProgress: true})
    this.deleteToken();
  }

  render() {
    let flashMessage;

    if (this.props.flash) {
      flashMessage = <Text style={styles.flash}>{this.props.flash}</Text>
    } else {
      flashMessage = null
    }

    return(
      <View style={styles.container}>
        {flashMessage}
        <Text style={styles.title}>Welcome Brodenhiem!</Text>

        <Text style={styles.text}>Here are your fellow brosephs...</Text>

        <Bros bros={this.state.bros} style={styles.bros} />

        <TouchableHighlight onPress={this.onLogout.bind(this)} style={styles.button}>
          <Text style={styles.buttonText}>
            Logout
          </Text>
        </TouchableHighlight>

        <ActivityIndicatorIOS animating={this.state.showProgress} size="large" style={styles.loader} />
      </View>
    );
  }
}

const Bros = (props) => {
  return (
    <View>
      {props.bros.map((bro, i) => <Text style={styles.bros} key={i}>{bro}</Text>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingTop: 40,
  },
  bros: {
    textAlign: 'left',
    marginBottom: 10
  },
  title: {
    fontSize: 25,
    marginTop: 0,
    marginBottom: 40,
    textAlign: 'center'
  },
  text: {
    marginBottom: 30
  },
  button: {
    height: 50,
    backgroundColor: 'red',
    alignSelf: 'stretch',
    marginTop: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  flash: {
    height: 40,
    backgroundColor: '#00ff00',
    padding: 10,
    alignSelf: 'center',
  },
  loader: {
    marginTop: 20
  }
});

export default Home
