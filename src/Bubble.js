import React from 'react'
import {
  Text,
  Clipboard,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native'

import MessageText from './MessageText'
import MessageImage from './MessageImage'
import Time from './Time'

import { isSameUser, isSameDay, isSameMinute, warnDeprecated } from './utils'

export default class Bubble extends React.Component {
  constructor (props) {
    super(props)
    this.topButton = TouchableOpacity
    this.onLongPress = this.onLongPress.bind(this)
  }

  handleBubbleToNext () {
    if (isSameUser(this.props.currentMessage, this.props.nextMessage) && isSameDay(this.props.currentMessage, this.props.nextMessage)) {
      return StyleSheet.flatten([styles[this.props.position].containerToNext, this.props.containerToNextStyle[this.props.position]])
    }
    return null
  }

  handleBubbleToPrevious () {
    if (isSameUser(this.props.currentMessage, this.props.previousMessage) && isSameDay(this.props.currentMessage, this.props.previousMessage)) {
      return StyleSheet.flatten([styles[this.props.position].containerToPrevious, this.props.containerToPreviousStyle[this.props.position]])
    }
    return null
  }

  renderMessageText () {
    if (this.props.currentMessage.text) {
      const { ...messageTextProps } = this.props
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps)
      }
      return <MessageText {...messageTextProps} />
    }
    return null
  }

  renderMessageImage () {
    if (this.props.currentMessage.image) {
      const { ...messageImageProps } = this.props
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps)
      }
      return <MessageImage {...messageImageProps} />
    }
    return null
  }

  renderTicks () {
    const { currentMessage } = this.props
    if (this.props.renderTicks) {
      return this.props.renderTicks(currentMessage)
    }
    if (currentMessage.user._id !== this.props.user._id) {
      return
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={styles.tickView}>
          {currentMessage.sent && <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>}
          {currentMessage.received && <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>}
        </View>
      )
    }
  }

  renderTime () {
    if (this.props.currentMessage.createdAt &&
    !isSameDay(this.props.currentMessage, this.props.nextMessage) ||
      !isSameUser(this.props.currentMessage, this.props.nextMessage) ||
      !isSameMinute(this.props.currentMessage, this.props.nextMessage)) {
      const { ...timeProps } = this.props
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps)
      }
      return <Time {...timeProps} />
    }
    return null
  }

  renderCustomView () {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props)
    }
    return null
  }

  onLongPress () {
    this.topButton.measure((fx, fy, width, height, px, py) => {
      const position = {
        fx: fx,
        fy: fy,
        width: width,
        height: height,
        px: px,
        py: py
      }
      if (this.props.onLongPress) {
        this.props.onLongPress(this.context, this.props.currentMessage, position)
      } else {
        if (this.props.currentMessage.text) {
          const options = [
            'Copy Text',
            'Cancel'
          ]
          const cancelButtonIndex = options.length - 1
          this.context.actionSheet().showActionSheetWithOptions({
            options,
            cancelButtonIndex
          },
            (buttonIndex) => {
              switch (buttonIndex) {
                case 0:
                  Clipboard.setString(this.props.currentMessage.text)
                  break
              }
            })
        }
      }
    })
  }

  render () {
    const image = this.props.currentMessage.image
    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position], image ? {backgroundColor: 'transparent'} : {}]}>
        <View style={[styles[this.props.position].wrapper, this.props.wrapperStyle[this.props.position], this.handleBubbleToNext(), this.handleBubbleToPrevious(), image ? {backgroundColor: 'transparent'} : {}]}>
          <TouchableOpacity
            ref={component => { this.topButton = component }}
            onLongPress={this.onLongPress}
            accessibilityTraits='text'
            {...this.props.touchableProps}
          >
            <View>
              {this.renderCustomView()}
              {this.renderMessageImage()}
              {this.renderMessageText()}
              <View style={styles.bottom}>
                {this.renderTime()}
                {this.renderTicks()}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
      marginBottom: 0
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: '#fff',
      marginRight: 60,
      minHeight: 25,
      justifyContent: 'flex-end'
      // paddingTop: 6,
      // paddingBottom: 6
    },
    containerToNext: {
      borderBottomLeftRadius: 3
    },
    containerToPrevious: {
      borderTopLeftRadius: 3
    }
  }),
  right: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-end'
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: '#0084ff',
      marginLeft: 60,
      minHeight: 25,
      justifyContent: 'flex-end'
      // paddingTop: 6,
      // paddingBottom: 6
    },
    containerToNext: {
      borderBottomRightRadius: 3
    },
    containerToPrevious: {
      borderTopRightRadius: 3
    }
  }),
  bottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  tick: {
    fontSize: 10,
    backgroundColor: 'transparent',
    color: 'white'
  },
  tickView: {
    flexDirection: 'row',
    marginRight: 10
  }
}

Bubble.contextTypes = {
  actionSheet: React.PropTypes.func
}

Bubble.defaultProps = {
  touchableProps: {},
  onLongPress: null,
  renderMessageImage: null,
  renderMessageText: null,
  renderCustomView: null,
  renderTime: null,
  position: 'left',
  currentMessage: {
    text: null,
    createdAt: null,
    image: null
  },
  nextMessage: {},
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  tickStyle: {},
  containerToNextStyle: {},
  containerToPreviousStyle: {},
  // TODO: remove in next major release
  isSameDay: warnDeprecated(isSameDay),
  isSameMinute: warnDeprecated(isSameMinute),
  isSameUser: warnDeprecated(isSameUser)
}

Bubble.propTypes = {
  touchableProps: React.PropTypes.object,
  onLongPress: React.PropTypes.func,
  renderMessageImage: React.PropTypes.func,
  renderMessageText: React.PropTypes.func,
  renderCustomView: React.PropTypes.func,
  renderTime: React.PropTypes.func,
  position: React.PropTypes.oneOf(['left', 'right']),
  currentMessage: React.PropTypes.object,
  nextMessage: React.PropTypes.object,
  previousMessage: React.PropTypes.object,
  containerStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style
  }),
  wrapperStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style
  }),
  tickStyle: Text.propTypes.style,
  containerToNextStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style
  }),
  containerToPreviousStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style
  }),
  // TODO: remove in next major release
  isSameDay: React.PropTypes.func,
  isSameMinute: React.PropTypes.func,
  isSameUser: React.PropTypes.func
}
