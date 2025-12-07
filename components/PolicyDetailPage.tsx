import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SafeAreaWrapper from './SafeAreaWrapper';

interface PolicyDetailPageProps {
  onBack?: () => void;
  title: string;
  content: string;
}

const PolicyDetailPage: React.FC<PolicyDetailPageProps> = ({
  onBack,
  title,
  content,
}) => {
  return (
    <SafeAreaWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#16423C" />
        
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
            <Text style={styles.backText}>{title}</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>{content}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#16423C',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  headerPlaceholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    margin: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    textAlign: 'justify',
  },
});

export default PolicyDetailPage;