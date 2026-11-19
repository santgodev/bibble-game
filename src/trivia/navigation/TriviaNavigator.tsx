import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { TriviaStackParamList } from './types';
import { TriviaHomeScreen } from '../screens/TriviaHomeScreen';
import { TriviaProgressScreen } from '../screens/TriviaProgressScreen';
import { TriviaCatalogScreen } from '../screens/TriviaCatalogScreen';
import { TriviaSoloGameScreen } from '../screens/TriviaSoloGameScreen';
import { TriviaSoloResultsScreen } from '../screens/TriviaSoloResultsScreen';
import { TriviaFriendsScreen } from '../screens/TriviaFriendsScreen';
import { TriviaCreateRoomScreen } from '../screens/TriviaCreateRoomScreen';
import { TriviaRoomLobbyScreen } from '../screens/TriviaRoomLobbyScreen';
import { TriviaTeamGameScreen } from '../screens/TriviaTeamGameScreen';

const Stack = createStackNavigator<TriviaStackParamList>();

export const TriviaNavigator = () => {
    const { colors } = useTheme();

    return (
        <Stack.Navigator
            initialRouteName="TriviaHome"
            screenOptions={{
                headerShown: false,
                cardStyle: {
                    flex: 1,
                    height: '100%',
                    backgroundColor: colors.background,
                    width: '100%',
                },
            }}
        >
            <Stack.Screen name="TriviaHome" component={TriviaHomeScreen} />
            <Stack.Screen name="TriviaProgress" component={TriviaProgressScreen} />
            <Stack.Screen name="TriviaCatalog" component={TriviaCatalogScreen} />
            <Stack.Screen name="TriviaSoloGame" component={TriviaSoloGameScreen} />
            <Stack.Screen name="TriviaSoloResults" component={TriviaSoloResultsScreen} />
            <Stack.Screen name="TriviaFriends" component={TriviaFriendsScreen} />
            <Stack.Screen name="TriviaCreateRoom" component={TriviaCreateRoomScreen} />
            <Stack.Screen name="TriviaRoomLobby" component={TriviaRoomLobbyScreen} />
            <Stack.Screen name="TriviaTeamGame" component={TriviaTeamGameScreen} />
        </Stack.Navigator>
    );
};
