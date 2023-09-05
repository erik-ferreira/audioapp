import { useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { Pressable, Text, View } from "react-native"

import { styles } from "./styles"

export default function App() {
  const [recording, setRecording] = useState(true)

  return (
    <View style={styles.container}>
      <Pressable
        onPressIn={() => setRecording(true)}
        onPressOut={() => setRecording(false)}
        style={[styles.button, recording && styles.recording]}
      >
        <MaterialIcons name="mic" size={44} color="#212121" />
      </Pressable>

      {recording && <Text style={styles.label}>Gravando</Text>}
    </View>
  )
}
