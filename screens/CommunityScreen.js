import { FlatList, StyleSheet, TouchableOpacity,Text, View, } from "react-native";
import { FontAwesome, Ionicons } from '@expo/vector-icons';


const CommunityScreen = ( {navigation, route} ) => {
  const optionList = [
                      {icon: 'chatbox-ellipses', text: 'Group Chat', screen: 'Group Chat'}, 
                      // {icon: 'chatbubbles-sharp', text: 'Forum', screen: 'ForumScreen'}
                     ];

  const renderItem = ( {item} ) => (
    <TouchableOpacity onPress={ () => { navigation.navigate(item.screen); } }>
      <View style={styles.listItem}>
        <View style={{flexDirection: 'row'}}>
          <Ionicons style={styles.icon} name={item.icon} size={35}/>
          <Text style={styles.text}> {item.text} </Text>
        </View>
        <FontAwesome name="angle-right" size={30} color="orangered"/>
      </View>
    </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      <FlatList 
        data={optionList}
        renderItem={renderItem}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
  },
  listItem: {
      flexDirection: 'row', 
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10, 
      borderBottomColor: '#D6D6D6', 
      borderBottomWidth: 1,
  },
  text: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      fontSize: 25,
      padding: 5
  },
  icon: {
    padding: 3
  }
});

export default CommunityScreen