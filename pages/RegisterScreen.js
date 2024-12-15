import React, { useState } from 'react';
import { ScrollView, View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import auth from '../config/firebaseAuth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleRegister = async () => {
    try {
      if (!fullName || !email || !password || !phoneNumber || !address || !birthDay) {
        Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        email,
        phoneNumber,
        address,
        birthDay,
        createdAt: new Date(),
        role: 'applicant',
      });

      Alert.alert('Thành công', 'Đăng ký tài khoản thành công!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login')
        }
      ]);
    } catch (error) {
      Alert.alert('Lỗi', error.message);
      console.error(error);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toLocaleDateString('vi-VN');
    setBirthDay(formattedDate);
    hideDatePicker();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('../assets/logoChoViecLam.png')} style={styles.logo} />
        <Text style={styles.welcomeText}>Chào mừng bạn!</Text>
        <Text style={styles.description}>Đăng ký để bắt đầu hành trình tìm kiếm công việc ngay nào!</Text>
        
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Họ và tên" 
            value={fullName} 
            onChangeText={setFullName} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            value={email} 
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Mật khẩu" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Số điện thoại" 
            value={phoneNumber} 
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Địa chỉ" 
            value={address} 
            onChangeText={setAddress} 
          />
          <TouchableOpacity 
            style={styles.input} 
            onPress={showDatePicker}
          >
            <Text style={[styles.dateText, !birthDay && styles.placeholderText]}>
              {birthDay || "Ngày sinh"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Đăng ký</Text>
        </TouchableOpacity>
        
        <Text style={styles.loginPrompt}>
          Đã có tài khoản?{' '}
          <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            Đăng nhập
          </Text>
        </Text>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          maximumDate={new Date()}
          date={birthDay ? new Date(birthDay) : new Date()}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    minHeight: '100%',
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
    height: 100,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginPrompt: {
    marginTop: 20,
    fontSize: 14,
    color: '#555',
  },
  loginLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  dateText: {
    paddingVertical: 15,
    color: '#000',
  },
  placeholderText: {
    color: '#999',
  },
});

export default RegisterScreen;
