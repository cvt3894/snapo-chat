import React from 'react'
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native'

export default class MessageImage extends React.Component {
  onPressImage () {
    this.props.onPressImage && this.props.onPressImage(this.props.currentMessage.image)
  }
  render () {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity onPress={() => this.onPressImage()}>
          <Image
            {...this.props.imageProps}
            style={[styles.image, this.props.imageStyle]}
            source={{uri: this.props.currentMessage.image}}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover'
  },
  imageActive: {
    resizeMode: 'contain'
  }
})

MessageImage.defaultProps = {
  currentMessage: {
    image: null
  },
  containerStyle: {},
  imageStyle: {},
  imageProps: {}
}

MessageImage.propTypes = {
  currentMessage: React.PropTypes.object,
  containerStyle: View.propTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: React.PropTypes.object,
  onPressImage: React.PropTypes.func
}
