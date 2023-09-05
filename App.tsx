import { useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { Alert, Pressable, Text, View, Button } from "react-native"
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av"

import { styles } from "./styles"

export default function App() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null)
  const [recordingFileUri, setRecordingFileUri] = useState<string | null>(null)

  async function handleRecordingStart() {
    const { granted } = await Audio.getPermissionsAsync()

    if (granted) {
      try {
        const { recording } = await Audio.Recording.createAsync()
        setRecording(recording)
      } catch (err) {
        console.log(err)
        Alert.alert(
          "Erro ao gravar",
          "Não foi possível iniciar a gravação do áudio."
        )
      }
    }
  }

  async function handleRecordingStop() {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync()
        const fileUri = recording.getURI()
        setRecordingFileUri(fileUri)
        setRecording(null)
      }
    } catch (err) {
      console.log(err)
      Alert.alert(
        "Erro ao gravar",
        "Não foi possível para a gravação do áudio."
      )
    }
  }

  async function handleAudioPlay() {
    if (recordingFileUri) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingFileUri },
        { shouldPlay: true, volume: 1.0 }
      )

      await sound.setPositionAsync(0)
      await sound.playAsync()
    }
  }

  useEffect(() => {
    Audio.requestPermissionsAsync().then(({ granted }) => {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: true,
      })
    })
  }, [])

  return (
    <View style={styles.container}>
      <Pressable
        onPressIn={handleRecordingStart}
        onPressOut={handleRecordingStop}
        style={[styles.button, recording && styles.recording]}
      >
        <MaterialIcons name="mic" size={44} color="#212121" />
      </Pressable>

      {recording && <Text style={styles.label}>Gravando</Text>}

      {recordingFileUri && (
        <Button title="Ouvir áudio" onPress={handleAudioPlay} />
      )}
    </View>
  )
}
