import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, SafeAreaView,  TextInput, View, Pressable} from 'react-native';
// Importing fonts
import { useFonts,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
  IBMPlexMono_700Bold,
} from '@expo-google-fonts/ibm-plex-mono'
// Vector Icons
import Icon from 'react-native-vector-icons/FontAwesome';


const ExpensesScreen = ({navigation}) => {

  const [isCameraVisible, setCameraVisible] = useState(false);

  let [fontsLoaded] = useFonts({ IBMPlexMono_400Regular, IBMPlexMono_500Medium, IBMPlexMono_600SemiBold, IBMPlexMono_700Bold,})
  if (!fontsLoaded) {
      return <Text>Fonts are loading...</Text>
  } else {
  
  // ------------------------ View Template -----------------------
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text style={[styles.screenHeading ,{fontFamily:"IBMPlexMono_500Medium"} ]}>Expenses</Text>
      </View>
        {!isCameraVisible && 
         <Pressable style={styles.camera} onPress={()=>{
            // Navigate to Register
            navigation.navigate("Camera");
         }}>
          <Icon name="camera" size={20} />
       </Pressable>
        }    
    </SafeAreaView>
  )
}
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:"#fff",
    flex: 1,
  },
  screenHeading : {
      fontSize: 30,
      fontWeight: "400",
      marginVertical:30,
      marginHorizontal:30,
  },
  camera:{
    alignSelf:'flex-end',
    marginVertical:-60,
    marginHorizontal:30,
  },
});

export default ExpensesScreen