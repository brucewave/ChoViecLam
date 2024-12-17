// firebaseFirestore.js
import { getFirestore } from 'firebase/firestore';
import app from './firebaseInit'; // Lấy app đã khởi tạo từ firebaseInit.js

const db = getFirestore(app); // Khởi tạo Firestore với app đã khởi tạo
export default db;
