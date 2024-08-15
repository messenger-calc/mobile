import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../common/types';
import Calculator from '../screens/calculator/calculator.tsx';
import Chat from '../screens/chat/chat.tsx';

export const Navigator = () => {
    const Stack = createNativeStackNavigator<RootStackParamList>();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen 
                name="Calculator" 
                component={Calculator} />
            <Stack.Screen 
                name="Chat" 
                component={Chat} />
        </Stack.Navigator>
    )
}