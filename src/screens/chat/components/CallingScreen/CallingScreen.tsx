import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CallingScreenProps } from './types';
import LinearGradient from 'react-native-linear-gradient';
import { ButtonIcon, ButtonRow, Header, Row, Title } from './styled';
import { Svg } from '../../../../assets/icons';

export const CallingScreen = ({ peerNickname, onReject, onSuccess }: CallingScreenProps) => {

    return (
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            colors={['#6d6e70', '#383b42']}
            style={styles.linearGradient}>
            
        <Header>
            <Row><Text style={{fontSize: 25, color: 'white'}}>Audicall</Text></Row>
            <Row><Title>{peerNickname}</Title></Row>
        </Header>

        <ButtonRow>
            <ButtonIcon style={styles.buttonRed} isRed={true} onPress={onReject}>
                {/* REJECT */}
                <Svg.PhoneDown fill={'white'} width={60} height={60}/>
            </ButtonIcon>

            <ButtonIcon style={styles.buttonShadow} onPress={onSuccess}>
                {/* SUCCESS */}
                <Svg.PhoneArrowUp fill={'white'} width={60} height={60}/>
            </ButtonIcon>
        </ButtonRow>

        </LinearGradient>
    )
}


const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
    },
    buttonShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 24,
    },
    buttonRed: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        
        elevation: 7,
    }
});