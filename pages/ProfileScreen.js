import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Image, Dimensions, Modal, TextInput, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '../config/firebaseAuth';
import { signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;


const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const user = auth.currentUser;
  const [role, setRole] = useState('applicant');
  const [activeTab, setActiveTab] = useState('CÔNG VIỆC');
  const [jobs, setJobs] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');
  const [editedSalary, setEditedSalary] = useState('');
  const [editedAddress, setEditedAddress] = useState('');
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const isOwnProfile = user?.uid === userData?.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          setUserData({ ...user, ...userDoc.data() });
        } else {
          Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
        }
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (user) {
        const db = getFirestore();
        const jobsRef = collection(db, 'Jobs');
        const q = query(jobsRef, where('posterInfo.uid', '==', user.uid));
        
        try {
          const querySnapshot = await getDocs(q);
          const jobsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setJobs(jobsList);
        } catch (error) {
          console.error("Error fetching jobs: ", error);
        }
      }
    };

    fetchJobs();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear user session from AsyncStorage
      await AsyncStorage.removeItem('userSession');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    }
  };

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

  const updateRole = async (newRole) => {
    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { role: newRole });
    setRole(newRole);
  };

  const handleDeleteJob = (jobId) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa công việc này?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        { 
          text: "Xóa", 
          onPress: async () => {
            try {
              const db = getFirestore();
              await deleteDoc(doc(db, 'Jobs', jobId));
              setJobs(jobs.filter(job => job.id !== jobId));
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa công việc");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleEditPress = (job) => {
    setEditingJob(job);
    setEditedTitle(job.title);
    setEditedQuantity(job.quantity.toString());
    setEditedSalary(job.salary.toString());
    setEditedAddress(job.address);
    setIsEditModalVisible(true);
  };

  const handleUpdateJob = async () => {
    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'Jobs', editingJob.id), {
        title: editedTitle,
        quantity: parseInt(editedQuantity),
        salary: parseInt(editedSalary),
        address: editedAddress,
      });

      // Cập nhật state jobs
      setJobs(jobs.map(job => 
        job.id === editingJob.id 
          ? {
              ...job,
              title: editedTitle,
              quantity: parseInt(editedQuantity),
              salary: parseInt(editedSalary),
              address: editedAddress,
            }
          : job
      ));

      setIsEditModalVisible(false);
      Alert.alert("Thành công", "Cập nhật công việc thành công");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật công việc");
    }
  };

  const handleEditProfile = () => {
    setEditedProfile({
      fullName: userData?.fullName || '',
      phoneNumber: userData?.phoneNumber || '',
      address: userData?.address || '',
      birthDay: userData?.birthDay || '',
      role: userData?.role || 'applicant',
    });
    setIsEditProfileModalVisible(true);
  };

  const handleUpdateProfile = async () => {
    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'users', user.uid), editedProfile);
      setUserData(prev => ({ ...prev, ...editedProfile }));
      setIsEditProfileModalVisible(false);
      Alert.alert("Thành công", "Cập nhật thông tin thành công");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin");
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    Promise.all([
      fetchUserData(),
      fetchJobs()
    ]).finally(() => {
      setRefreshing(false);
    });
  }, []);

  const fetchUserData = async () => {
    if (user) {
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        setUserData({ ...user, ...userDoc.data() });
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
      }
    }
  };

  const fetchJobs = async () => {
    if (user) {
      const db = getFirestore();
      const jobsRef = collection(db, 'Jobs');
      const q = query(jobsRef, where('posterInfo.uid', '==', user.uid));
      
      try {
        const querySnapshot = await getDocs(q);
        const jobsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setJobs(jobsList);
      } catch (error) {
        console.error("Error fetching jobs: ", error);
      }
    }
  };

  const EditJobModal = () => (
    <Modal
      visible={isEditModalVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chỉnh sửa công việc</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tiêu đề</Text>
            <TextInput
              style={styles.input}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Nhập tiêu đề công việc"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Số lượng</Text>
            <TextInput
              style={styles.input}
              value={editedQuantity}
              onChangeText={setEditedQuantity}
              keyboardType="numeric"
              placeholder="Nhập số lượng"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Lương (k/h)</Text>
            <TextInput
              style={styles.input}
              value={editedSalary}
              onChangeText={setEditedSalary}
              keyboardType="numeric"
              placeholder="Nhập lương"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              value={editedAddress}
              onChangeText={setEditedAddress}
              placeholder="Nhập địa chỉ"
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsEditModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.updateButton]}
              onPress={handleUpdateJob}
            >
              <Text style={styles.updateButtonText}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const EditProfileModal = () => (
    <Modal
      visible={isEditProfileModalVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chỉnh sửa thông tin</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              value={editedProfile?.fullName}
              onChangeText={(text) => setEditedProfile(prev => ({...prev, fullName: text}))}
              placeholder="Nhập họ và tên"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={editedProfile?.phoneNumber}
              onChangeText={(text) => setEditedProfile(prev => ({...prev, phoneNumber: text}))}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              value={editedProfile?.address}
              onChangeText={(text) => setEditedProfile(prev => ({...prev, address: text}))}
              placeholder="Nhập địa chỉ"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Ngày sinh</Text>
            <TextInput
              style={styles.input}
              value={editedProfile?.birthDay}
              onChangeText={(text) => setEditedProfile(prev => ({...prev, birthDay: text}))}
              placeholder="Nhập ngày sinh"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Vai trò</Text>
            <Picker
              selectedValue={editedProfile?.role}
              style={styles.picker}
              onValueChange={(itemValue) => 
                setEditedProfile(prev => ({...prev, role: itemValue}))
              }
            >
              <Picker.Item label="Người tìm việc" value="applicant" />
              <Picker.Item label="Nhà tuyển dụng" value="recruiter" />
            </Picker>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsEditProfileModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.updateButton]}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.updateButtonText}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const JobListItem = ({ job }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('JobDetail', job)}
      style={[styles.jobCard, { width: windowWidth - 30 }]}
    >
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          onPress={() => handleEditPress(job)}
          style={styles.actionButton}
        >
          <Ionicons name="create-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleDeleteJob(job.id)}
          style={styles.actionButton}
        >
          <Ionicons name="trash-outline" size={24} color={Colors.danger} />
        </TouchableOpacity>
      </View>

      <Image 
        source={{ uri: job?.image }} 
        style={[styles.jobImage, { width: windowWidth - 30 }]} 
      />
      <Text style={styles.jobTitle}>{job.title}</Text>
      
      <View style={styles.jobTags}>
        <Text style={[styles.tag, styles.quantityTag]}>
          {'Số lượng: ' + job.quantity}
        </Text>
        <Text style={[styles.tag, styles.categoryTag]}>
          {categoryNames[job.category] || job.category}
        </Text>
        <Text style={[styles.tag, styles.salaryTag]}>
          {'Lương: ' + job.salary + 'k/h'}
        </Text>
      </View>

      <View style={[styles.addressContainer, { width: windowWidth - 30 }]}>
        <Text 
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.addressText}
        >
          {'Địa chỉ: ' + job.address}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'VỀ TÔI':
        return (
          <View style={styles.tabContent}>
            <View style={styles.infoSection}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Họ và tên</Text>
                <Text style={styles.infoValue}>{userData?.fullName || 'Chưa cập nhật'}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Ngày sinh</Text>
                <Text style={styles.infoValue}>{userData?.birthDay || 'Chưa cập nhật'}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userData?.email || 'Chưa cập nhật'}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Số điện thoại</Text>
                <Text style={styles.infoValue}>{userData?.phoneNumber || 'Chưa cập nhật'}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Địa chỉ</Text>
                <Text style={styles.infoValue}>{userData?.address || 'Chưa cập nhật'}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Vai trò</Text>
                <Text style={styles.infoValue}>
                  {userData?.role === 'recruiter' ? 'Nhà tuyển dụng' : 'Người tìm việc'}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Ngày tham gia</Text>
                <Text style={styles.infoValue}>
                  {userData?.createdAt?.toDate().toLocaleDateString('vi-VN') || 'Chưa cập nhật'}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Trạng thái xác minh</Text>
                <View style={styles.verifyContainer}>
                  <View style={styles.verifyStatusWrapper}>
                    <Text style={[
                      styles.verifyStatus,
                      userData?.verifyStatus === 'verified' 
                        ? styles.verifiedStatus
                        : userData?.verifyStatus === 'pending'
                        ? styles.pendingStatus
                        : styles.unverifiedStatus
                    ]}>
                      {userData?.verifyStatus === 'verified' 
                        ? 'Đã xác minh'
                        : userData?.verifyStatus === 'pending'
                        ? 'Đang xét duyệt'
                        : 'Chưa xác minh'}
                    </Text>
                    {(userData?.verifyStatus === 'unverified' || !userData?.verifyStatus) && (
                      <TouchableOpacity 
                        style={styles.verifyButton}
                        onPress={() => navigation.navigate('VerifyAccount')}
                      >
                        <Text style={styles.verifyButtonText}>Xác minh ngay</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      case 'CÔNG VIỆC':
        return (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            style={styles.jobsContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
          >
            {jobs.map(job => (
              <JobListItem key={job.id} job={job} />
            ))}
            {jobs.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Chưa có công việc nào được đăng
                </Text>
              </View>
            )}
          </ScrollView>
        );
      case 'ĐÁNH GIÁ':
        return (
          <View style={styles.tabContent}>
            <Text>Nội dung đánh giá</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: userData?.avatarUrl || 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{userData?.fullName}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{jobs.length}</Text>
              <Text style={styles.statLabel}>Việc đã đăng</Text>
            </View>
          </View>
        </View>

        <View style={styles.profileActions}>
          {isOwnProfile ? (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.visitorActions}>
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Theo dõi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageButton}>
                <Text style={styles.messageButtonText}>Nhắn tin</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'VỀ TÔI' && styles.activeTab]}
          onPress={() => setActiveTab('VỀ TÔI')}
        >
          <Text style={[styles.tabText, activeTab === 'VỀ TÔI' && styles.activeTabText]}>
            VỀ TÔI
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'CÔNG VIỆC' && styles.activeTab]}
          onPress={() => setActiveTab('CÔNG VIỆC')}
        >
          <Text style={[styles.tabText, activeTab === 'CÔNG VIỆC' && styles.activeTabText]}>
            CÔNG VIỆC
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'ĐÁNH GIÁ' && styles.activeTab]}
          onPress={() => setActiveTab('ĐÁNH GIÁ')}
        >
          <Text style={[styles.tabText, activeTab === 'ĐÁNH GIÁ' && styles.activeTabText]}>
            ĐÁNH GIÁ
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {renderContent()}
      </ScrollView>
      <EditProfileModal />
      <EditJobModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statsContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  profileActions: {
    marginTop: 15,
    alignItems: 'center',
  },
  visitorActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 150,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  followButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  messageButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  messageButtonText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4B6BFB',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#4B6BFB',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 15,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  jobCard: {
    padding: 10,
    marginBottom: 15,
    backgroundColor: Colors.white2,
    borderRadius: 10,
  },
  actionButtons: {
    position: 'absolute',
    flexDirection: 'row',
    right: 10,
    top: 10,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 5,
  },
  actionButton: {
    marginHorizontal: 5,
    padding: 5,
  },
  jobImage: {
    height: 200,
    objectFit: 'cover',
    borderRadius: 10,
  },
  jobTitle: {
    fontSize: 18,
    fontFamily: 'Baloo2-Medium',
    marginTop: 10,
  },
  jobTags: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  tag: {
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
    fontFamily: 'Baloo2-Regular',
  },
  quantityTag: {
    backgroundColor: Colors.danger,
  },
  categoryTag: {
    backgroundColor: Colors.pastel,
  },
  salaryTag: {
    backgroundColor: Colors.green,
  },
  addressContainer: {
    height: 25,
  },
  addressText: {
    fontSize: 12,
    fontFamily: 'Baloo2-Regular',
    marginTop: 10,
    overflow: 'hidden',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
  },
  jobsContainer: {
    padding: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  updateButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  updateButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  verifyContainer: {
    marginTop: 5,
  },
  verifyStatusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verifyStatus: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 14,
  },
  verifyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginLeft: 10,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  verifiedStatus: {
    backgroundColor: '#e6ffe6',
    color: '#008000',
  },
  pendingStatus: {
    backgroundColor: '#fff3e6',
    color: '#ff9900',
  },
  unverifiedStatus: {
    backgroundColor: '#ffe6e6',
    color: '#ff0000',
  },
  logoutButton: {
    position: 'absolute',
    top: 40,
    right: 15,
    zIndex: 999,
    backgroundColor: Colors.danger,
    padding: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ProfileScreen;
