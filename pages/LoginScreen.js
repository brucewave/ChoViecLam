import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Alert, Pressable } from 'react-native';
import auth from '../config/firebaseAuth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user session
      await AsyncStorage.setItem('userSession', JSON.stringify(user));

      // Fetch user data from Firestore
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        navigation.navigate('HomeMain', { user: { ...user, ...userDoc.data() } });
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
      }
    } catch (error) {
      Alert.alert('Đăng nhập thất bại', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logoChoViecLam.png')} style={styles.logo} />
      <Text style={styles.welcomeText}>Chào bạn!</Text>
      <Text style={styles.description}>
        Đăng nhập để tìm kiếm công việc gần và uy tín nhất quanh khu vực bạn!
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
          />
          <Pressable 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
              size={24} 
              color="#666"
            />
          </Pressable>
        </View>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <Text style={styles.registerPrompt}>
        Chưa có tài khoản?{' '}
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          Đăng ký ngay
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
    height: 120,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerPrompt: {
    marginTop: 20,
    fontSize: 14,
    color: '#555',
  },
  registerLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
  },
  eyeIcon: {
    padding: 10,
  },
});

export default LoginScreen;
