import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MySchedule from '../components/MySchedule';

interface MySchedulePageProps {
  navigation?: any;
  route?: any;
}

const MySchedulePage: React.FC<MySchedulePageProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { selectedDate, showLiveOnly } = route?.params || {};

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <MySchedule 
        onClose={handleClose} 
        initialDate={selectedDate}
        showLiveOnly={showLiveOnly}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default MySchedulePage;