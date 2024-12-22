import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../constants/Colors';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import auth from '../config/firebaseAuth';

const VerifyAccount = ({ navigation }) => {
  const [verifyImage, setVerifyImage] = useState(null);
  const user = auth.currentUser;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Cần quyền truy cập', 'Chúng tôi cần quyền truy cập thư viện ảnh để chọn ảnh xác minh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setVerifyImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!verifyImage) {
      Alert.alert('Lỗi', 'Vui lòng chụn ảnh xác minh');
      return;
    }

    try {
      let imageUrl = verifyImage;

      if (verifyImage && verifyImage.startsWith('file://')) {
        const storage = getStorage();
        const response = await fetch(verifyImage);
        const blob = await response.blob();
        const storageRef = ref(storage, `verify/${user.uid}/${Date.now()}`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      const db = getFirestore();
      await updateDoc(doc(db, 'users', user.uid), {
        verifyImage: imageUrl,
        verifyStatus: 'pending',
        verifySubmittedAt: new Date()
      });

      Alert.alert(
        'Thành công',
        'Yêu cầu xác minh đã được gửi. Vui lòng đợi admin phê duyệt.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể gửi yêu cầu xác minh. Vui lòng thử lại sau.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác minh tài khoản</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <Text style={styles.instructions}>
          Vui lòng chụn ảnh CCCD cùng khuôn mặt để xác minh danh tính của bạn
        </Text>

        <TouchableOpacity style={styles.imagePickerContainer} onPress={pickImage}>
          {verifyImage ? (
            <Image source={{ uri: verifyImage }} style={styles.imagePreview} resizeMode="contain" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={40} color={Colors.gray} />
              <Text style={styles.imagePlaceholderText}>Chọn ảnh xác minh</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.submitButton, !verifyImage && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!verifyImage}
        >
          <Text style={styles.submitButtonText}>Gửi xác minh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: 'Baloo2-Bold',
  },
  content: {
    padding: 16,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Baloo2-Regular',
    color: Colors.primary,
  },
  imagePickerContainer: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    marginBottom: 20,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: Colors.gray,
    fontFamily: 'Baloo2-Regular',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.gray,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: 'Baloo2-Bold',
  },
});

export default VerifyAccount;