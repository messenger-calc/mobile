import React, {useEffect, useState} from 'react';
import { StyleSheet, TextInput} from 'react-native';
import { DisplayProps } from '../types';

export default function Display({ display }: DisplayProps) {
    const [fontSize, setFontSize] = useState(90);

    useEffect(() => {
        if (display.toString().length > 9) {
            return;
        }
        if (display.toString().length >= 7){
            setFontSize(90 - (display.toString().length - 6) * (6 / display.toString().length * 13))
        } else {
            setFontSize(90)
        }

    }, [display])


    return (
        <TextInput
            style={{...styles.textInput, fontSize}}
            maxLength={6}
            editable={false}
            value={display.toString().replace('.', ',')}/>
    );
}

const styles = StyleSheet.create({
    textInput: {
        margin: 17,
        marginBottom: 5,
        fontWeight: '200',
        textAlign: 'right',
        color: 'white',
    },
});
