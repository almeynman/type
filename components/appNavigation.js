

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Navigator,
  View
} from 'react-native';
import DrawerWithApp from './drawerWithApp';
import RegistrationNavigation from './login/registrationNavigation';
export default class AppNavigation extends Component {
	render() {
		return (
		<View style={{flex:1}}>
		 	<Navigator ref={el=>this.nav=el}
				initialRoute={{name:'home'}}
				configureScene={this.configureScene.bind(this)}
				renderScene={this.renderApp.bind(this)}
			/>
		</View>
		);
	}
	renderApp(route,navigator){
		if(route.name==='home') return <DrawerWithApp/>;
		else if(route.name==='registration') return <RegistrationNavigation/>
	

	}
	configureScene(route,routeStack){
		return Navigator.SceneConfigs.PushFromRight;
	}
}