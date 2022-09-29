import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
  IBMPlexMono_700Bold,
} from '@expo-google-fonts/ibm-plex-mono'
export default function App() {
  let [fontsLoaded] = useFonts({ IBMPlexMono_400Regular, IBMPlexMono_500Medium, IBMPlexMono_600SemiBold, IBMPlexMono_700Bold,})
  if (!fontsLoaded) {
    return <Text>Fonts are loading...</Text>
  }
  return (
    <View style={styles.container}>
      <Text style={{fontFamily:"IBMPlexMono_400Regular", fontSize:20}}>Hello, World!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
