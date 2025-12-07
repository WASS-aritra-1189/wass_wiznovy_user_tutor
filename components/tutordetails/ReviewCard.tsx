import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface ReviewCardProps {
  userName?: string;
  userImage?: any;
  reviewText?: string;
  starRating?: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ 
  userName = "User Name",
  userImage,
  reviewText = "Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.",
  starRating = 5
}) => {
  const renderStars = () => {
    return Array.from({ length: starRating }, (_, index) => (
      <Text key={index} style={styles.star}>★</Text>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.userHeader}>
        <Image 
          source={userImage || require('../../assets/tutor.png')} 
          style={styles.userImage}
          resizeMode="cover"
        />
        <Text style={styles.userName}>{userName}</Text>
      </View>
      
      <Text style={styles.reviewText} numberOfLines={4}>
        {reviewText}
      </Text>
      
      <View style={styles.starContainer}>
        {renderStars()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160, // Fixed width instead of percentage
    height: 160,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#FFFFFF',
    padding: 8,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    flex: 1,
  },
  reviewText: {
    fontSize: 12,
    color: '#01004C',
    // lineHeight: 10,
    marginBottom: 0,
    flex: 1,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 10,
    color: '#0a0900ff',
    marginRight: 1,
  },
});

export default ReviewCard;