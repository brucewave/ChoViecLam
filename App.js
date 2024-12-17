import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Ionicons } from 'react-native-vector-icons';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import JobDetail from './pages/JobDetail';
import ChatDetail from './pages/ChatDetailScreen'; 
import JobSearchScreen from './pages/JobSearchScreen';
import MapScreen from './pages/MapScreen';
import ProfileScreen from './pages/ProfileScreen';
import RegisterScreen from './pages/RegisterScreen';
import SubscriptionScreen from './pages/SubscriptionScreen';
import ChatScreen from './pages/ChatScreen';
import AddJob from './pages/AddJob';
import VerifyAccount from './pages/VerifyAccount';
import ChatDetailScreen from './pages/ChatDetailScreen';
import JobProfileScreen from './pages/JobProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [notification, setNotification] = useState(null); // State to store the notification
  const [isVisible, setIsVisible] = useState(false); // State to control visibility of notification

  useEffect(() => {
    const requestPermissions = async () => {
      // Yêu cầu quyền thông báo
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('You need to enable notifications to use this feature!');
        return;
      }
      console.log('Permissions granted!');
      
      // Lấy token Push Notifications
      const token = await Notifications.getExpoPushTokenAsync();
      console.log('Expo Push Token:', token);
    };

    // Lắng nghe thông báo khi nhận được
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      setNotification(notification); // Cập nhật state với thông báo nhận được
      setIsVisible(true); // Show notification
      setTimeout(() => {
        setIsVisible(false); // Hide notification after 5 seconds
      }, 5000);
    });

    // Lắng nghe khi người dùng tương tác với thông báo
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('User interacted with the notification:', response);
    });

    requestPermissions(); // Yêu cầu quyền thông báo

    // Cleanup listeners when component unmounts
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomeMain" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="JobDetail" component={JobDetail} />
        <Stack.Screen name="ChatDetail" component={ChatDetail} /> 
        <Stack.Screen name="AddJob" component={AddJob} options={{ headerShown: false }} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VerifyAccount" component={VerifyAccount} options={{ headerShown: false }} />
        <Stack.Screen name="ChatDetailScreen" component={ChatDetailScreen} />
        <Stack.Screen name="JobProfileScreen" component={JobProfileScreen} />        
      </Stack.Navigator>

      {/* Show the notification on UI if exists */}
      {isVisible && notification && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationTitle}>{notification.request.content.title}</Text>
          <Text style={styles.notificationBody}>{notification.request.content.body}</Text>
        </View>
      )}
      
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Tìm việc" 
        component={JobSearchScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-outline" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Subscription" 
        component={SubscriptionScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="card-outline" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />
        }} 
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContainer: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    zIndex: 1000,
    alignItems: 'center',
  },
  notificationTitle: {
    fontWeight: 'bold',
  },
  notificationBody: {
    fontSize: 14,
    color: '#333',
  },
});
