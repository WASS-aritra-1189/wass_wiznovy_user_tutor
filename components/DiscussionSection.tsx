import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const DiscussionSection: React.FC = () => {
  const sampleMessages = [
    {
      id: 1,
      sender: 'John Doe',
      message: 'Great explanation in this video! Really helped me understand the concept.',
      timestamp: '2:30 PM',
      isOwn: false,
    },
    {
      id: 2,
      sender: 'You',
      message: 'I have a question about the implementation part.',
      timestamp: '2:35 PM',
      isOwn: true,
    },
    {
      id: 3,
      sender: 'Sarah Wilson',
      message: 'Can someone explain the difference between these two approaches?',
      timestamp: '2:40 PM',
      isOwn: false,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {sampleMessages.map((msg) => (
          <View key={msg.id} style={[styles.messageCard, msg.isOwn && styles.ownMessage]}>
            <Text style={styles.senderName}>{msg.sender}</Text>
            <Text style={styles.messageText}>{msg.message}</Text>
            <Text style={styles.timestamp}>{msg.timestamp}</Text>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your message..."
          placeholderTextColor="#999999"
          multiline
        />
        <TouchableOpacity style={styles.sendButton}>
          <MaterialIcons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
  },
  messagesContainer: {
    flex: 1,
    paddingBottom: 10,
  },
  messageCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    marginRight: 50,
    alignSelf: 'flex-start',
  },
  ownMessage: {
    backgroundColor: '#16423C',
    marginRight: 0,
    marginLeft: 50,
    alignSelf: 'flex-end',
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 18,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 10,
    color: '#999999',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
    color: '#333333',
  },
  sendButton: {
    backgroundColor: '#16423C',
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
  },
});

export default DiscussionSection;