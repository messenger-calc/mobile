import styled from "styled-components";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export const MainWindowView = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: rgba(255, 255, 255, 0.5); */
  background-color: #292929;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  text-align: center;
  flex-direction: column;
  padding: 40px;
  width: 300px;
  border: 0.5px solid rgba(0, 0, 0, 0.7);
  max-height: 400px
`

export const MainWindowLocalId = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  flex-direction: column;
  padding-bottom: 30px;
  font-size: 18px;
`

export const MainWindowLocalIdText = styled(Text)`
  font-size: 18px;
  color: white;
`

export const MainWindowTitle = styled(Text)`
  font-size: 25px;
  margin-bottom: 5px;
  font-weight: bold;
  color: white;
`
export const MainWindowRemoteId = styled(View)`
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: black;
`

export const MainWindowError = styled(Text)`
  color: #d9534f;
`

export const MainWindowTextInput = styled(TextInput)`
  margin: 6px 0;
  padding: 5px;
  text-align: center;
  font-size: 18px;
  color: white;
  /* background-color: rgba(255, 255, 255, 0.7); */
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0px;
  border-bottom-color: white;
  border-bottom-width: 0.5px;
`

export const MainWindowButtonIcon = styled(TouchableOpacity)`
  background-color: rgba(0, 0, 0, 0.4);
  padding: 20px;
  border-radius: 40px;
  margin-top: 10px;
  align-self: center;
  justify-self: center;
`

export const MainWindowButtonText = styled(MainWindowButtonIcon)`
  border-radius: 10px;
  padding: 7px 12px;
`

export const ShowButton = styled(MainWindowButtonIcon)`
  padding: 10px 15px;
  border-radius: 15px;
`

export const RowContainer = styled(View)`
  display: flex;
  flex-direction: row;
  width: 280px;
  justify-content: center;
  align-items: center;
`