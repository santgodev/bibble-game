import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { HomeScreen } from '../screens/HomeScreen';
import { CategorySelectionScreen } from '../screens/CategorySelectionScreen';
import { GameScreen } from '../screens/GameScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { WordPreviewScreen } from '../screens/WordPreviewScreen';
import { VideoReviewScreen } from '../screens/VideoReviewScreen';
import { CreateCategoryScreen } from '../screens/CreateCategoryScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { RankingDashboardScreen } from '../screens/RankingDashboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { StudyPathsScreen } from '../screens/StudyPathsScreen';
import { StudyMissionsScreen } from '../screens/StudyMissionsScreen';
import { StudyDevotionalScreen } from '../screens/StudyDevotionalScreen';
import { SystemGuideScreen } from '../screens/SystemGuideScreen';
import { useTheme } from '../context/ThemeContext';

// Trivia
import { TriviaGameScreen } from '../screens/TriviaGameScreen';

// Impostor Screens
import { ImpostorConfigScreen } from '../screens/impostor/ImpostorConfigScreen';
import { ImpostorCategoriesScreen } from '../screens/impostor/ImpostorCategoriesScreen';
import { ImpostorPassScreen } from '../screens/impostor/ImpostorPassScreen';
import { ImpostorGameScreen } from '../screens/impostor/ImpostorGameScreen';
import { ImpostorResultsScreen } from '../screens/impostor/ImpostorResultsScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
    const { colors, isDark } = useTheme();

    const navigationTheme = {
        ...DefaultTheme,
        dark: isDark,
        colors: {
            ...DefaultTheme.colors,
            primary: colors.primary,
            background: colors.background,
            card: colors.surface,
            text: colors.text,
            border: colors.border,
            notification: colors.error,
        }
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Auth" component={AuthScreen} />
                <Stack.Screen name="RankingDashboard" component={RankingDashboardScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="CategorySelection" component={CategorySelectionScreen} />
                <Stack.Screen name="WordPreview" component={WordPreviewScreen} />
                <Stack.Screen name="Game" component={GameScreen} />
                <Stack.Screen name="Results" component={ResultsScreen} />
                <Stack.Screen name="VideoReview" component={VideoReviewScreen} />
                <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="StudyPaths" component={StudyPathsScreen} />
                <Stack.Screen name="StudyMissions" component={StudyMissionsScreen} />
                <Stack.Screen name="StudyDevotional" component={StudyDevotionalScreen} />
                <Stack.Screen name="SystemGuide" component={SystemGuideScreen} />

                {/* Trivia Flow */}
                <Stack.Screen name="TriviaGame" component={TriviaGameScreen} />

                {/* Impostor Flow */}
                <Stack.Screen name="ImpostorConfig" component={ImpostorConfigScreen} />
                <Stack.Screen name="ImpostorCategories" component={ImpostorCategoriesScreen} />
                <Stack.Screen name="ImpostorPass" component={ImpostorPassScreen} />
                <Stack.Screen name="ImpostorGame" component={ImpostorGameScreen} />
                <Stack.Screen name="ImpostorResults" component={ImpostorResultsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
