import styled from "styled-components/native";
import {View, Text, TextInput, TouchableOpacity, ScrollView} from "react-native";

export const Window = styled.View`
  flex: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  background-color: ${props => props.theme.main === 'light' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'};
`

export const MainContainer = styled.View`
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
`

export const Header = styled.View`
  padding: 15px 0;
  padding-top: 35px;
  justify-content: center;
  align-items: center;
  background-color:  ${props => props.theme.main === 'light' ? '#f5f5f5' : '#1e1e1e'};
`

export const ButtonIcon = styled.TouchableOpacity`
  background-color: "#0275d8";
  padding: 13px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px;
`

export const ButtonIconCall = styled(ButtonIcon) `
  background-color: ${props => props.theme.main === 'light' ? '#e8e9eb' : '#1f1f1f'};
`


export const ButtonIconSend = styled(ButtonIcon)`
  background-color: rgba(52, 200, 90, 255);
  padding: 3px;
  margin-right: 10px;
  border-radius: 25px;
  align-self: 'center';
  position: 'absolute';
  right: 0;
  bottom: -22.5px;
`

export const ButtonIconBackward = styled(ButtonIcon)`
  flex: 0;
  left: 0;
  margin-left: 15px;
`

//background-color: "#0275d8";
  // padding: 13px;
  // border-radius: 25px;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // margin: 8px;

export const ButtonIconDisable = styled(ButtonIcon)`
  background-color: #d9534f;
  margin: 0;
  margin-left: 10px
`

export const Title = styled(Text)`
  text-align: center;
  color: ${props => props.theme.main === 'light' ? '#000' : '#fff'};
  padding: 10px 5px;
  font-size: 27px;
`

export const StyledTextInput = styled.TextInput`
  flex: 1;
  color: ${props => (props.theme.main === 'light' ? 'black' : 'whitesmoke')};
  padding: 7px 15px;
  border: 1px solid ${props => props.theme.main === "light" ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)'};
  margin-right: 5px;
  font-size: 18px;
  border-radius: 20px;
  padding-right: 40px;
  background-color: ${props => (props.theme.main === 'light' ? 'white' : 'black')};
`

export const RowContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const ButtonContainer = styled(View)`
  right: 0;
  position: absolute;
  display: flex;
  flex-direction: row;
`

export const Footer = styled(View)`
  background-color: rgba(255, 255, 255, 0.05);
`

export const TextInputArea = styled(View)`

`

export const MessagesArea = styled(ScrollView)`
  margin: 0 10px;
  margin-bottom: 4px;
  margin-top: 7px;
  bottom: 5px;
  flex: 1;
`