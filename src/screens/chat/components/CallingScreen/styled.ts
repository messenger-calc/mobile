import styled from "styled-components/native";

export const Title = styled.Text`
    color: white;
    font-size: 40px;
    font-weight: 700;
`

export const Row = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

export const Header = styled.View`
    margin-top: 100px;
`

export const ButtonRow = styled(Row)`
    flex: 1; 
    bottom: -100px;
    justify-content: space-between;
`

export const ButtonContainer = styled.View`
    flex: 1;
    bottom: 0;
    display: table-column-group;
`

export const ButtonIcon = styled.TouchableOpacity<{isRed?: boolean}>`
  background-color: ${ props => props.isRed ? '#ff463a' : 'rgba(255, 255, 255, 0.25)' };
  height: 90px;
  width: 90px;
  border-radius: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: ${props => props.isRed ? 32 : 0}px;
  margin: 0 25px;
`