import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions,TouchableOpacity, Alert } from 'react-native';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

export default function JobProfileScreen({ route }) {
const navigation = useNavigation();
  const { userId } = route.params;
  const [userData, setUserData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('VỀ TÔI');

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', userId));

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    const fetchJobs = async () => {
      if (userId) {
        const db = getFirestore();
        const jobsRef = collection(db, 'Jobs');
        const q = query(jobsRef, where('posterInfo.uid', '==', userId));
        
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

    fetchUserData();
    fetchJobs();
  }, [userId]);

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

  const JobListItem = ({ job }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity 
        style={[styles.jobCard, { width: windowWidth - 30 }]}
        onPress={() => navigation.navigate('JobDetail', job)}
      >
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
  };

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
                <Text style={styles.infoLabel}>Trạng thái xác minh</Text>
                <View style={styles.verifyContainer}>
                  <Text style={[
                    styles.infoValue,
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
      default:
        return null;
    }
  };

  const handleReport = async () => {
    Alert.alert(
      "Báo cáo tài khoản",
      "Bạn có chắc chắn muốn báo cáo tài khoản này?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Báo cáo",
          onPress: async () => {
            try {
              const db = getFirestore();
              const userRef = doc(db, 'users', userId);
              
              await updateDoc(userRef, {
                isReported: true
              });

              Alert.alert("Thông báo", "Báo cáo đã được gửi đi");
            } catch (error) {
              console.error("Error reporting user: ", error);
              Alert.alert("Lỗi", "Không thể báo cáo tài khoản này. Vui lòng thử lại sau.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={handleReport}
            style={styles.reportButton}
          >
            <Ionicons name="alert-circle-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
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

          <TouchableOpacity 
            style={styles.messageButton}
            onPress={() => navigation.navigate('ChatDetailScreen', { 
              uid: userId,
              fullName: userData?.fullName
            })}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.white} />
            <Text style={styles.messageButtonText}>Nhắn tin</Text>
          </TouchableOpacity>
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
      </View>

      <ScrollView style={styles.content}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      header: {
        paddingTop: 40,
        paddingBottom: 20,
        alignItems: 'center',
      },
      headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        position: 'absolute',
        right: 15,
        top: 40,
        zIndex: 999,
      },
      profileInfo: {
        alignItems: 'center',
      },
      avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#fff',
      },
      userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
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
        color: '#fff',
        color: 'black',

      },
      statLabel: {
        fontSize: 12,
        color: 'black',
        opacity: 0.8,
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 10,
        gap: 8,
      },
      messageButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontFamily: 'Baloo2-Medium',
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      verifyButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
      },
      verifyButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
      },
      picker: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginTop: 5,
      },
      verifyStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
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
reportButton: {
  padding: 5,
  color: Colors.primary,
},
jobFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 10,
},
chatButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: Colors.primary,
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 20,
  gap: 5,
},
chatButtonText: {
  color: Colors.white,
  fontSize: 14,
  fontFamily: 'Baloo2-Medium',
},
addressText: {
  flex: 1,
  fontSize: 12,
  fontFamily: 'Baloo2-Regular',
  marginRight: 10,
},
});