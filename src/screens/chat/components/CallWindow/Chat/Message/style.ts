import styled from "styled-components/native"

export const Message = styled.View`
  border-radius: 20px;
  padding: 5px 10px;
  margin: 3px 0;
  display: flex;
  flex-direction: column;
  max-width: 90%;
`

export const MyMessage = styled(Message)`
  align-items: flex-end;
  align-self: flex-end;
  margin-right: 10px;
  background-color: rgba(52, 200, 90, 255);
  border-bottom-right-radius: none;
  color: whitesmoke;
`

export const OtherMessage = styled(Message)`
  align-items: flex-start;
  align-self: flex-start;
  border-bottom-left-radius: none;
  color: ${props => (props.theme.main === 'light' ? 'black' : 'whitesmoke')};  
  background-color: ${props => (props.theme.main === 'light' ? 'rgb(233, 233, 235)' : 'rgb(38, 38, 40)')};
`

export const From = styled.Text`
  color: #9f83f3;
  font-size: 16px;
`

export const MessageText = styled.Text<{ messageType?: 'my' | 'other' }>`
  color: ${props => (props.messageType === 'my' ? 'whitesmoke' : props.theme.main === 'light' ? 'black' : 'whitesmoke')};
  font-size: 16px;
`