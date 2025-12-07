import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AllCourses from '../components/AllCourses';

interface AllCoursesPageProps {
  navigation?: any;
}

const AllCoursesPage: React.FC<AllCoursesPageProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <AllCourses onClose={handleClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default AllCoursesPage;