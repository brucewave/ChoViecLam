// firebaseAuth.js
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import app from './firebaseInit'; // Lấy app đã khởi tạo từ firebaseInit.js

const auth = getAuth(app); // Khởi tạo Auth với app đã khởi tạo
auth.setPersistence(getReactNativePersistence(AsyncStorage));

export default auth;
