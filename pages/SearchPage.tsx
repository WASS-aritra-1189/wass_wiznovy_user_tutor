import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import TopSubjects from '../components/home/TopSubjects';
import TutorRecommendation from '../components/home/TutorRecommendation';
import AiChatBanner from '../components/home/AiChatBanner';
import PopularCourses from '../components/home/PopularCourses';
import Categories from '../components/home/Categories';
import FilterMenu from '../components/FilterMenu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { performGlobalSearch, getSearchSuggestions } from '../services/searchService';

interface SearchPageProps {
  navigation?: any;
}

const SearchPage: React.FC<SearchPageProps> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterSlideAnim] = useState(new Animated.Value(320));
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const insets = useSafeAreaInsets();

  // Debounced suggestions fetching
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchText.trim().length > 0) {
        fetchSuggestions(searchText.trim());
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchText]);

  const handleGlobalSearch = async (keyword: string) => {
    if (!keyword.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await performGlobalSearch(keyword);
      
      console.log('Search Result:', result);
      
      if (result.success) {
        const data = result.data || {};
        const allResults = [
          ...(data.tutors?.result || []).map((item: any) => ({ ...item, type: 'Tutor' })),
          ...(data.courses?.result || []).map((item: any) => ({ ...item, type: 'Course' })),
          ...(data.books?.result || []).map((item: any) => ({ ...item, type: 'Book' })),
          ...(data.subjects?.result || []).map((item: any) => ({ ...item, type: 'Subject' }))
        ];
        
        console.log('🔍 Search Debug - All Results:', allResults);
        console.log('🔍 Search Debug - Subjects:', data.subjects);
        setSearchResults(allResults);
      } else {
        console.error('Search failed:', result.message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async (keyword: string) => {
    if (keyword.trim().length > 0) {
      try {
        const response = await getSearchSuggestions(keyword.trim());
        if (response.success) {
          setSuggestions(response.data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    
    if (text.length > 0) {
      // Only fetch suggestions, don't trigger full search immediately
      fetchSuggestions(text);
    } else {
      setIsSearching(false);
      setSearchResults([]);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: any) => {
    const searchTerm = suggestion.name || suggestion.title;
    setSearchText(searchTerm);
    setShowSuggestions(false);
    setIsSearching(true);
    handleGlobalSearch(searchTerm);
  };

  const handleVoiceSearch = () => {
    if (isRecording) return;
    
    setIsRecording(true);
    console.log('Voice recording started');
    
    // Simulate voice recording with timeout
    const timeout = setTimeout(() => {
      setIsRecording(false);
      console.log('Voice recording stopped');
      
      // Simulate voice-to-text conversion
      const voiceQueries = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'];
      const randomQuery = voiceQueries[Math.floor(Math.random() * voiceQueries.length)];
      console.log('Voice query:', randomQuery);
      
      // Set the search text and trigger search
      setSearchText(randomQuery);
      handleSearch(randomQuery);
    }, 2000);
    
   
    return () => clearTimeout(timeout);
  };

  const openFilter = () => {
   
    if (!searchText.trim()) {
      alert('Please enter a search term first before applying filters');
      return;
    }
    
    setFilterVisible(true);
    filterSlideAnim.setValue(320);
    Animated.timing(filterSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const closeFilter = () => {
    Animated.timing(filterSlideAnim, {
      toValue: 320,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setFilterVisible(false);
    });
  };

  const mainContent = (() => {
    if (isRecording) {
      return (
        <View style={styles.recordingContainer}>
          <Text style={styles.recordingText}>🎤 Listening...</Text>
          <Text style={styles.recordingSubtext}>Speak now</Text>
        </View>
      );
    }

    if (isSearching && searchText.length > 0) {
      if (isLoading) {
        return (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchResultsTitle}>Search Results ({searchResults.length})</Text>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#16423C" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          </View>
        );
      }

      if (searchResults.length > 0) {
        return (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchResultsTitle}>Search Results ({searchResults.length})</Text>
            <View>
              {/* Tutors */}
              {searchResults.filter(r => r.type === 'Tutor').map((result) => (
                <TouchableOpacity 
                  key={`tutor-${result.id || result.name || Math.random()}`} 
                  style={styles.tutorCard}
                  onPress={() => {
                    // Use account.id if available, fallback to main id
                    const tutorId = result.account?.id || result.id;
                    navigation?.navigate('TutorDetailPage', { tutorId, tutor: result });
                  }}
                >
                  <View style={styles.tutorContent}>
                    <View style={styles.tutorImageContainer}>
                      <Image 
                        source={require('../assets/tutor.png')} 
                        style={styles.tutorImage}
                        resizeMode="cover"
                      />
                      <View style={styles.onlineDot} />
                    </View>
                    <View style={styles.tutorInfo}>
                      <Text style={styles.tutorName}>{result.name || 'Unknown Tutor'}</Text>
                      <Text style={styles.tutorSubject}>Specialized in: {result.subject?.name || 'General'}</Text>
                      <View style={styles.ratingSessionRow}>
                        <View style={styles.sessionContainer}>
                          <Image source={require('../assets/dollar.png')} style={styles.dollarIcon} />
                          <Text style={styles.sessionText}>${result.hourlyRate}/hr</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                          {(() => {
                            const rating = Number.parseFloat(result.averageRating || '0');
                            const displayRating = rating > 0 ? rating.toFixed(1) : '4.5';
                            return <Text style={styles.ratingText}>★{displayRating}</Text>;
                          })()}
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              
              {/* Courses in 2-column grid */}
              <View style={styles.coursesGrid}>
                {searchResults.filter(r => r.type === 'Course').map((result) => (
                  <TouchableOpacity key={`course-${result.id || result.name || Math.random()}`} style={styles.courseCard}>
                    <View style={styles.courseImageContainer}>
                      <Image 
                        source={require('../assets/courses.png')} 
                        style={styles.courseImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.courseInfo}>
                      <Text style={styles.courseTitle}>{result.name}</Text>
                      <Text style={styles.courseSubtitle}>{result.totalLectures} Lectures</Text>
                      <View style={styles.detailsRow}>
                        <View style={styles.detailItemContainer}>
                          <View style={styles.durationContainer}>
                            <Image source={require('../assets/clock.png')} style={styles.clockIcon} />
                            <Text style={styles.durationText}>{result.totalDuration}</Text>
                          </View>
                        </View>
                        <View style={styles.detailItemContainer}>
                          <View style={styles.priceContainer}>
                            <Image source={require('../assets/dollarforcourse.png')} style={styles.dollarCourseIcon} />
                            <Text style={styles.priceText}>${result.discountPrice || result.price}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.ratingRow}>
                        <View style={styles.ratingItemContainer}>
                          <View style={styles.courseRatingContainer}>
                            <Image source={require('../assets/imageforratingincoursecard.png')} style={styles.ratingIcon} />
                            {(() => {
                              const rating = Number.parseFloat(result.averageRating || '0');
                              const displayRating = rating > 0 ? rating.toFixed(1) : '4.5';
                              return <Text style={styles.courseRatingText}>{displayRating}</Text>;
                            })()}
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Books */}
              {searchResults.filter(r => r.type === 'Book').map((result) => (
                <TouchableOpacity key={`book-${result.id || result.name || result.title || Math.random()}`} style={styles.bookCard}>
                  <View style={styles.bookContent}>
                    <View style={styles.bookImageContainer}>
                      <Image 
                        source={require('../assets/book.png')} 
                        style={styles.bookImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.bookInfo}>
                      <Text style={styles.bookTitle}>{result.name || result.title || 'Unknown Book'}</Text>
                      <Text style={styles.bookSubtitle}>{result.author || 'Unknown Author'}</Text>
                      <Text style={styles.bookDescription}>{result.description || 'Book description'}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              
              {/* Subjects */}
              {searchResults.filter(r => r.type === 'Subject').map((result) => {
                console.log('🔍 Rendering Subject:', result);
                return (
                  <TouchableOpacity key={`subject-${result.id || Math.random()}`} style={styles.subjectCard}>
                    <View style={styles.subjectContent}>
                      <View style={styles.subjectIconContainer}>
                        <Image 
                          source={require('../assets/book.png')} 
                          style={styles.subjectIcon}
                          resizeMode="cover"
                        />
                      </View>
                      <View style={styles.subjectInfo}>
                        <Text style={styles.subjectTitle}>{result.name}</Text>
                        <Text style={styles.subjectStatus}>Status: {result.status}</Text>
                        <Text style={styles.subjectDate}>Created: {new Date(result.createdAt).toLocaleDateString()}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      }

      return (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.searchResultsTitle}>Search Results ({searchResults.length})</Text>
          <Text style={styles.noResultsText}>No results found for "{searchText}"</Text>
        </View>
      );
    }

    return (
      <>
        <TopSubjects />
        <TutorRecommendation />
        <AiChatBanner />
        <PopularCourses />
        <Categories />
      </>
    );
  })();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      {/* Filter Section */}
      <View style={[styles.filterSection, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.filterButton} onPress={openFilter}>
          <View style={styles.filterIcon}>
            <View style={[styles.filterLine, { width: '100%', alignSelf: 'center' }]} />
            <View style={[styles.filterLine, { width: '80%', alignSelf: 'center' }]} />
            <View style={[styles.filterLine, { width: '60%', alignSelf: 'center' }]} />
            <View style={[styles.filterLine, { width: '40%', alignSelf: 'center' }]} />
          </View>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchInputContainer}>
          <Image 
            source={require('../assets/search.png')} 
            style={styles.searchIconInput}
            resizeMode="contain"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses, tutors, subjects..."
            value={searchText}
            onChangeText={handleSearch}
            onSubmitEditing={() => {
              if (searchText.trim()) {
                setShowSuggestions(false);
                setIsSearching(true);
                handleGlobalSearch(searchText.trim());
              }
            }}
            returnKeyType="search"
            autoFocus={true}
          />
          <TouchableOpacity style={styles.voiceButton} onPress={handleVoiceSearch}>
            <Image 
              source={require('../assets/voice.png')} 
              style={[styles.voiceIcon, isRecording && styles.recordingIcon]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Suggestions Dropdown - Moved outside */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => `suggestion-${item.id}-${item.type}-${index}`}
            renderItem={({ item: suggestion }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionSelect(suggestion)}
              >
                <Image 
                  source={require('../assets/search.png')} 
                  style={styles.suggestionIcon}
                  resizeMode="contain"
                />
                <Text style={styles.suggestionText}>{suggestion.name || suggestion.title}</Text>
                {suggestion.type && <Text style={styles.suggestionType}>{suggestion.type}</Text>}
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
          />
        </View>
      )}

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mainContent}
        <View style={styles.spacer} />
      </ScrollView>
      
      <FilterMenu 
        visible={filterVisible}
        onClose={closeFilter}
        slideAnim={filterSlideAnim}
        onApplyFilters={(results) => {
          console.log('🔍 SearchPage - Received filtered results:', results);
          const data = results || {};
          const allResults = [
            ...(data.tutors?.result || []).map((item: any) => ({ ...item, type: 'Tutor' })),
            ...(data.courses?.result || []).map((item: any) => ({ ...item, type: 'Course' })),
            ...(data.books?.result || []).map((item: any) => ({ ...item, type: 'Book' })),
            ...(data.subjects?.result || []).map((item: any) => ({ ...item, type: 'Subject' }))
          ];
          setSearchResults(allResults);
          setIsSearching(true);
         
        }}
        searchKeyword={searchText} // ✅ This is the fix - pass the current search text
      />
    </View>
  );
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  filterSection: {
    backgroundColor: '#16423C',
    paddingHorizontal: 20,
    paddingBottom: 15,
    alignItems: 'flex-end',
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    zIndex: 1000,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2FFFA',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    borderWidth: 1,
    borderColor: '#16423C',
  },
  searchIconInput: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    height: '100%',
    textAlignVertical: 'center',
    paddingVertical: 0,
    margin: 0,
  },
  voiceButton: {
    padding: 4,
  },
  voiceIcon: {
    width: 18,
    height: 18,
  },
  recordingIcon: {
    tintColor: '#FF4444',
  },
  recordingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingText: {
    fontSize: 24,
    color: '#16423C',
    marginBottom: 10,
  },
  recordingSubtext: {
    fontSize: 16,
    color: '#666666',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minHeight: 30,
  },
  filterIcon: {
    width: 16,
    height: 12,
    justifyContent: 'space-between',
    marginRight: 6,
  },
  filterLine: {
    height: 2,
    backgroundColor: '#16423C',
    borderRadius: 1,
  },
  filterText: {
    fontSize: 14,
    color: '#16423C',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  searchResultsContainer: {
    padding: 20,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 15,
  },

  noResultsText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#16423C',
    marginTop: 10,
  },

  spacer: {
    height: 30,
  },
  tutorCard: {
    backgroundColor: '#F2FFFA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#888585ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    borderColor: '#E4E4E4',
    borderWidth: 1,
  },
  tutorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tutorImageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  tutorImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  onlineDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0AAD2D',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  tutorInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  tutorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 4,
  },
  tutorSubject: {
    fontSize: 12,
    color: '#01004C',
    marginBottom: 8,
  },
  ratingSessionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sessionContainer: {
    backgroundColor: '#E8F4F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 25,
    borderWidth: 0.41,
    borderColor: '#01004C',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dollarIcon: {
    width: 8,
    height: 8,
  },
  sessionText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#16423C',
  },
  ratingContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 25,
    borderWidth: 0.41,
    borderColor: '#01004C',
  },
  ratingText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#E6B301',
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D3CDCD',
    elevation: 4,
    shadowColor: '#c4c1c1ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    width: '48%',
  },
  courseImageContainer: {
    width: '100%',
    height: 100,
    padding: 8,
  },
  courseImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  courseInfo: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingRow: {
    alignItems: 'center',
  },
  detailItemContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#C4DAD2',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 25,
    borderColor: '#16423C',
    borderWidth: 0.41,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  clockIcon: {
    width: 10,
    height: 10,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16423C',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dollarCourseIcon: {
    width: 10,
    height: 10,
  },
  priceText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16423C',
  },
  ratingItemContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  courseRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  courseRatingText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000000',
  },
  ratingIcon: {
    width: 10,
    height: 10,
  },
  bookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#888585ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    borderColor: '#E4E4E4',
    borderWidth: 1,
  },
  bookContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookImageContainer: {
    marginRight: 12,
  },
  bookImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 4,
  },
  bookSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  bookDescription: {
    fontSize: 12,
    color: '#666',
  },
  subjectCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  subjectContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectIconContainer: {
    marginRight: 12,
    backgroundColor: '#16423C',
    borderRadius: 25,
    padding: 8,
  },
  subjectIcon: {
    width: 30,
    height: 30,
    tintColor: '#FFFFFF',
  },
  subjectInfo: {
    flex: 1,
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 4,
  },
  subjectStatus: {
    fontSize: 12,
    color: '#28A745',
    marginBottom: 2,
  },
  subjectDate: {
    fontSize: 12,
    color: '#666',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 155,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    height: 200,
    zIndex: 1001,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionIcon: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  suggestionType: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default SearchPage;