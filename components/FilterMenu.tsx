import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  PanResponder,
} from 'react-native';
import { getSubjectCounts, getTutorCountsByCountry, getExpertiseCounts, getRatingCounts, performFilteredSearch } from '../services/searchService';

interface FilterMenuProps {
  visible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
  onApplyFilters?: (results: any) => void;
  searchKeyword?: string;
}

interface Subject {
  subjectId: string;
  subjectName: string;
  totalCount: number;
}

interface Country {
  countryId: string;
  countryName: string;
  tutorCount: number;
}

interface ExpertiseLevel {
  level: string;
  count: number;
}

interface RatingDistribution {
  rating: number;
  count: number;
}

interface RatingData {
  averageRating: number;
  totalRatings: number;
  distribution: RatingDistribution[];
}

const FilterMenu: React.FC<FilterMenuProps> = ({ 
  visible, 
  onClose, 
  slideAnim, 
  onApplyFilters,
  searchKeyword = ''
}) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [minSliderPosition, setMinSliderPosition] = useState(0);
  const [maxSliderPosition, setMaxSliderPosition] = useState(204);
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: boolean}>({});
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [expertiseLevels, setExpertiseLevels] = useState<ExpertiseLevel[]>([]);
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const trackWidth = 230;
  const thumbWidth = 12;

  const toggleFilter = (filterKey: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const handleMinSliderMove = (position: number) => {
    const clampedPosition = Math.max(0, Math.min(position, maxSliderPosition - 20));
    setMinSliderPosition(clampedPosition);
    setMinPrice(Math.round((clampedPosition / (trackWidth - thumbWidth)) * 500));
  };

  const handleMaxSliderMove = (position: number) => {
    const clampedPosition = Math.max(minSliderPosition + 20, Math.min(position, trackWidth - thumbWidth));
    setMaxSliderPosition(clampedPosition);
    setMaxPrice(Math.round((clampedPosition / (trackWidth - thumbWidth)) * 500));
  };

  const minPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newPosition = minSliderPosition + gestureState.dx;
        handleMinSliderMove(newPosition);
      },
    })
  ).current;

  const maxPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newPosition = maxSliderPosition + gestureState.dx;
        handleMaxSliderMove(newPosition);
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      fetchSubjects();
      fetchCountries();
      fetchExpertiseLevels();
      fetchRatingData();
    }
  }, [visible]);

  const fetchSubjects = async () => {
    try {
      const result = await getSubjectCounts();
      if (result.success && result.data) {
        setSubjects(result.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const result = await getTutorCountsByCountry();
      if (result.success && result.data) {
        setCountries(result.data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchExpertiseLevels = async () => {
    try {
      const result = await getExpertiseCounts();
      if (result.success && result.data) {
        setExpertiseLevels(result.data);
      }
    } catch (error) {
      console.error('Error fetching expertise levels:', error);
    }
  };

  const fetchRatingData = async () => {
    try {
      const result = await getRatingCounts();
      if (result.success && result.data) {
        setRatingData(result.data);
      }
    } catch (error) {
      console.error('Error fetching rating data:', error);
    }
  };

  const handleApplyFilters = async () => {
    console.log('🔍 Apply Filters - Selected Filters:', selectedFilters);
    console.log('🔍 Search Keyword:', searchKeyword);
    
    try {
      // Extract selected filters as arrays
      const selectedCountries = countries
        .filter(country => selectedFilters[country.countryId])
        .map(country => country.countryId);
      
      const selectedSubjects = subjects
        .filter(subject => selectedFilters[subject.subjectId])
        .map(subject => subject.subjectId);
      
      const selectedExpertise = expertiseLevels
        .filter(expertise => selectedFilters[expertise.level])
        .map(expertise => expertise.level);
      
      const selectedRatings = ratingData?.distribution
        .filter(rating => selectedFilters[`${rating.rating}stars`])
        .map(rating => rating.rating) || [];
      
      // Build filter object according to API expectations
      const filters: any = {};
      
      // Add keyword from search input
      if (searchKeyword && searchKeyword.trim() !== '') {
        filters.keyword = searchKeyword.trim();
      } else {
        console.warn('No search keyword available for filtering');
        // You might want to show an alert to the user here
        return;
      }
      
      // Add arrays for each filter type with correct parameter names
      if (selectedCountries.length > 0) {
        filters.countries = selectedCountries;
      }
      
      if (selectedSubjects.length > 0) {
        filters.subjects = selectedSubjects;
      }
      
      if (selectedExpertise.length > 0) {
        filters.expertiseLevels = selectedExpertise;
      }
      
      if (selectedRatings.length > 0) {
        filters.ratings = selectedRatings;
      }
      
      if (minPrice > 0) {
        filters.minPrice = minPrice;
      }
      
      if (maxPrice < 500) {
        filters.maxPrice = maxPrice;
      }
      
      console.log('🔍 Apply Filters - Final Filters:', filters);
      
      const result = await performFilteredSearch(filters);
      if (result.success) {
        console.log('🔍 Apply Filters - Success. Results count:', result.data?.length || 0);
        onApplyFilters?.(result.data);
        onClose();
      } else {
        console.error('🔍 Apply Filters - Failed:', result.message);
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('🔍 Apply Filters - Error:', error);
    }
  };

  const handleResetFilters = () => {
    console.log('🔍 Reset Filters');
    setSelectedFilters({});
    setMinPrice(0);
    setMaxPrice(500);
    setMinSliderPosition(0);
    setMaxSliderPosition(204);
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      statusBarTranslucent={true}
    >
      <View style={styles.filterModalOverlay}>
        <TouchableOpacity 
          style={styles.filterModalBackground}
          onPress={onClose}
          activeOpacity={1}
        />
        <Animated.View style={[styles.filterMenuContainer, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterHeaderTitle}>Apply Filter Now</Text>
            <TouchableOpacity onPress={onClose} style={styles.filterCloseButton}>
              <Text style={styles.filterCloseText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.filterContent} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {/* Price Range */}
            <View style={styles.filterSection}>
              <View style={styles.priceRangeContainer}>
                <Text style={styles.priceRangeTitleInside}>Price Range</Text>
                
                <View style={styles.sliderContainer}>
                  <View style={styles.sliderTrack} />
                  <View style={[styles.sliderRange, {
                    left: minSliderPosition,
                    width: maxSliderPosition - minSliderPosition + thumbWidth
                  }]} />
                  
                  <View
                    {...minPanResponder.panHandlers}
                    style={[styles.sliderThumb, { left: minSliderPosition }]}
                  />
                  
                  <View
                    {...maxPanResponder.panHandlers}
                    style={[styles.sliderThumb, { left: maxSliderPosition }]}
                  />
                  
                  <View style={[styles.priceButton, { left: minSliderPosition - 8 }]}>
                    <Text style={styles.priceButtonText}>${minPrice}</Text>
                  </View>
                  
                  <View style={[styles.priceButton, { left: maxSliderPosition - 8 }]}>
                    <Text style={styles.priceButtonText}>${maxPrice}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Expertise Level */}
            <View style={styles.filterSection}>
              <View style={styles.filterOptions}>
                <TouchableOpacity style={styles.filterSectionHeader}>
                  <Text style={styles.filterSectionTitle}>Expertise Level</Text>
                </TouchableOpacity>
                {expertiseLevels.map((expertise) => (
                  <TouchableOpacity 
                    key={expertise.level} 
                    style={styles.filterOption} 
                    onPress={() => toggleFilter(expertise.level)}
                  >
                    <View style={[styles.checkbox, selectedFilters[expertise.level] && styles.checkboxChecked]} />
                    <Text style={styles.filterOptionText}>{expertise.level.replace('_', ' ')}</Text>
                    <Text style={styles.filterCount}>{expertise.count}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Rating and Review */}
            <View style={styles.filterSection}>
              <View style={styles.filterOptions}>
                <TouchableOpacity style={styles.filterSectionHeader}>
                  <Text style={styles.filterSectionTitle}>Rating and Review</Text>
                </TouchableOpacity>
                {ratingData?.distribution.filter(item => item.count > 0).reverse().map((rating) => (
                  <TouchableOpacity 
                    key={rating.rating} 
                    style={styles.filterOption} 
                    onPress={() => toggleFilter(`${rating.rating}stars`)}
                  >
                    <View style={[styles.checkbox, selectedFilters[`${rating.rating}stars`] && styles.checkboxChecked]} />
                    <Text style={styles.filterOptionText}>{rating.rating} Stars</Text>
                    <Text style={styles.filterCount}>{rating.count}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Subjects */}
            <View style={styles.filterSection}>
              <View style={styles.filterOptions}>
                <TouchableOpacity style={styles.filterSectionHeader}>
                  <Text style={styles.filterSectionTitle}>Subjects</Text>
                </TouchableOpacity>
                {subjects.map((subject) => (
                  <TouchableOpacity 
                    key={subject.subjectId} 
                    style={styles.filterOption} 
                    onPress={() => toggleFilter(subject.subjectId)}
                  >
                    <View style={[styles.checkbox, selectedFilters[subject.subjectId] && styles.checkboxChecked]} />
                    <Text style={styles.filterOptionText}>{subject.subjectName}</Text>
                    <Text style={styles.filterCount}>{subject.totalCount}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Country */}
            <View style={styles.filterSection}>
              <View style={styles.filterOptions}>
                <TouchableOpacity style={styles.filterSectionHeader}>
                  <Text style={styles.filterSectionTitle}>Country</Text>
                </TouchableOpacity>
                {countries.map((country) => (
                  <TouchableOpacity 
                    key={country.countryId} 
                    style={styles.filterOption} 
                    onPress={() => toggleFilter(country.countryId)}
                  >
                    <View style={[styles.checkbox, selectedFilters[country.countryId] && styles.checkboxChecked]} />
                    <Text style={styles.filterOptionText}>{country.countryName}</Text>
                    <Text style={styles.filterCount}>{country.tutorCount}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          {/* Filter Buttons */}
          <View style={styles.filterButtons}>
            <TouchableOpacity style={styles.resetButton} onPress={handleResetFilters}>
              <Text style={styles.resetButtonText}>Reset Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterModalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '20%',
  },
  filterMenuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '80%',
    maxWidth: 320,
    backgroundColor: '#C4DAD2',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: 'hidden',
  },
  filterHeader: {
    backgroundColor: '#C4DAD2',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterHeaderTitle: {
    color: '#16423c',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterCloseButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCloseText: {
    color: '#0c0000ff',
    fontSize: 30,
    fontWeight: '200',
  },
  filterContent: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 30,
  },
  filterSection: {
    marginBottom: 15,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 0,
  },
  filterOptions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  filterOption: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 8,
    flex: 1,
  },
  filterCount: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  filterButtons: {
    flexDirection: 'column',
    padding: 20,
    paddingBottom: 50,
    gap: 15,
    backgroundColor: '#C4DAD2',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  resetButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#16423C',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  priceRangeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  priceRangeTitleInside: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 15,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  sliderTrack: {
    height: 11,
    backgroundColor: '#E0E0E0',
    borderRadius: 19,
    width: 230,
    position: 'absolute',
    top: 14.5,
    opacity: 0.4,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  sliderRange: {
    position: 'absolute',
    height: 11,
    backgroundColor: '#16423C',
    borderRadius: 19,
    top: 14.5,
  },
  sliderThumb: {
    position: 'absolute',
    width: 12,
    height: 11,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#16423C',
    top: 14.5,
    opacity: 1,
    zIndex: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  priceButton: {
    position: 'absolute',
    width: 40,
    height: 22,
    backgroundColor: '#16423C',
    borderRadius: 8,
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceButtonText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  filterSectionHeader: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#C4DAD2',
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#16423C',
  },
});

export default FilterMenu;