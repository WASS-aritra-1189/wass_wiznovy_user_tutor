import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  PixelRatio,
} from 'react-native';

interface CategoriesProps {
  navigation?: any;
}

const Categories: React.FC<CategoriesProps> = ({ navigation }) => {
  const fontScale = PixelRatio.getFontScale();

  const getResponsiveFontSize = (baseSize: number) => {
    if (fontScale >= 2) return Math.max(baseSize * 0.5, 11);
    if (fontScale >= 1.6) return Math.max(baseSize * 0.65, 12);
    if (fontScale >= 1.3) return Math.max(baseSize * 0.8, 13);
    if (fontScale <= 0.85) return Math.min(baseSize * 1.2, baseSize + 4);
    if (fontScale <= 0.9) return Math.min(baseSize * 1.1, baseSize + 2);
    return baseSize;
  };
  return (
    <View style={[styles.categoriesContainer, {
      paddingVertical: (() => {
        if (fontScale >= 1.6) return 25;
        if (fontScale >= 1.3) return 22;
        return 20;
      })(),
      marginBottom: (() => {
        if (fontScale >= 1.6) return 25;
        if (fontScale >= 1.3) return 22;
        return 20;
      })(),
    }]}>
      <View style={[styles.categoriesHeader, {
        marginBottom: (() => {
          if (fontScale >= 1.6) return 20;
          if (fontScale >= 1.3) return 18;
          return 15;
        })(),
      }]}>
        <Text style={[styles.categoriesTitle, {
          fontSize: getResponsiveFontSize(18),
        }]}
        numberOfLines={fontScale >= 1.6 ? 2 : 1}
        >Categories</Text>
        <TouchableOpacity>
          <Text style={[styles.viewAllButton, {
            fontSize: getResponsiveFontSize(15),
          }]}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesGrid}>
        <TouchableOpacity 
          style={[styles.categoryItem, {
            width: (() => {
              if (fontScale >= 2) return 90;
              if (fontScale >= 1.6) return 85;
              if (fontScale >= 1.3) return 82;
              return 80;
            })(),
            marginRight: (() => {
              if (fontScale >= 1.6) return 25;
              if (fontScale >= 1.3) return 22;
              return 20;
            })(),
          }]}
          activeOpacity={0.7}
          onPress={() => {
            navigation?.navigate('CategorySubjects');
          }}
        >
          <View style={[styles.categoryIconContainer, {
            width: (() => {
              if (fontScale >= 2) return 90;
              if (fontScale >= 1.6) return 85;
              if (fontScale >= 1.3) return 82;
              return 80;
            })(),
            height: (() => {
              if (fontScale >= 2) return 90;
              if (fontScale >= 1.6) return 85;
              if (fontScale >= 1.3) return 82;
              return 80;
            })(),
            borderRadius: (() => {
              if (fontScale >= 2) return 45;
              if (fontScale >= 1.6) return 42.5;
              if (fontScale >= 1.3) return 41;
              return 40;
            })(),
            marginBottom: (() => {
              if (fontScale >= 1.6) return 12;
              if (fontScale >= 1.3) return 10;
              return 8;
            })(),
          }]}>
            <Image 
              source={require('../../assets/subjects.png')} 
              style={[styles.categoryIcon, {
                width: (() => {
                  if (fontScale >= 2) return 40;
                  if (fontScale >= 1.6) return 45;
                  if (fontScale >= 1.3) return 47;
                  return 50;
                })(),
                height: (() => {
                  if (fontScale >= 2) return 40;
                  if (fontScale >= 1.6) return 45;
                  if (fontScale >= 1.3) return 47;
                  return 50;
                })(),
              }]}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.categoryText, {
            fontSize: getResponsiveFontSize(11),
            minHeight: (() => {
              if (fontScale >= 1.6) return 44;
              if (fontScale >= 1.3) return 36;
              return 'auto';
            })(),
            lineHeight: (() => {
              if (fontScale >= 1.6) return 22;
              if (fontScale >= 1.3) return 18;
              return undefined;
            })(),
          }]}
          numberOfLines={fontScale >= 1.6 ? 2 : 1}
          >Subjects</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.categoryItem, {
          width: fontScale >= 2 ? 90 : fontScale >= 1.6 ? 85 : fontScale >= 1.3 ? 82 : 80,
          marginRight: fontScale >= 1.6 ? 25 : fontScale >= 1.3 ? 22 : 20,
        }]} activeOpacity={0.7}>
          <View style={[styles.categoryIconContainer, {
            width: fontScale >= 2 ? 90 : fontScale >= 1.6 ? 85 : fontScale >= 1.3 ? 82 : 80,
            height: fontScale >= 2 ? 90 : fontScale >= 1.6 ? 85 : fontScale >= 1.3 ? 82 : 80,
            borderRadius: fontScale >= 2 ? 45 : fontScale >= 1.6 ? 42.5 : fontScale >= 1.3 ? 41 : 40,
            marginBottom: fontScale >= 1.6 ? 12 : fontScale >= 1.3 ? 10 : 8,
          }]}>
            <Image 
              source={require('../../assets/Daily Task.png')} 
              style={[styles.categoryIcon, {
                width: fontScale >= 2 ? 40 : fontScale >= 1.6 ? 45 : fontScale >= 1.3 ? 47 : 50,
                height: fontScale >= 2 ? 40 : fontScale >= 1.6 ? 45 : fontScale >= 1.3 ? 47 : 50,
              }]}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.categoryText, {
            fontSize: getResponsiveFontSize(11),
            minHeight: fontScale >= 1.6 ? 44 : fontScale >= 1.3 ? 36 : 'auto',
            lineHeight: fontScale >= 1.6 ? 22 : fontScale >= 1.3 ? 18 : undefined,
          }]}
          numberOfLines={fontScale >= 1.6 ? 2 : 1}
          >Daily Task</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.categoryItem, {
            width: fontScale >= 2 ? 90 : fontScale >= 1.6 ? 85 : fontScale >= 1.3 ? 82 : 80,
            marginRight: fontScale >= 1.6 ? 25 : fontScale >= 1.3 ? 22 : 20,
          }]} 
          activeOpacity={0.7}
          onPress={() => navigation?.navigate('Help')}
        >
          <View style={[styles.categoryIconContainer, {
            width: fontScale >= 2 ? 90 : fontScale >= 1.6 ? 85 : fontScale >= 1.3 ? 82 : 80,
            height: fontScale >= 2 ? 90 : fontScale >= 1.6 ? 85 : fontScale >= 1.3 ? 82 : 80,
            borderRadius: fontScale >= 2 ? 45 : fontScale >= 1.6 ? 42.5 : fontScale >= 1.3 ? 41 : 40,
            marginBottom: fontScale >= 1.6 ? 12 : fontScale >= 1.3 ? 10 : 8,
          }]}>
            <Image 
              source={require('../../assets/help.png')} 
              style={[styles.categoryIcon, {
                width: fontScale >= 2 ? 40 : fontScale >= 1.6 ? 45 : fontScale >= 1.3 ? 47 : 50,
                height: fontScale >= 2 ? 40 : fontScale >= 1.6 ? 45 : fontScale >= 1.3 ? 47 : 50,
              }]}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.categoryText, {
            fontSize: getResponsiveFontSize(11),
            minHeight: fontScale >= 1.6 ? 44 : fontScale >= 1.3 ? 36 : 'auto',
            lineHeight: fontScale >= 1.6 ? 22 : fontScale >= 1.3 ? 18 : undefined,
          }]}
          numberOfLines={fontScale >= 1.6 ? 2 : 1}
          >Help</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.categoryItem, {
          width: fontScale >= 2 ? 90 : fontScale >= 1.6 ? 85 : fontScale >= 1.3 ? 82 : 80,
          marginRight: fontScale >= 1.6 ? 25 : fontScale >= 1.3 ? 22 : 20,
        }]} activeOpacity={0.7}>
          <View style={[styles.categoryIconContainer, {
            width: fontScale >= 2 ? 90 : fontScale >= 1.6 ? 85 : fontScale >= 1.3 ? 82 : 80,
            height: fontScale >= 2 ? 90 : fontScale >= 1.6 ? 85 : fontScale >= 1.3 ? 82 : 80,
            borderRadius: fontScale >= 2 ? 45 : fontScale >= 1.6 ? 42.5 : fontScale >= 1.3 ? 41 : 40,
            marginBottom: fontScale >= 1.6 ? 12 : fontScale >= 1.3 ? 10 : 8,
          }]}>
            <Image 
              source={require('../../assets/progress.png')} 
              style={[styles.categoryIcon, {
                width: fontScale >= 2 ? 40 : fontScale >= 1.6 ? 45 : fontScale >= 1.3 ? 47 : 50,
                height: fontScale >= 2 ? 40 : fontScale >= 1.6 ? 45 : fontScale >= 1.3 ? 47 : 50,
              }]}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.categoryText, {
            fontSize: getResponsiveFontSize(11),
            minHeight: fontScale >= 1.6 ? 44 : fontScale >= 1.3 ? 36 : 'auto',
            lineHeight: fontScale >= 1.6 ? 22 : fontScale >= 1.3 ? 18 : undefined,
          }]}
          numberOfLines={fontScale >= 1.6 ? 2 : 1}
          >Progress</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    backgroundColor: '#F2FFFA',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    alignSelf: 'center',
    width: '90%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#9d9595ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    borderColor:'#E4E4E4',
    borderWidth:1,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16423C',
  },
  viewAllButton: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 15,
    letterSpacing: 0,
    color: '#16423C',
  },
  categoriesGrid: {
    flexDirection: 'row',
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FDFDFD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#16423C63',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryIcon: {
    width: 50,
    height: 50,
  },
  categoryText: {
    fontSize: 11,
    color: '#16423C',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Categories;