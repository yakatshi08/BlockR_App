import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme/ThemeContext';

// Import des types
import { RootTabParamList, RootStackParamList } from '../types/navigation';

// Import des écrans
import HomeScreen from '../screens/Home/HomeScreen';
import ContactsScreen from '../screens/Contacts/ContactsScreen';
import BlacklistScreen from '../screens/Blacklist/BlacklistScreen';
import ScheduleScreen from '../screens/Schedule/ScheduleScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

// Création des navigateurs
const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Navigation par onglets
const TabNavigator = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Contacts':
              iconName = focused ? 'contacts' : 'contacts-outline';
              break;
            case 'Blacklist':
              iconName = focused ? 'block-helper' : 'cancel';
              break;
            case 'Schedule':
              iconName = focused ? 'calendar-clock' : 'calendar-clock-outline';
              break;
            case 'Settings':
              iconName = focused ? 'cog' : 'cog-outline';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.primary,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: t('navigation.home'),
          headerShown: false, // HomeScreen a son propre header
        }}
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactsScreen}
        options={{ title: t('navigation.contacts') }}
      />
      <Tab.Screen 
        name="Blacklist" 
        component={BlacklistScreen}
        options={{ 
          title: t('navigation.blacklist'),
          headerShown: false, // BlacklistScreen a son propre header stats
        }}
      />
      <Tab.Screen 
        name="Schedule" 
        component={ScheduleScreen}
        options={{ title: t('navigation.schedule') }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          title: t('navigation.settings'),
          headerShown: false, // SettingsScreen a son propre header profile
        }}
      />
    </Tab.Navigator>
  );
};

// Navigation principale avec Stack
const AppNavigator = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: theme.colors.background === '#121212',
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.error,
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        {/* Autres écrans à ajouter plus tard */}
        {/* <Stack.Screen name="Auth" component={AuthScreen} /> */}
        {/* <Stack.Screen name="Game" component={GameScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;