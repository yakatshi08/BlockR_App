import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import des types
import { RootTabParamList, RootStackParamList } from '../types/navigation';

// Import des écrans (à créer)
// import HomeScreen from '../screens/Home/HomeScreen';
// import ContactsScreen from '../screens/Contacts/ContactsScreen';
// import BlacklistScreen from '../screens/Blacklist/BlacklistScreen';
// import ScheduleScreen from '../screens/Schedule/ScheduleScreen';
// import SettingsScreen from '../screens/Settings/SettingsScreen';

// Création des navigateurs
const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Composant temporaire pour les écrans non créés
const PlaceholderScreen = ({ name }: { name: string }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>{name}</Text>
      <Text style={{ fontSize: 16, marginTop: 10 }}>À implémenter</Text>
    </View>
  );
};

// Import temporaire pour le placeholder
import { View, Text } from 'react-native';

// Navigation par onglets
const TabNavigator = () => {
  const { t } = useTranslation();

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
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={() => <PlaceholderScreen name="Home" />}
        options={{ title: t('navigation.home') }}
      />
      <Tab.Screen 
        name="Contacts" 
        component={() => <PlaceholderScreen name="Contacts" />}
        options={{ title: t('navigation.contacts') }}
      />
      <Tab.Screen 
        name="Blacklist" 
        component={() => <PlaceholderScreen name="Blacklist" />}
        options={{ title: t('navigation.blacklist') }}
      />
      <Tab.Screen 
        name="Schedule" 
        component={() => <PlaceholderScreen name="Schedule" />}
        options={{ title: t('navigation.schedule') }}
      />
      <Tab.Screen 
        name="Settings" 
        component={() => <PlaceholderScreen name="Settings" />}
        options={{ title: t('navigation.settings') }}
      />
    </Tab.Navigator>
  );
};

// Navigation principale avec Stack
const AppNavigator = () => {
  return (
    <NavigationContainer>
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