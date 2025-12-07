import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, StatusBar, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import BookCard from './BookCard';

const { width } = Dimensions.get('window');

interface OpenLibraryProps {
  navigation?: any;
}

const OpenLibrary: React.FC<OpenLibraryProps> = ({ navigation }) => {
  const imageScrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const insets = useSafeAreaInsets();
  
  const images = [
    require('../assets/openlibrary.png'),
    require('../assets/openlibrary.png'),
    require('../assets/openlibrary.png'),
    require('../assets/openlibrary.png'),
  ];
  
  const imageWidth = 388;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        imageScrollRef.current?.scrollTo({
          x: nextIndex * imageWidth,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [imageWidth, images.length]);
  const books = [
    {
      id: 1,
      title: "The Adventure",
      author: "John Smith",
      description: "An exciting journey through unknown lands filled with mystery and wonder."
    },
    {
      id: 2,
      title: "Science Myster",
      author: "Jane Doe",
      description: "Exploring the fascinating world of scientific discoveries and innovations."
    },
    {
      id: 3,
      title: "History Tales",
      author: "Mike Johnson",
      description: "Stories from the past that shaped our present and future."
    },
    {
      id: 4,
      title: "Art & Culture",
      author: "Sarah Wilson",
      description: "A deep dive into the world of art, culture, and human creativity."
    },
    {
      id: 5,
      title: "Digital World",
      author: "Alex Brown",
      description: "Understanding technology and its impact on modern society."
    },
    {
      id: 6,
      title: "Nature Wonder",
      author: "Emma Green",
      description: "Exploring the beauty and mysteries of the natural world."
    },
    {
      id: 7,
      title: "Space Explore",
      author: "David Lee",
      description: "Journey through the cosmos and discover the universe's secrets."
    },
    {
      id: 8,
      title: "Creative Writing",
      author: "Lisa White",
      description: "Master the art of storytelling and creative expression."
    },
  ];

  const filteredBooks = books.filter(book => {
    if (!searchText.trim()) return true;
    
    const searchLower = searchText.toLowerCase().trim();
    const titleWords = book.title.toLowerCase().split(' ');
    const authorWords = book.author.toLowerCase().split(' ');
    const descriptionWords = book.description.toLowerCase().split(' ');
    
    return titleWords.some(word => word.startsWith(searchLower)) ||
           authorWords.some(word => word.startsWith(searchLower)) ||
           descriptionWords.some(word => word.startsWith(searchLower)) ||
           book.title.toLowerCase().includes(searchLower) ||
           book.author.toLowerCase().includes(searchLower);
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      {/* Header with back button and search */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Open Library</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
        
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#999999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Enter the book | Notes| Paper name"
            placeholderTextColor="#999999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.bannerContainer}>
          <ScrollView
            ref={imageScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageScrollView}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / imageWidth);
              setCurrentIndex(newIndex);
            }}
          >
            {images.map((image, index) => (
              <Image 
                key={index}
                source={image}
                style={styles.libraryImage} 
                resizeMode="cover" 
              />
            ))}
          </ScrollView>
          
          <View style={styles.paginationOverlay}>
            <View style={styles.paginationContainer}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    currentIndex === index && styles.paginationDotActive
                  ]}
                />
              ))}
            </View>
          </View>
        </View>
        
        <FlatList
          data={filteredBooks}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BookCard
              title={item.title}
              author={item.author}
              description={item.description}
              onPress={() => navigation?.navigate('BookDetail', { book: item })}
            />
          )}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  headerPlaceholder: {
    width: 24,
  },
  searchBar: {
    width: 388,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    marginTop: 15,
    marginLeft: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    height: 48,
    textAlignVertical: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  bannerContainer: {
    paddingHorizontal: 25,
    marginBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  imageScrollView: {
    height: 160,
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
    width: 67,
    height: 20,
    borderRadius: 13.5,
    borderWidth: 0.41,
    borderColor: '#01004C',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#01004C',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#01004C',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#01004C',
  },
  libraryImage: {
    width: 388,
    height: 160,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  gridContent: {
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'flex-start',
    gap: 14,
    marginBottom: 16,
  },
});

export default OpenLibrary;