import styled from "styled-components";
import {View, Text, TextInput, TouchableOpacity} from "react-native";

export const CallModalView = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

export const Title = styled(Text)`
  padding: 10px 5px;
  text-align: center;
  font-size: 19px;
`

export const Inner = styled(View)`
  padding: 16px 64px;
  background-color: #f0ad4e;
  border-radius: 4px;
`

export const Control = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 0;
`

export const ButtonIcon = styled(TouchableOpacity)`
  background-color: #0275d8;
  padding: 13px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px;
`

export const ButtonIconDisable = styled(ButtonIcon)`
  background-color: #d9534f;
`