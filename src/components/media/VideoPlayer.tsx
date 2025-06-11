

import type React from "react"
import { useState } from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"
import { Video, ResizeMode } from "expo-av"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"

interface VideoPlayerProps {
  uri: string
  width?: number
  height?: number
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  uri,
  width = 300,
  height = 200,
  autoplay = false,
  loop = false,
  muted = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [isMuted, setIsMuted] = useState(muted)
  const [showControls, setShowControls] = useState(true)
  const { theme } = useTheme()

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const styles = StyleSheet.create({
    container: {
      position: "relative",
      width,
      height,
      backgroundColor: "black",
      borderRadius: theme.borderRadius.m,
      overflow: "hidden",
    },
    video: {
      width: "100%",
      height: "100%",
    },
    controls: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing.m,
    },
    playButton: {
      padding: theme.spacing.s,
    },
    muteButton: {
      padding: theme.spacing.s,
    },
    centerPlayButton: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: [{ translateX: -25 }, { translateY: -25 }],
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      alignItems: "center",
      justifyContent: "center",
    },
  })

  return (
    <TouchableOpacity style={styles.container} onPress={() => setShowControls(!showControls)}>
      <Video
        source={{ uri }}
        style={styles.video}
        shouldPlay={isPlaying}
        isLooping={loop}
        isMuted={isMuted}
        resizeMode={ResizeMode.CONTAIN}
      />

      {!isPlaying && (
        <TouchableOpacity style={styles.centerPlayButton} onPress={handlePlayPause}>
          <Ionicons name="play" size={24} color="white" />
        </TouchableOpacity>
      )}

      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.muteButton} onPress={handleMuteToggle}>
            <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  )
}
