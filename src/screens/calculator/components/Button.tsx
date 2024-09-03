import React, {PropsWithChildren} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import {ButtonProps} from '../types';

const {width: WIDTH} = Dimensions.get('window');

export default function Button(props: PropsWithChildren<ButtonProps>) {
  return (
    <View>
      <TouchableHighlight
        underlayColor={props.orange ? '#ffc56b' : '#c9c9c9'}
        activeOpacity={1}
        onPress={props.func}
        style={[
          props.special ? styles.specialButton : styles.button,
          {
            backgroundColor: props.backgroundColor,
            justifyContent: 'center',
          },
        ]}>
        <View>
          {props.children ? (
            props.children
          ) : (
            <Text
              style={[
                props.special ? styles.specialText : styles.text,
                {
                  color: props.color,
                  fontSize: props.orange ? 43 : 35,
                },
              ]}>
              {props.text}
            </Text>
          )}
        </View>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  specialButton: {
    width: (WIDTH - 4 * 76) / 5 + 2 * 76,
    height: 76,
    borderRadius: 38,
  },
  specialText: {
    paddingLeft: 27,
    fontSize: 35,
  },
  text: {
    textAlign: 'center',
    fontSize: 35,
  },
});
