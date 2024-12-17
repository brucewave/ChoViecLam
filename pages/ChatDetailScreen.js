import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getFirestore, collection, getDocs, addDoc, onSnapshot, doc, getDoc } from 'firebase/firestore';
import auth from '../config/firebaseAuth'; 

const ChatDetailScreen = ({ route }) => {
  const { uid } = route.params; // Nhận uid từ params
  const currentUserId = auth.currentUser.uid;
  const chatId = [uid, currentUserId].sort().join('_'); // Tạo ID cuộc hội thoại
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [fullName, setFullName] = useState(''); // State to store fullName

  useEffect(() => {
    const db = getFirestore();

    // Fetch fullName from users collection
    const fetchUserFullName = async () => {
      const userDoc = await getDoc(doc(db, 'users', uid)); // Get user document
      if (userDoc.exists()) {
        setFullName(userDoc.data().fullName); // Set fullName from user data
      } else {
        console.error('No such user!');
      }
    };

    fetchUserFullName(); // Call the function to fetch fullName

    const messagesCollection = collection(db, `chats/${chatId}/messages`); // Sử dụng chatId để lấy tin nhắn
    
    const unsubscribe = onSnapshot(messagesCollection, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      messageList.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(messageList);
    });

    return () => unsubscribe();
  }, [chatId, uid]); // Add uid as a dependency
  
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !fullName) {
      console.error('Invalid message or fullName');
      return;
    }
    try {
      const db = getFirestore();

      // Fetch fullName for currentUserId
      const currentUserDoc = await getDoc(doc(db, 'users', currentUserId)); // Get current user document
      const currentUserFullName = currentUserDoc.exists() ? currentUserDoc.data().fullName : 'Unknown'; // Set fullName from current user data

      const messagesCollection = collection(db, `chats/${chatId}/messages`); // Sử dụng chatId để gửi tin nhắn
      await addDoc(messagesCollection, {
        text: newMessage,
        sender: currentUserId, // ID của người gửi
        fullName: currentUserFullName, // Use fullName of currentUserId
        timestamp: new Date().toISOString(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={item.sender === currentUserId ? styles.sentMessage : styles.receivedMessage}>
            <Text style={styles.senderName}>{item.sender === currentUserId ? item.fullName : item.fullName}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={handleSendMessage}>
          <Text style={styles.sendButton}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF2F8',
    padding: 15,
  },
  header: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E90FF',
    borderRadius: 15,
    padding: 12,
    marginVertical: 5,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E90FF', // Changed to a lighter blue for better visibility
    borderRadius: 15,
    padding: 12,
    marginVertical: 5,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  senderName: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#ddd',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    marginLeft: 10,
  },
});

export default ChatDetailScreen;

