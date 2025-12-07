import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ReviewCard from './ReviewCard';


interface Review {
  id: string;
  userName: string;
  userImage?: any;
  reviewText: string;
  starRating: number;
}

interface ReviewSectionProps {
  title?: string;
  reviews?: Review[];
}

const CARD_WIDTH = 80;
const CARD_GAP = 10;

const ReviewSection: React.FC<ReviewSectionProps> = ({ 
  title = "Reviews",
  reviews = [
    {
      id: '1',
      userName: 'John Doe',
      reviewText: 'Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.',
      starRating: 5
    },
    {
      id: '2',
      userName: 'Jane Smith',
      reviewText: 'Great experience with detailed explanations and comprehensive learning materials.',
      starRating: 4
    },
    {
      id: '3',
      userName: 'Mike Johnson',
      reviewText: 'Excellent teaching methods and very patient instructor. Highly recommended.',
      starRating: 5
    },
    {
      id: '4',
      userName: 'Sarah Wilson',
      reviewText: 'Good content but could use more interactive examples for better understanding.',
      starRating: 4
    },
    {
      id: '5',
      userName: 'David Brown',
      reviewText: 'Outstanding quality and very helpful for exam preparation. Worth every penny.',
      starRating: 5
    }
  ]
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  

  const handleContainerLayout = useCallback((event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

 

  // Calculate total content width
  const totalContentWidth = (CARD_WIDTH + CARD_GAP) * reviews.length - CARD_GAP;
  const canScroll = totalContentWidth > containerWidth;

  return (
    <View style={styles.container} onLayout={handleContainerLayout}>
      <Text style={styles.title}>{title}</Text>
      
      {/* Calendar Toggle Button */}
      {/* <TouchableOpacity 
        style={styles.calendarToggle}
        onPress={() => setShowCalendar(!showCalendar)}
      >
        <Text style={styles.calendarToggleText}>
          {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
        </Text>
      </TouchableOpacity> */}

      {/* Calendar Section */}
      {/* {showCalendar && (
        // <View style={styles.calendarSection}>
        //   <Calendar onDateSelect={handleDateSelect} />
        // </View>
      )} */}

      {/* Reviews Section */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={canScroll}
        scrollEnabled={canScroll}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.reviewsContainer,
          !canScroll && styles.centeredReviews
        ]}
      >
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            userName={review.userName}
            userImage={review.userImage}
            reviewText={review.reviewText}
            starRating={review.starRating}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 388,
    minHeight: 240,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 12,
  },
  calendarToggle: {
    backgroundColor: '#16423C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  calendarToggleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  calendarSection: {
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  reviewsContainer: {
    flexDirection: 'row',
    gap: CARD_GAP,
    alignItems: 'flex-start',
  },
  centeredReviews: {
    justifyContent: 'center',
  },
});

export default ReviewSection;