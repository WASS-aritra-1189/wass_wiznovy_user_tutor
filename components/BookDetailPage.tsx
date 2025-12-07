import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import BookCard from './BookCard';

const { width } = Dimensions.get('window');

const ItemSeparator: React.FC = () => <View style={{ height: 16 }} />;

interface BookDetailPageProps {
  route?: any;
  navigation?: any;
  bookData?: any;
}

const BookDetailPage: React.FC<BookDetailPageProps> = ({ route, navigation, bookData }) => {
  const book = route?.params?.book || bookData;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  
  const imageWidth = width - 40;

  const bannerImages = [
    require('../assets/bookmainimage.png'),
    require('../assets/bookmainimage.png'),
    require('../assets/bookmainimage.png'),
    require('../assets/bookmainimage.png'),
    require('../assets/bookmainimage.png'),
    require('../assets/bookmainimage.png'),
   

  ];

  const categories = ['Fiction', 'Romance', 'Drama', 'Adventure'];
  const relatedBooks = [
    { id: 1, title: 'Mystery Novel', author: 'Jane Smith', description: 'A thrilling mystery that keeps you guessing until the end.' },
    { id: 2, title: 'Adventure Story', author: 'John Doe', description: 'An epic adventure across unknown territories.' },
    { id: 3, title: 'Romance Tale', author: 'Emily Brown', description: 'A heartwarming love story set in modern times.' },
    { id: 4, title: 'Sci-Fi Journey', author: 'Mike Wilson', description: 'Explore the future with advanced technology and space travel.' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % bannerImages.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * imageWidth,
          animated: true,
        });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [imageWidth]);

  const renderBookCard = ({ item }: { item: any }) => (
    <BookCard
      title={item.title}
      author={item.author}
      description={item.description}
      onPress={() => navigation?.navigate('BookDetail', { book: item })}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>{book?.title || 'Book Details'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.bannerContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.bannerScrollView}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / imageWidth);
            setCurrentIndex(newIndex);
          }}
        >
          {bannerImages.map((image, index) => (
            <Image 
              key={`banner-image-${index}`} 
              source={image} 
              style={[styles.bannerImage, { width: imageWidth }]} 
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        
        <View style={styles.paginationOverlay}>
          <View style={styles.paginationContainer}>
            {bannerImages.map((_, index) => (
              <View
                key={`pagination-dot-${index}`}
                style={[
                  styles.paginationDot,
                  currentIndex === index && styles.paginationDotActive
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.categoryContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity key={`category-${category}-${index}`} style={styles.categoryButton}>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.authorSection}>
        <TouchableOpacity style={styles.authorButton}>
          <View style={styles.authorImageContainer}>
            <Image source={require('../assets/bookmainimage.png')} style={styles.authorImage} />
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{book?.author || 'Author Name'}</Text>
            <Text style={styles.totalBooks}>12 Books</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.downloadButton}>
          <MaterialIcons name="download" size={20} color="#01004C" />
          <View style={styles.downloadInfo}>
            <Text style={styles.downloadText}>Download</Text>
            <Text style={styles.downloadCount}>1.2k Downloads</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>About the Book</Text>
        <Text style={styles.aboutText}>
          {book?.description || 'This is a detailed description about the book. It contains information about the plot, characters, and what makes this book special. The description can be longer and provide more insights into the story.'}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Image source={require('../assets/view.png')} style={styles.actionIcon} />
          <Text style={styles.actionText}>View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Image source={require('../assets/pages.png')} style={styles.actionIcon} />
          <Text style={styles.actionText}>Pages</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Image source={require('../assets/like.png')} style={styles.actionIcon} />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Image source={require('../assets/saved.png')} style={styles.actionIcon} />
          <Text style={styles.actionText}>Saved</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.relatedTitle}>Related Books</Text>
      <FlatList
        data={relatedBooks}
        renderItem={renderBookCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.bookRow}
        scrollEnabled={false}
        contentContainerStyle={styles.relatedBooksContainer}
        ItemSeparatorComponent={ItemSeparator}
      />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#16423C',
    borderRadius: 18,
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
  content: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 50,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginVertical: 25,
    alignItems: 'center',
    position: 'relative',
  },
  bannerScrollView: {
    height: 251,
  },
  bannerImage: {
    width: '100%',
    height: 251,
    borderRadius: 12,
    marginRight: 0,
    backgroundColor: '#f0f0f0',
  },
  paginationOverlay: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    minWidth: 50,
    height: 18,
    borderRadius: 13.5,
    borderWidth: 0.41,
    borderColor: '#01004C',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 8,
  },
  paginationDot: {
    width: 5.48,
    height: 5.48,
    borderRadius: 2.74,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#01004C',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#01004C',
    width: 5.48,
    height: 5.48,
    borderRadius: 2.74,
    borderWidth: 1,
    borderColor: '#01004C',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 25,
    paddingTop: 20,
    gap: 10,
  },
  categoryButton: {
    width: 83,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#333',
  },
  authorSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  authorButton: {
    width: 193,
    height: 55,
    borderRadius: 6,
    paddingTop: 6,
    paddingRight: 52,
    paddingBottom: 3,
    paddingLeft: 11,
    gap: 5,
    backgroundColor: '#01004C',
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  totalBooks: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  downloadButton: {
    width: 189,
    height: 55,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#000000',
    paddingTop: 6,
    paddingRight: 52,
    paddingBottom: 3,
    paddingLeft: 11,
    gap: 5,
    backgroundColor: '#ffffffff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadInfo: {
    flex: 1,
  },
  downloadText: {
    color: '#01004C',
    marginLeft: 5,
    fontWeight: '700',
    fontSize: 16,
  },
  downloadCount: {
    color: '#01004C',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
    marginLeft: 5,
  },
  aboutCard: {
    width: 388,
    minHeight: 237,
    marginTop: 20,
    marginLeft: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    paddingTop: 12,
    paddingRight: 52,
    paddingBottom: 3,
    paddingLeft: 23,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  actionButton: {
    width: 87,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#B9B9B9',
    backgroundColor: '#F7F8F9',
    paddingTop: 6,
    paddingRight: 8,
    paddingBottom: 6,
    paddingLeft: 8,
    flexDirection: 'row',
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
    marginTop: -2,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 15,
  },
  bookRow: {
    justifyContent: 'flex-start',
    gap: 14,
    paddingHorizontal: 25,
  },
  relatedBooksContainer: {
    paddingBottom: 20,
  },
});

export default BookDetailPage;