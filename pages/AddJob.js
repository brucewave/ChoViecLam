import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../constants/Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { collection, getDocs, addDoc, getDoc, doc } from 'firebase/firestore';
import db from '../config/firebaseFirestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import auth from '../config/firebaseAuth';
import AddLocationJob from '../components/AddLocationJob';

const AddJob = ({ navigation }) => {
  const user = auth.currentUser;
  const [userProfile, setUserProfile] = useState(null);
  const [jobData, setJobData] = useState({
    title: '',
    category: '',
    quantity: '',
    salary: '',
    address: '',
    description: '',
    image: null,
    gender: '',
    poster: user ? user.uid : '',
    latitude: '',
    longitude: ''
  });

  const [open, setOpen] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const categoryNames = {
    bartender: 'Pha Chế',
    waiter: 'Phục Vụ',
    casual: 'Casual',
    urgent: 'Gấp',
    tutor: 'Dạy Kèm',
    sale: 'Bán Hàng',
    kitchen: 'Phụ Bếp',
    security: 'Bảo Vệ',
    'pg/pb': 'PG/PB',
    orther: 'Khác'
  };

  const categoryOrder = ['waiter', 'bartender', 'tutor', 'casual', 'urgent', 'sale', 'pg/pb', 'kitchen', 'security', 'orther'];

  const genderOptions = [
    { label: 'Nam', value: 'male' },
    { label: 'Nữ', value: 'female' },
    { label: 'Không yêu cầu', value: 'any' }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Category"));
        const categoryList = querySnapshot.docs
          .map(doc => {
            const data = doc.data();
            if (data.name) {
              return {
                label: categoryNames[data.name] || data.name,
                value: data.name,
                id: doc.id,
                ...data
              };
            }
            return null;
          })
          .filter(item => item !== null);
        
        const sortedCategories = categoryList.sort((a, b) => {
          return categoryOrder.indexOf(a.value) - categoryOrder.indexOf(b.value);
        });
        
        setCategories(sortedCategories);
      } catch (error) {
        console.error("Error fetching categories: ", error);
        alert('Không thể tải danh mục công việc');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfile({
            uid: user.uid,
            email: user.email,
            ...userData
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Xin lỗi, chúng tôi cần quyền truy cập thư viện ảnh!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setJobData({...jobData, image: result.assets[0].uri});
    }
  };

  const handleSubmit = async () => {
    try {
      // Kiểm tra xem user có subscription active không
      const subscriptionsSnapshot = await getDocs(collection(db, 'subscriptions'));
      const userSubscription = subscriptionsSnapshot.docs.find(doc => doc.id === user.uid);
      
      let endDate = null;
      if (userSubscription) {
        const subscriptionData = userSubscription.data();
        endDate = new Date(subscriptionData.endDate);
        const now = new Date();
        
        if (endDate < now) {
          alert('Gói subscription của bạn đã hết hạn. Vui lòng gia hạn để đăng tin VIP.');
          return;
        }
      }

      let imageUrl = jobData.image;
      if (jobData.image && jobData.image.startsWith('file://')) {
        const storage = getStorage();
        const response = await fetch(jobData.image);
        const blob = await response.blob();
        const storageRef = ref(storage, `images/${Date.now()}`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      const jobRef = collection(db, "Jobs");
      await addDoc(jobRef, {
        ...jobData,
        image: imageUrl,
        poster: user.uid,
        posterInfo: userProfile,
        // Thêm endDate nếu user có subscription
        ...(endDate && { endDate: endDate.toISOString() }),
        // Thêm trường isVip nếu có subscription
        isVip: !!endDate
      });

      alert('Công việc đã được đăng thành công!');
      navigation.pop();
    } catch (error) {
      console.error("Error adding job: ", error);
      alert('Đã xảy ra lỗi khi đăng công việc');
    }
  };

  const handleLocationSelect = (coordinate) => {
    setSelectedLocation(coordinate);
    setShowMap(false);
    setJobData(prev => ({
      ...prev,
      latitude: coordinate.latitude.toString(),
      longitude: coordinate.longitude.toString()
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm Công Việc Mới</Text>
        <View style={{width: 24}} />
      </View>

      <KeyboardAwareScrollView>
        <View style={styles.form}>
          {/* Image Picker */}
          <TouchableOpacity style={styles.imagePickerContainer} onPress={pickImage}>
            {jobData.image ? (
              <Image source={{ uri: jobData.image }} style={styles.imagePreview} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={40} color={Colors.gray} />
                <Text style={styles.imagePlaceholderText}>Thêm ảnh công việc</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tiêu đề công việc</Text>
            <TextInput
              style={styles.input}
              value={jobData.title}
              onChangeText={(text) => setJobData({...jobData, title: text})}
              placeholder="Nhập tiêu đề công việc"
            />
          </View>

          <View style={[styles.inputGroup, { zIndex: 2000 }]}>
            <Text style={styles.label}>Danh mục</Text>
            <DropDownPicker
              open={open}
              value={jobData.category}
              items={categories}
              setOpen={setOpen}
              setValue={(callback) => {
                setJobData(prev => ({...prev, category: callback(prev.category)}));
              }}
              setItems={setCategories}
              placeholder="Chọn danh mục"
              style={styles.input}
              listMode="MODAL"
              modalProps={{
                animationType: "fade"
              }}
              textStyle={{
                fontFamily: 'Baloo2-Regular'
              }}
              dropDownContainerStyle={{
                borderColor: Colors.gray
              }}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, {flex: 1, marginRight: 10}]}>
              <Text style={styles.label}>Số lượng</Text>
              <TextInput
                style={styles.input}
                value={jobData.quantity}
                onChangeText={(text) => setJobData({...jobData, quantity: text})}
                placeholder="Số lượng"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, {flex: 1}]}>
              <Text style={styles.label}>Lương (k/h)</Text>
              <TextInput
                style={styles.input}
                value={jobData.salary}
                onChangeText={(text) => setJobData({...jobData, salary: text})}
                placeholder="Lương/giờ"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={[styles.inputGroup, { zIndex: 1500 }]}>
            <Text style={styles.label}>Giới tính</Text>
            <DropDownPicker
              open={openGender}
              value={jobData.gender}
              items={genderOptions}
              setOpen={setOpenGender}
              setValue={(callback) => {
                setJobData(prev => ({...prev, gender: callback(prev.gender)}));
              }}
              placeholder="Chọn giới tính"
              style={styles.input}
              listMode="MODAL"
              modalProps={{
                animationType: "fade"
              }}
              textStyle={{
                fontFamily: 'Baloo2-Regular'
              }}
              dropDownContainerStyle={{
                borderColor: Colors.gray
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ</Text>
            <View style={styles.addressContainer}>
              <TextInput
                style={[styles.input, styles.addressInput]}
                value={jobData.address}
                onChangeText={(text) => setJobData({...jobData, address: text})}
                placeholder="Nhập địa chỉ"
              />
              <TouchableOpacity 
                style={styles.mapButton}
                onPress={() => setShowMap(true)}
              >
                <Ionicons name="location" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mô tả công việc</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={jobData.description}
              onChangeText={(text) => setJobData({...jobData, description: text})}
              placeholder="Mô tả chi tiết công việc"
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Đăng Tin</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      <Modal
        visible={showMap}
        animationType="slide"
        onRequestClose={() => setShowMap(false)}
      >
        <AddLocationJob onLocationSelect={handleLocationSelect} />
      </Modal>
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
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
    zIndex: 1000,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Baloo2-Medium',
    color: Colors.primary,
  },
  input: {
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    fontFamily: 'Baloo2-Regular',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: 'Baloo2-Bold',
  },
  imagePickerContainer: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
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
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addressInput: {
    flex: 1,
  },
  mapButton: {
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddJob;
