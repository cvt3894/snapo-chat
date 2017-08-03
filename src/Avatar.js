import React from 'react'
import {
  StyleSheet,
  View
} from 'react-native'

import GiftedAvatar from './GiftedAvatar'
import Time from './Time'
import { isSameUser, isSameMinute, warnDeprecated } from './utils'

export default class Avatar extends React.Component {
  renderAvatar () {
    if (this.props.renderAvatar) {
      const { ...avatarProps } = this.props
      return this.props.renderAvatar(avatarProps)
    }
    return (
      <GiftedAvatar
        avatarStyle={StyleSheet.flatten([styles[this.props.position].image, this.props.imageStyle[this.props.position]])}
        user={this.props.currentMessage.user}
        onPress={(other) => {
          if (this.props.onPressAvatar) {
            this.props.onPressAvatar(other)
          }
        }}
        position={this.props.position}
      />
    )
  }

  renderTime () {
    if (this.props.currentMessage.createdAt) {
      const { ...timeProps } = this.props
      return (
        <Time
          {...timeProps}
          containerStyle={{
            left: {
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 0,
              marginTop: 0
            },
            right: {
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 0,
              marginTop: 0
            }
          }}
          textStyle={{
            left: {
              color: '#2c2c2c',
              textAlign: 'center'
            },
            right: {
              color: '#2c2c2c',
              textAlign: 'center'
            }
          }}
        />
      )
    }
    return null
  }

  renderStatus () {
    return (
      <View style={[this.props.currentMessage.user.online ? styles.status.online : styles.status.offline]} />
    )
  }

  render () {
    if (isSameUser(this.props.currentMessage, this.props.nextMessage) && isSameMinute(this.props.currentMessage, this.props.nextMessage)) {
      return (
        <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
          <GiftedAvatar
            avatarStyle={StyleSheet.flatten([styles[this.props.position].image, this.props.imageStyle[this.props.position]])}
          />
        </View>
      )
    }
    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
        {this.renderAvatar()}
        {/* {this.renderTime()} */}
        {this.props.position === 'left' && this.props.showStatus ? this.renderStatus() : null}
      </View>
    )
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      marginRight: 8
    },
    image: {
      height: 25,
      width: 25,
      borderRadius: 12.5
    }
  }),
  right: StyleSheet.create({
    container: {
      marginLeft: 8
    },
    image: {
      height: 25,
      width: 25,
      borderRadius: 12.5
    }
  }),
  status: StyleSheet.create({
    online: {
      position: 'absolute',
      right: -3,
      bottom: 0,
      backgroundColor: '#2BC100',
      width: 10,
      height: 10,
      borderRadius: 5.5,
      borderWidth: 1,
      borderColor: '#fff'
    },
    offline: {
      position: 'absolute',
      right: -3,
      bottom: 0,
      backgroundColor: '#9B9B9B',
      width: 10,
      height: 10,
      borderRadius: 5.5,
      borderWidth: 1,
      borderColor: '#fff'
    }
  })
}

Avatar.defaultProps = {
  position: 'left',
  currentMessage: {
    user: null
  },
  nextMessage: {},
  containerStyle: {},
  imageStyle: {},
  // TODO: remove in next major release
  isSameMinute: warnDeprecated(isSameMinute),
  isSameUser: warnDeprecated(isSameUser)
}

Avatar.propTypes = {
  position: React.PropTypes.oneOf(['left', 'right']),
  currentMessage: React.PropTypes.object,
  nextMessage: React.PropTypes.object,
  containerStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style
  }),
  imageStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style
  }),
  // TODO: remove in next major release
  onPressAvatar: React.PropTypes.func,
  isSameMinute: React.PropTypes.func,
  isSameUser: React.PropTypes.func,
  statusUser: React.PropTypes.bool,
  showStatus: React.PropTypes.bool,
  showNameUser: React.PropTypes.bool
}
