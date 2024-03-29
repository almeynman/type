import React, { Component } from 'react'
import {
  View,
  Animated
} from 'react-native'

import Spinner from 'react-native-spinkit'
export default class Loading extends Component {
  static defaultProps = { delay: 100 }
  onDone() {
    Animated.timing(
      this.anim,
      {
        toValue: 0,
        duration: 300,
        delay: this.props.delay
      }
    ).start(() =>
      Animated.timing(
        this.anim1,
        { toValue: 1, duration: 1}
      ).start()
    )
  }
  render() {
    this.anim = this.anim || new Animated.Value(1)
    this.anim1 = this.anim1 || new Animated.Value(0)
    return (
      <Animated.View
        style={{
          bottom: 0,
          top: this.anim1.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 700]
          }),
          position: 'absolute',
          left: 0,
          width: 320 * k,
          opacity: this.anim,
          backgroundColor: this.props.transparent ? 'rgba(220,220,220,.5)' : 'white',
          ...center
        }}
      >
        <Spinner
          ref={el => this.spinner = el}
          style={{ marginBottom: 50 }}
          isVisible
          size={30}
          type={'Wave'}
          color={APP_COLOR} />
      </Animated.View>
    )
  }
}
