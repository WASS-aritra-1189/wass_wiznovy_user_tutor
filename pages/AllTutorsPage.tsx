import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AllTutors from '../components/AllTutors';

interface AllTutorsPageProps {
  navigation?: any;
  route?: any;
}

const AllTutorsPage: React.FC<AllTutorsPageProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const initialSubject = route?.params?.subject;

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <AllTutors onClose={handleClose} initialSubject={initialSubject} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default AllTutorsPage;