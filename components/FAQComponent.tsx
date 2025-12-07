import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchFAQs } from '../store/faqSlice';
import { MaterialIcons } from '@expo/vector-icons';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { faqs, loading, error } = useSelector((state: RootState) => state.faq);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  useEffect(() => {
    dispatch(fetchFAQs());
  }, [dispatch]);



  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const renderFAQItem = (item: FAQItem) => {
    const isExpanded = expandedItems.includes(item.id);
    
    return (
      <View key={item.id} style={styles.faqItem}>
        <TouchableOpacity 
          style={styles.questionContainer}
          onPress={() => toggleExpanded(item.id)}
        >
          <Text style={styles.questionText}>{item.question}</Text>
          <View style={styles.toggleButton}>
            <Text style={styles.toggleIcon}>{isExpanded ? '−' : '+'}</Text>
          </View>
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.answerContainer}>
            <Text style={styles.answerText}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16423C" />
          <Text style={styles.loadingText}>Loading FAQs...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>Failed to load FAQs</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => dispatch(fetchFAQs())}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (faqs.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="help-outline" size={48} color="#CCCCCC" />
          <Text style={styles.emptyText}>No FAQs available</Text>
        </View>
      );
    }
    
    return faqs.map(renderFAQItem);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Frequently Asked Questions</Text>
      <Text style={styles.subtitle}>Everything you need to know about the product and billing.</Text>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 30,
    paddingHorizontal:20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
    paddingHorizontal: 10,
    paddingBottom: 50,
    paddingTop: 50,
  },
  faqItem: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  toggleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#01004C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 12,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#16423C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
  },
});

export default FAQComponent;