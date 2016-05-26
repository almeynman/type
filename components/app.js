import React, { Component } from 'react';
import ReactNative, {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  Animated,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import List from './home/list'
import dismissKeyboard from 'dismissKeyboard';
import TimerMixin from 'react-timer-mixin';
import HomeSearch from './navigation/homeSearch';
import Connect from './navigation/connect';
import SettingsButton from './navigation/settingsButton';
import BackButton from './navigation/backButton';
import Discovery from './discover/discovery';
import PhotoButton from './navigation/photoButton';
import Chat from './chat/chat';
import Tube from './chat/tube';
import Title from './navigation/title';
import ChatTitle from './navigation/chatTitle';
import Settings from './settings/settings';
import NewChat from './creation/newChat';
import NewGroup from './creation/newGroup';
import realm from './db'
import NewBroadcast from './creation/newBroadcast';
var RCTStatusBarManager = require('NativeModules').StatusBarManager;
let Contacts=ReactNative.NativeModules.RNUnifiedContacts
let NavigationBarRouteMapper={
	LeftButton(route, navigator, index, navState){
		if(route.name==='home') return <Connect/>;
		return <BackButton index={index} name={route.name}/>
	},
	RightButton(route, navigator, index, navState){
		if(route.name==='home') return <SettingsButton/>;
		if(route.name==='chat') return <PhotoButton navigator={navigator} info={route.info}/>
		return null
	},
	Title(route, navigator, index, navState){
		// console.log(route,navigator.getCurrentRoutes())
		if(route.name==='home') return <HomeSearch/>;
		else if(route.name==='chat') return <ChatTitle info={route.info}/>
		return <Title info={route.info}/>
	}
}
import {appNav$,plusButtonPress$,plusButtonPress,cancelCreate} from './actions/uiactions'
export default class App extends Component {
	state={};
	writeContactsToRealmAsync(contacts){
		realm.write(()=>{
			// realm.deleteAll()
			for (let contact of contacts){
				if(realm.objects('Contact').filtered(`id="${contact.identifier}"`)&&realm.objects('Contact').length>0) break;
				realm.create('Contact',{
					givenName:contact.givenName,
					fullName:contact.fullName,
					id:contact.identifier,
					imageDataAvailable:contact.imageDataAvailable,
					picture:contact.imageDataAvailable?contact.thumbnailImageData:null,
					organizationName:contact.organizationName,
					phones:contact.phoneNumbers.map((phoneNumber)=>({
						id:phoneNumber.identifier,countryCode:phoneNumber.countryCode,number:phoneNumber.digits
					})),
					emailAddresses:contact.emailAddresses.map((emailAddress)=>({
						id:emailAddress.identifier,value:emailAddress.value
					})),
				})
			}
		})
	}
	componentWillMount(){
		Contacts.getContacts( (error, contacts) =>  {
			if (error) {
				console.error(error);
			}
			else {
				// console.log(realm.objects('Contact').filtered(`id="${contacts[0].identifier}"`))
				this.writeContactsToRealmAsync(contacts)
			}
		});
	}
	componentDidMount(){

		this.sub=appNav$.subscribe(x=>{
			if(x.nav==='appNav' && x.action==='push'){
				// if(x.name==='chat')this.nav.replaceAtIndex({name:'home'},1)
				// console.log('app nav push')
				this.nav.push({name:x.name,info:x.info})
			}else if(x.nav==='appNav'&& x.action==='pop'){
				this.nav.pop()
			}else if(x.nav==='appNav' && x.action==='popToTop'){
				this.nav.popToTop()
			}
		})
		this.sub1=plusButtonPress$.subscribe(x=>{
			if(x.action==='press'){
				this.show()
			}else if(x.action==='hide'){
				Animated.timing(this.anim,{toValue:0,duration:1}).start()
			}else if(x.action==='clean'){
				this.anim.setValue(0)
			}
		})
	}
	componentWillUnmount(){
		this.sub.unsubscribe()
		this.sub1.unsubscribe()
	}
	show(){
		Animated.timing(this.anim,{toValue:1,duration:1}).start()

	}
	hide(){
		plusButtonPress({action:'hide'})
		cancelCreate({action:'cancel'})

	}

	render() {
		this.anim=this.anim || new Animated.Value(0)
		return (
		<View style={{flex:1}}>
		 	<Navigator ref={el=>this.nav=el}
				initialRoute={{name:'home'}}
				configureScene={this.configureScene.bind(this)}
				// onWillFocus={(e)=>dismissKeyboard()}
				onDidFocus={(e)=>{
					// console.log(e,'did foucsuign',this.nav&&this.nav.getCurrentRoutes().length)	
					if(this.nav&&this.nav.getCurrentRoutes().length>2){
						this.nav.replacePrevious({name:'home'})
					}
				}}
				renderScene={this.renderApp.bind(this)}
				style={{paddingTop:70,backgroundColor:'white'}}
				navigationBar={
					<Navigator.NavigationBar
						ref={el=>this.navBar=el}
			            routeMapper={NavigationBarRouteMapper}
			            style={{height:70,backgroundColor:'white',borderBottomWidth:1,borderColor:BORDER_COLOR}}
			          />
				}
			/>
			<TouchableWithoutFeedback onPress={this.hide.bind(this)}>
				<Animated.View 
					style={{position:'absolute',top:0,left:0,
					backgroundColor:TRANSPARENT_GREY,width:320*k,
					height:this.anim.interpolate({inputRange:[0,1],outputRange:[0,70]})
				}}/>
			</TouchableWithoutFeedback>
		</View>
		);
	}
	renderApp(route,navigator){
		if(route.name==='discovery') return <Discovery/>;
		else if(route.name==='settings') return <Settings/>;
		else if(route.name==='chat') return <Chat showInput={true}/>;
		else if(route.name==='newChat') return <NewChat/>;
		else if(route.name==='newGroup') return <NewGroup/>;
		else if(route.name==='newBroadcast') return <NewBroadcast/>;
		else if(route.name==='home') return <List/>;
	}
	configureScene(route,routeStack){
		if(route.name==='newChat'||route.name==='newGroup'||route.name==='newBroadcast') 
			return {...Navigator.SceneConfigs.FloatFromBottom, gestures: {}};
		if(route.name==='settings') return {...Navigator.SceneConfigs.PushFromRight, gestures: {}};
		// else if (route.name==='chat') return Navigator.SceneConfigs.HorizontalSwipeJump

		// else if (route.name=='imageViewer') return Navigator.SceneConfigs.FadeAndroid
		// else if(route.name==='discovery') return Navigator.SceneConfigs.HorizontalSwipeJumpFromRight;
		return Navigator.SceneConfigs.PushFromRight;
	}
}
Object.assign(App.prototype, TimerMixin);

