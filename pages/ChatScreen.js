import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

const ChatScreen = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const db = getFirestore();
        const auth = getAuth();
        const currentUser = auth.currentUser;

        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));

        const currentUserData = userList.find(user => user.uid === currentUser.uid);
        if (currentUserData) {
          setCurrentUserRole(currentUserData.role);
        }

        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (uid, fullName) => {
    navigation.navigate('ChatDetail', { uid, fullName });
  };

  const filteredUsers = users.filter(user => {
    console.log(currentUserRole);
    if (currentUserRole === 'recruiter') {
      return user.role === 'applicant';
    } else if (currentUserRole === 'applicant') {
      return user.role === 'recruiter';
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh Sách Người Dùng</Text>
        <Text style={styles.headerSubtitle}>Chọn người để trò chuyện ngay!</Text>
      </View>

      <View style={styles.searchContainer}>
        <Image source={{uri: 'https://www.iconfinder.com/icons/4578014/download/512'}} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm người dùng"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredUsers.filter(user => 
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userCard} onPress={() => handleUserSelect(item.uid, item.fullName)}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{uri: item.avatar || 'https://via.placeholder.com/50'}}
                style={styles.avatar}
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.fullName}</Text>
              {item.role && (
                <Text style={styles.userRole}>
                  {item.role === 'recruiter' ? 'Nhà tuyển dụng' : 'Người tìm việc'}
                </Text>
              )}
              <Text style={styles.userAddress}>{item.address}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Màu nền sáng và dễ nhìn
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#1E90FF', // Màu xanh đậm cho header
    borderRadius: 10,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    elevation: 5, // shadow effect on Android
    shadowColor: '#000', // shadow effect on iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderLeftWidth: 5,
    borderLeftColor: '#1E90FF', // Viền trái màu xanh
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userRole: {
    fontSize: 14,
    color: '#FF6347', // Màu đỏ cho vai trò
    marginTop: 5,
  },
  userAddress: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
});

export default ChatScreen;
