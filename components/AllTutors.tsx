import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SubjectTutorCard from './SubjectTutorCard';
import { getAllTutors, getAllSubjects } from '../services/searchService';

interface AllTutorsProps {
  onClose?: () => void;
  initialSubject?: string;
}

const AllTutors: React.FC<AllTutorsProps> = ({ onClose, initialSubject }) => {
  const navigation = useNavigation<any>();
  const [allTutors, setAllTutors] = useState<any[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || 'All');



  const fetchAllTutors = async () => {
    console.log('🔍 Fetching all tutors...');
    setLoading(true);
    
    try {
      const response = await getAllTutors();
      if (response?.success && response.data) {
        setAllTutors(response.data);
        
        // Apply initial filter immediately
        let filtered = response.data;
        if (selectedSubject !== 'All') {
          filtered = filtered.filter((tutor: any) => 
            tutor.subject?.name?.toLowerCase() === selectedSubject.toLowerCase()
          );
        }
        
        setFilteredTutors(filtered);
        console.log('✅ Found', response.data.length, 'tutors');
      } else {
        setAllTutors([]);
        setFilteredTutors([]);
      }
    } catch (error) {
      console.error('💥 Error fetching tutors:', error);
      setAllTutors([]);
      setFilteredTutors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await getAllSubjects();
      if (response?.success && response.data) {
        const subjectNames = response.data.map((subject: any) => subject.name);
        setSubjects(['All', ...subjectNames]);
        console.log('✅ Found', subjectNames.length, 'subjects');
      }
    } catch (error) {
      console.error('💥 Error fetching subjects:', error);
    }
  };

  const filterTutors = () => {
    let filtered = allTutors;

    // Filter by subject
    if (selectedSubject !== 'All') {
      filtered = filtered.filter((tutor: any) => 
        tutor.subject?.name?.toLowerCase() === selectedSubject.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((tutor: any) =>
        tutor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.subject?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTutors(filtered);
    console.log('🔍 Filtered to', filtered.length, 'tutors');
  };

  useEffect(() => {
    fetchAllTutors();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (initialSubject && initialSubject !== 'All') {
      setSelectedSubject(initialSubject);
    }
  }, [initialSubject]);

  useEffect(() => {
    const delayedFilter = setTimeout(() => {
      filterTutors();
    }, 300);

    return () => clearTimeout(delayedFilter);
  }, [searchQuery, selectedSubject, allTutors]);

  const handleTutorPress = (tutor: any) => {
    console.log('📚 Opening tutor details for:', tutor.name);
    navigation.navigate('TutorDetailPage', { tutor });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16423C" />
          <Text style={styles.loadingText}>Loading tutors...</Text>
        </View>
      );
    }
    
    if (filteredTutors.length > 0) {
      return (
        <ScrollView style={styles.tutorsList} showsVerticalScrollIndicator={false}>
          {filteredTutors.map((tutor) => (
            <View key={tutor.id} style={styles.tutorCardContainer}>
              <SubjectTutorCard
                tutor={{
                  id: tutor.id,
                  name: tutor.name,
                  subject: tutor.subject?.name || 'General',
                  rating: Number.parseFloat(tutor.averageRating) || 0,
                  sessions: `$${tutor.hourlyRate}/hr`,
                  totalRatings: tutor.totalRatings?.toString() || '0',
                  totalHours: '0',
                  groupTuition: true,
                  privateTuition: true,
                  image: tutor.profileImage,
                }}
                onPress={() => handleTutorPress(tutor)}
              />
            </View>
          ))}
        </ScrollView>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="person-search" size={48} color="#CCCCCC" />
        <Text style={styles.emptyText}>No tutors found</Text>
        <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Tutor</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#16423C" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tutors..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Subject Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.subjectContainer}
        contentContainerStyle={styles.subjectContent}
      >
        {subjects.map((subject) => (
          <TouchableOpacity
            key={subject}
            style={[
              styles.subjectButton,
              selectedSubject === subject && styles.selectedSubjectButton
            ]}
            onPress={() => setSelectedSubject(subject)}
          >
            <Text style={[
              styles.subjectText,
              selectedSubject === subject && styles.selectedSubjectText
            ]}>
              {subject}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tutors List */}
      <View style={styles.tutorsContainer}>
        <Text style={styles.tutorsTitle}>
          {loading ? 'Loading...' : `${filteredTutors.length} Tutors Found`}
        </Text>

        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16423C',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333333',
  },
  subjectContainer: {
    maxHeight: 50,
  },
  subjectContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  subjectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  selectedSubjectButton: {
    backgroundColor: '#16423C',
    borderColor: '#16423C',
  },
  subjectText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  selectedSubjectText: {
    color: '#FFFFFF',
  },
  tutorsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tutorsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16423C',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666666',
  },
  tutorsList: {
    flex: 1,
  },
  tutorCardContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginTop: 8,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
  },
});

export default AllTutors;