import React from 'react'
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native'
import Avatar from './Avatar'
import Bubble from './Bubble'
import Day from './Day'
import Time from './Time'
import {isSameUser, isSameDay, isSameMinute} from './utils'
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'
const { width, height } = Dimensions.get('window')
export default class Message extends React.Component {

  getInnerComponentProps () {
    const {...props} = this.props
    return {
      ...props,
      isSameUser,
      isSameDay,
      isSameMinute
    }
  }

  renderDay () {
    if (this.props.currentMessage.createdAt) {
      const dayProps = this.getInnerComponentProps()
      if (this.props.renderDay) {
        return this.props.renderDay(dayProps)
      }
      return <Day {...dayProps} />
    }
    return null
  }

  renderBubble () {
    const bubbleProps = this.getInnerComponentProps()
    if (this.props.renderBubble) {
      return this.props.renderBubble(bubbleProps)
    }
    return <Bubble {...bubbleProps} />
  }

  renderAvatar () {
    // if (this.props.user._id !== this.props.currentMessage.user._id) {
    // }
    const avatarProps = this.getInnerComponentProps()
    return <Avatar {...avatarProps} />
  }

  renderTime () {
    if (this.props.currentMessage.createdAt) {
      const {...timeProps} = this.props
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

  renderStatusMessage () {
    const messages = this.props.messages
    const currentMessage = this.props.currentMessage
    const lastMessage = _.max(messages)
    const statusProps = this.getInnerComponentProps()
    if (currentMessage._id === lastMessage._id) {
      if (this.props.renderStatusMessage) {
        return this.props.renderStatusMessage(statusProps)
      }
    }
    return null
  }

  render () {
    return (
      <View style={styles.modalWrapper}>
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
          <View style={styles.modalUnderlay} />
        </TouchableWithoutFeedback>
        {this.renderDay()}
        <View style={[styles[this.props.position].container, {
          marginBottom: isSameUser(this.props.currentMessage, this.props.nextMessage) && isSameMinute(this.props.currentMessage, this.props.nextMessage) ? 3 : 15
        }, this.props.containerStyle[this.props.position]]}>
          {this.props.position === 'left' ? this.renderAvatar() : null}
          {this.renderBubble()}
          {this.props.position === 'right' ? this.renderAvatar() : null}
        </View>
        {this.props.position === 'right' ? this.renderStatusMessage() : null}
      </View>
    )
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0
    }
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 8
    }
  }),
  nameUser: {
    marginLeft: 45,
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameRight: {
    marginRight: 45
  },
  txtName: {
    marginRight: 10,
    color: '#838287'
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  modalUnderlay: {
    position: 'absolute',
    width: width,
    height: height,
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent'
  }
}

Message.defaultProps = {
  renderAvatar: null,
  renderBubble: null,
  renderDay: null,
  renderStatusMessage: null,
  position: 'left',
  currentMessage: {},
  nextMessage: {},
  previousMessage: {},
  user: {},
  containerStyle: {}
}

Message.propTypes = {
  renderAvatar: React.PropTypes.func,
  renderBubble: React.PropTypes.func,
  renderDay: React.PropTypes.func,
  renderStatusMessage: React.PropTypes.func,
  position: React.PropTypes.oneOf(['left', 'right']),
  currentMessage: React.PropTypes.object,
  nextMessage: React.PropTypes.object,
  previousMessage: React.PropTypes.object,
  user: React.PropTypes.object,
  containerStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style
  }),
  showStatus: React.PropTypes.bool
}
