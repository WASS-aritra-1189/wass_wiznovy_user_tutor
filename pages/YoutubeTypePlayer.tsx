import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Animated,
  PanResponder,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as ScreenOrientation from "expo-screen-orientation";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function YouTubeStylePlayer() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isLandscape, setIsLandscape] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const exitButtonY = useRef(new Animated.Value(-200)).current;

  // For dragging
  const [dragging, setDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
      setIsLandscape(window.width > window.height);
    });
    
    return () => subscription?.remove();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Reset states when screen comes into focus
      setIsFullscreen(false);
      setShowControls(true);
      
      return () => {
        // Cleanup when screen loses focus
        (async () => {
          try {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
          } catch (error) {
            console.error('Failed to reset orientation on unfocus:', error);
          }
        })();
      };
    }, [])
  );

  useEffect(() => {
    if (showControls) {
      const timer = setTimeout(() => hideControls(), 3000);
      return () => clearTimeout(timer);
    }
  }, [showControls]);



  const hideControls = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(exitButtonY, {
        toValue: -200,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start(() => setShowControls(false));
  };

  const showControlsHandler = () => {
    setShowControls(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(exitButtonY, {
        toValue: 0,
        tension: 20,
        friction: 12,
        useNativeDriver: true,
      })
    ]).start();
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (status.isPlaying) {
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
      }
    }
  };

  const replayVideo = async () => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(0);
      videoRef.current.playAsync();
    }
  };

  const toggleMute = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const skipForward = async () => {
    if (!status.positionMillis || !videoRef.current) return;
    await videoRef.current.setPositionAsync(status.positionMillis + 10000);
  };

  const skipBackward = async () => {
    if (!status.positionMillis || !videoRef.current) return;
    await videoRef.current.setPositionAsync(
      Math.max(status.positionMillis - 10000, 0)
    );
  };

  const formatTime = (millis: number) => {
    const totalSec = Math.floor(millis / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const getProgressWidth = () => {
    const barWidth = dimensions.width - 180;
    if (dragging) return dragPosition;
    if (!status.durationMillis) return 0;
    return (status.positionMillis / status.durationMillis) * barWidth;
  };

  // PanResponder for dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => setDragging(true),
      onPanResponderMove: (_, gesture) => {
        const barWidth = dimensions.width - 180;
        const currentWidth = dragging ? dragPosition : getProgressWidth();
        let newPos = Math.max(0, Math.min(barWidth, gesture.dx + currentWidth));
        setDragPosition(newPos);
      },
      onPanResponderRelease: (_, gesture) => {
        const barWidth = dimensions.width - 180;
        const currentWidth = dragging ? dragPosition : getProgressWidth();
        const progress = Math.max(0, Math.min(1, currentWidth / barWidth));
        const newTime = progress * (status.durationMillis || 0);
        if (videoRef.current) {
          videoRef.current.setPositionAsync(newTime);
        }
        setDragging(false);
        setDragPosition(0);
      },
    })
  ).current;

  // Tap to seek
  const handleBarPress = async (e: any) => {
    if (!status.durationMillis) return;
    const barWidth = dimensions.width - 180;
    const tapX = e.nativeEvent.locationX;
    const progress = Math.max(0, Math.min(1, tapX / barWidth));
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(progress * status.durationMillis);
    }
  };



  const toggleOrientation = async () => {
    try {
      if (isLandscape) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
    } catch (error) {
      console.error('Orientation toggle failed:', error);
    }
  };

  const getPlayIconName = () => {
    if (status.didJustFinish) return "refresh";
    return status.isPlaying ? "pause" : "play";
  };

  const progressWidth = getProgressWidth();

  return (
    <View style={[styles.safeArea, isFullscreen && styles.fullscreenContainer, { paddingTop: isFullscreen ? 0 : insets.top }]}>
      <StatusBar style="light" hidden={isFullscreen || !showControls} />
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={showControlsHandler}
      >
      <Video
        ref={videoRef}
        style={styles.video}
        source={{
          uri: "https://www.w3schools.com/html/mov_bbb.mp4",
        }}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={true}
        isMuted={isMuted}
        onLoadStart={() => setIsLoading(true)}
        onReadyForDisplay={() => setIsLoading(false)}
        onPlaybackStatusUpdate={(s) => setStatus(s)}
        onFullscreenUpdate={(update) => {
          setIsFullscreen(update.fullscreenUpdate === 1);
        }}
      />

      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={styles.loadingIndicator}
        />
      )}

      {showControls && (
        <Animated.View style={[styles.controls, { opacity: fadeAnim }]}>
          {/* Back button - only show in portrait */}
          {!isLandscape && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                navigation.goBack();
                // Reset orientation after navigation to avoid visual glitch
                setTimeout(async () => {
                  try {
                    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                  } catch (error) {
                    console.error('Failed to reset orientation:', error);
                  }
                }, 100);
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          
          {/* Landscape exit button */}
          {isLandscape && (
            <Animated.View style={[styles.landscapeExitButton, { transform: [{ translateY: exitButtonY }] }]}>
              <TouchableOpacity 
                style={styles.exitButtonTouchable}
                onPress={() => {
                  navigation.goBack();
                  // Reset orientation after navigation to avoid visual glitch
                  setTimeout(async () => {
                    try {
                      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                    } catch (error) {
                      console.error('Failed to reset orientation:', error);
                    }
                  }, 100);
                }}
              >
                <Ionicons name="close" size={40} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          )}
          
          {/* Top right buttons */}
          <View style={styles.topRightButtons}>
            <TouchableOpacity onPress={toggleOrientation} style={styles.topButton}>
              <Ionicons
                name={isLandscape ? "phone-portrait" : "phone-landscape"}
                size={22}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
          
          {/* Center controls */}
          <View style={styles.centerControls}>
            <TouchableOpacity onPress={skipBackward}>
              <Ionicons name="play-back" size={40} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={status.didJustFinish ? replayVideo : togglePlayPause}>
              <Ionicons
                name={getPlayIconName()}
                size={50}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={skipForward}>
              <Ionicons name="play-forward" size={40} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Bottom controls */}
          <View style={[styles.bottomControls, isFullscreen && styles.bottomControlsLandscape, !isLandscape && styles.bottomControlsPortrait]}>
            <TouchableOpacity onPress={toggleMute}>
              <Ionicons
                name={isMuted ? "volume-mute" : "volume-high"}
                size={22}
                color="#fff"
              />
            </TouchableOpacity>

            <Text style={styles.timeText}>
              {formatTime(status.positionMillis || 0)}
            </Text>

            {/* Custom draggable progress bar */}
            <View
              style={styles.progressBarContainer}
              onStartShouldSetResponder={() => true}
              onResponderRelease={handleBarPress}
            >
              <View style={styles.progressBarBackground}>
                <View
                  style={[styles.progressBarFill, { width: progressWidth }]}
                />
              </View>

              {/* draggable thumb */}
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.thumb,
                  { transform: [{ translateX: progressWidth - 8 }] },
                ]}
              />
            </View>

            <Text style={styles.timeText}>
              {formatTime(status.durationMillis || 0)}
            </Text>
          </View>
        </Animated.View>
      )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullscreenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  controls: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingBottom: 10,
  },
  centerControls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    transform: [{ translateY: -25 }],
  },
  bottomControls: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingLeft: 15,
    paddingRight: 40,
    paddingBottom: 10,
  },
  bottomControlsLandscape: {
    bottom: 10,
    paddingLeft: 20,
    paddingRight: 50,
  },
  bottomControlsPortrait: {
    bottom: 40,
    paddingBottom: 20,
  },
  timeText: {
    color: "#fff",
    fontSize: 12,
    width: 40,
    textAlign: "center",
  },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: "center",
    minHeight: 20,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: "#555",
    borderRadius: 2,
    position: "absolute",
    width: "100%",
  },
  progressBarFill: {
    height: 4,
    backgroundColor: "#1DB954",
    borderRadius: 2,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    position: "absolute",
  },
  loadingIndicator: {
    position: "absolute",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  topRightButtons: {
    position: "absolute",
    top: 50,
    left: 15,
    flexDirection: "row",
    zIndex: 10,
  },
  topButton: {
    marginLeft: 15,
  },
  landscapeExitButton: {
    position: "absolute",
    top: "25%",
    left: "50%",
    marginLeft: -30,
    zIndex: 10,
  },
  exitButtonTouchable: {
    backgroundColor: "#16423C",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});