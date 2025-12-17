import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { performGlobalSearch } from '../services/searchService';
import TeacherCard, { Teacher } from '../components/TeacherCard';
import CourseCard from '../components/CourseCard';
import BookCard from '../components/BookCard';
import SubjectCard from '../components/SubjectCard';

interface Message {
  id: string;
  text?: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'cards';
  data?: any;
}

const AiChatHelpPage: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const extractKeywords = (text: string) => {
    const keywords = ['tutor', 'course', 'book', 'subject', 'teacher', 'class', 'lesson'];
    const lowerText = text.toLowerCase();
    const foundKeywords = keywords.filter(keyword => lowerText.includes(keyword));
    return foundKeywords.length > 0 ? foundKeywords[0] : null;
  };

  const createNoInfoMessage = (): Message => ({
    id: (Date.now() + 1).toString(),
    text: 'I don\'t have any information regarding your query. Please reach admin for more information.',
    isUser: false,
    timestamp: new Date(),
  });

  const buildResponseText = (totalResults: number, foundKeyword: string | null, userQuery: string, data: any) => {
    let text = `I found ${totalResults} results for "${foundKeyword ?? userQuery}":\n\n`;
    if (data.tutors?.total > 0) text += `📚 ${data.tutors.total} Tutors\n`;
    if (data.courses?.total > 0) text += `🎓 ${data.courses.total} Courses\n`;
    if (data.books?.total > 0) text += `📖 ${data.books.total} Books\n`;
    if (data.subjects?.total > 0) text += `📝 ${data.subjects.total} Subjects\n`;
    return text + '\nHow can I help you with these results?';
  };

  const handleSearchSuccess = (searchResult: any, foundKeyword: string | null, userQuery: string) => {
    const { tutors, courses, books, subjects } = searchResult.data;
    const totalResults = (tutors?.total || 0) + (courses?.total || 0) + (books?.total || 0) + (subjects?.total || 0);
    
    if (totalResults === 0) {
      setMessages(prev => [...prev, createNoInfoMessage()]);
      return;
    }
    
    const textResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: buildResponseText(totalResults, foundKeyword, userQuery, { tutors, courses, books, subjects }),
      isUser: false,
      timestamp: new Date(),
      type: 'text',
    };
    
    const cardsResponse: Message = {
      id: (Date.now() + 2).toString(),
      isUser: false,
      timestamp: new Date(),
      type: 'cards',
      data: { tutors, courses, books, subjects },
    };
    
    setMessages(prev => [...prev, textResponse, cardsResponse]);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userQuery = message.trim();
    setMessage('');

    const foundKeyword = extractKeywords(userQuery);
    const searchTerm = foundKeyword || userQuery;
    
    try {
      const searchResult = await performGlobalSearch(searchTerm);
      if (searchResult.success && searchResult.data) {
        handleSearchSuccess(searchResult, foundKeyword, userQuery);
      } else {
        setMessages(prev => [...prev, createNoInfoMessage()]);
      }
    } catch (error) {
      console.error('Error performing search:', error);
      setMessages(prev => [...prev, createNoInfoMessage()]);
    }
  };

  const renderTutorCards = (tutors: any[]) => {
    return tutors.slice(0, 5).map((tutor, index) => {
      const teacher: Teacher = {
        id: String(tutor.id || index),
        name: String(tutor.name || 'Tutor'),
        subject: String(tutor.subject || 'General'),
        rating: Number(tutor.rating) || 4.5,
        sessions: String(tutor.sessions || '10+'),
        groupTuition: Boolean(tutor.groupTuition !== false),
        privateTuition: Boolean(tutor.privateTuition !== false),
        image: tutor.profilePicture ? String(tutor.profilePicture) : undefined,
        isNew: Boolean(tutor.isNew)
      };
      return (
        <TeacherCard 
          key={`tutor-${tutor.id || tutor.name || index}`}
          teacher={teacher}
          onPress={() => {
            navigation?.navigate('TutorDetailPage', { 
              tutorId: tutor.account?.id || tutor.id, 
              tutor: {
                ...tutor,
                name: tutor.name || 'Tutor',
                subject: { name: tutor.subject || 'General' },
                averageRating: tutor.rating?.toString() || '4.5',
                hourlyRate: tutor.sessions?.replace('$', '').replace('/hr', '') || '50'
              }
            });
          }}
        />
      );
    });
  };

  const renderCourseCards = (courses: any[]) => {
    return courses.slice(0, 5).map((course, index) => (
      <CourseCard 
        key={`course-${course.id || course.title || index}`}
        image={require('../assets/coursefinalimage.png')}
        title={course.title || 'Course'}
        description={course.description || 'Course description'}
        duration={course.duration || 'N/A'}
        language={course.language || 'English'}
        price={course.price || 'Free'}
        totalVideos={course.totalVideos || '0'}
        rating={course.rating || '0'}
      />
    ));
  };

  const renderBookCards = (books: any[]) => {
    return books.slice(0, 5).map((book, index) => (
      <BookCard 
        key={`book-${book.id || book.title || book.name || index}`}
        title={book.title || book.name || 'Book Title'}
        author={book.author || book.writer || 'Unknown Author'}
        description={book.description || book.summary || 'Book description'}
      />
    ));
  };

  const renderSubjectCards = (subjects: any[]) => {
    return subjects.slice(0, 5).map((subject, index) => (
      <SubjectCard 
        key={`subject-${subject.id || subject.name || index}`}
        id={subject.id}
        name={subject.name}
        image={subject.image}
      />
    ));
  };

  const renderCards = (data: any) => {
    const allCards: React.ReactElement[] = [];
    
    if (data.tutors?.result) allCards.push(...renderTutorCards(data.tutors.result));
    if (data.courses?.result) allCards.push(...renderCourseCards(data.courses.result));
    if (data.books?.result?.length > 0) allCards.push(...renderBookCards(data.books.result));
    if (data.subjects?.result?.length > 0) allCards.push(...renderSubjectCards(data.subjects.result));
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.cardsScrollView}
        contentContainerStyle={styles.cardsContainer}
      >
        {allCards}
      </ScrollView>
    );
  };

  const renderMessage = (message: Message) => {
    if (message.type === 'cards') {
      return (
        <View key={message.id} style={styles.cardsMessageContainer}>
          {renderCards(message.data)}
        </View>
      );
    }

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          message.isUser ? styles.userMessage : styles.aiMessage,
        ]}
      >
        {!message.isUser && (
          <Image
            source={require('../assets/robot.png')}
            style={styles.aiAvatar}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            message.isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              message.isUser ? styles.userText : styles.aiText,
            ]}
          >
            {message.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#16423C', '#00FFDC']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.welcomeSection}>
              <Text style={styles.mainTitle}>Your Smart ✨AI Assistance is here to help you</Text>
              <Image
                source={require('../assets/aichatpage.png')}
                style={styles.welcomeImage}
                resizeMode="contain"
              />
            </View>

            {messages.map(renderMessage)}
          </ScrollView>

          {/* Chat Bar */}
          <View style={styles.chatBarContainer}>
            <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 5) }]}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your message..."
                placeholderTextColor="#999999"
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { opacity: message.trim() ? 1 : 0.5 }
                ]}
                onPress={handleSendMessage}
                disabled={!message.trim()}
              >
                <Text style={styles.sendIcon}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 50,
  },
  mainTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 40,
    lineHeight: 40,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#FFFFFF',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  welcomeImage: {
    width: 296,
    height: 355,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    marginRight: 10,
    marginTop: 5,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#16423C',
    marginLeft: 'auto',
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#333333',
  },
  chatBarContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 50,
    backgroundColor: '#FFFFFF',
    marginRight: 10,
    color: '#333333',
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#16423C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cardsMessageContainer: {
    marginBottom: 15,
  },
  cardsScrollView: {
    marginVertical: 10,
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    gap: 10,
  },
});

export default AiChatHelpPage;