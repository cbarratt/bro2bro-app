import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Navigator
} from 'react-native';

import Root from './src/containers/root';
import Register from './src/containers/register';
import Home from './src/containers/home';
import Login from './src/containers/login';

class Bro2Bro extends Component {

  renderScene(route, navigator) {
    console.log(route);

    if(route.name == 'root') {
      return <Root navigator={navigator} />
    }

    if(route.name == 'register') {
      return <Register navigator={navigator} />
    }

    if(route.name == 'login') {
      return <Login navigator={navigator} />
    }

    if(route.name == 'home') {
      return <Home navigator={navigator} {...route.passProps} />
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={{name: 'root'}}
          renderScene={this.renderScene.bind(this)}
        />
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
    paddingTop: 20
  }
});

AppRegistry.registerComponent('Bro2Bro', () => Bro2Bro);
