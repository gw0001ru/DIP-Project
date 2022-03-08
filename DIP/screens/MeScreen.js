import * as React from 'react'
import { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
    ImageBackground,
  } from 'react-native';
  
import * as ImagePicker from 'expo-image-picker';
import {LineChart} from "react-native-chart-kit";
import { render } from 'react-dom';
import { createStackNavigator } from "@react-navigation/stack";


  
const screenWidth = Dimensions.get("window").width;
const data = {
    labels: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
    datasets: [
      {
        data: [2, 0, 4.5, 6, 1, 3, 2],
        color: (opacity = 1) => '#FF7B00', // optional
        // color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    // legend: ["Rainy Days"] // optional
  };
  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientFromOpacity: 0.1,
    backgroundGradientTo: "#FFFFFF",
    backgroundGradientToOpacity: 0.7,
    fillShadowGradientFrom: "#FF7B00",
    fillShadowGradientFromOpacity: 0.2,
    fillShadowGradientTo: "#FFFFFF",
    fillShadowGradientToOpacity: 0,
    color: (opacity = 0.5) => `rgba(255, 123, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    labelColor:(opacity = 0.1) => "#ffb46e",
    barPercentage: 0.5,
    decimalPlaces: 1,
    useShadowColorFromDataset: false // optional
  };
  const tasksCompleted = 20

function MeScreen({ navigation, route }) {
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [userName, setUserName] = React.useState('Joyce Tan');
    const [userInfo1, setUserInfo1] = React.useState('NTU IEM year 3 Student');
    const [userInfo2, setUserInfo2] = React.useState('DIP Project');

    React.useEffect(() => {
      if (route.params?.newName) {
        setUserName(route.params.newName)
      };
      if (route.params?.newInfo1) {
        setUserInfo1(route.params.newInfo1)
      };
      if (route.params?.newInfo2) {
        setUserInfo2(route.params.newInfo2)
      };
      if (route.params?.selectedImage) {
        setSelectedImage(route.params.selectedImage)
      }
    }, [route.params?.newName]);
  
    return (
        <SafeAreaView style={styles.container}>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection:'row',marginTop:10, flexGrow:1}}>
              
              {selectedImage!==null? <Image style={styles.avatar}
                    source={{uri: selectedImage.localUri}}/>:<Image style={styles.avatar}
                source={require("../assets/avatar_1.png")}/>}
 
              <View style={{marginLeft:10,marginTop:15, flexShrink:1, flexBasis:'auto', flexGrow:1,} }>
                <Text style={[styles.name,{marginBottom:10}]}>{userName}</Text>
                <Text style={styles.userInfo1}> {userInfo1} </Text>
                <Text style={styles.userInfo2}> {userInfo2} </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Edit Profile",{ userName,userInfo1,userInfo2, selectedImage})} style={styles.button}>
                  <Image style={styles.icon} source={{uri: "https://img.icons8.com/color-glass/48/000000/pencil.png"}}/>
                  <Text style={styles.info}> Edit </Text>
              </TouchableOpacity>
              </View>
              
            </View>
          </View>

            <View style={{ flex: 1, alignItems: 'center', paddingTop:20 }}>
            {/* <ScrollView> */}
              <TouchableOpacity style={styles.touchableStyle}>
                <Text style={styles.textStyle}>
                  Total Task Completed:   
                  <Text style={styles.boldText}>  {tasksCompleted}  </Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.touchableStyle}>
                <Text style={styles.textStyle}>
                  Your Focus Time (Last Week): {'  '}  
                </Text>
              </TouchableOpacity>
              <LineChart
              data={data}
              width={screenWidth}
              height={250}
              chartConfig={chartConfig}
              bezier
              />
            {/* </ScrollView> */}
        </View>
   
      </SafeAreaView>
    )
};

function EditProfileScreen({route, navigation}) {
  const user = route.params.userName;
  const info1 = route.params.userInfo1;
  const info2 = route.params.userInfo2;
  const [selectedImage, setSelectedImage] = React.useState(route.params.selectedImage);
  const [newName, setNewName] = React.useState('');
  const [newInfo1, setNewInfo1] = React.useState('');
  const [newInfo2, setNewInfo2] = React.useState('');
  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
    alert('Permission to access camera roll is required!');
    return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
    return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
};
  return (
    <SafeAreaView>
      <View>
        <Text
          style={styles.e_Title}>
          Edit Profile
        </Text>
      </View>
      <View style={styles.e_HeaderBorder}/>

      {/* content */}
      <TouchableOpacity onPress={openImagePickerAsync}>
        {selectedImage!==null? <Image style={styles.editAvatar}
                    source={{uri: selectedImage.localUri}}/>:<Image style={styles.editAvatar}
                source={require("../assets/avatar_1.png")}/>}
        <Text
        style={styles.avatarText}>
        Edit
      </Text>
      </TouchableOpacity>
      <Text
        style={styles.e_Heading}>
        Name:
      </Text>
      <TextInput
        style={styles.e_Input}
        onChangeText={setNewName}
        value={newName}
        placeholder={user}
        keyboardType="default"
      />
      <Text
        style={styles.e_Heading}>
        Information:
      </Text>
      <TextInput
        style={styles.e_Input}
        onChangeText={setNewInfo1}
        value={newInfo1}
        placeholder={info1}
        keyboardType="default"
      />
      <Text
        style={styles.e_Heading}>
        Additional Details:
      </Text>
      <TextInput
        style={styles.e_Input}
        onChangeText={setNewInfo2}
        value={newInfo2}
        placeholder={info2}
        keyboardType="default"
      />

      <TouchableOpacity onPress={() => {
          // Pass and merge params back to home screen
          navigation.navigate({
            name: 'Me Screen',
            params: { newName, newInfo1, newInfo2, selectedImage },
            merge: true,
          })}} style={styles.e_saveButton}>
        <Text style={styles.e_saveButtonText}>Save</Text>
      </TouchableOpacity>

    </SafeAreaView>
    )
};

const Stack = createStackNavigator()
export default function ComponentStack({route: {params}}) {

  return (
    <Stack.Navigator initialRouteName = 'Me Screen'>
      <Stack.Screen name="Me Screen" component={MeScreen} />
      <Stack.Screen name="Edit Profile" component={EditProfileScreen} initialParams={params} />
    </Stack.Navigator>
  )
};

const styles = StyleSheet.create({
  //me screen
    avatar: {
      width: 130,
      height: 130,
      borderRadius: 63,
      borderWidth: 3,
      borderColor: "white",
      marginBottom:15,
      marginTop:15,
      marginLeft:30
    },
    avatarText: {
      alignSelf: 'center',
      fontSize: 16,
      color: '#5F5DA6',
    },
    boldText:{
      fontWeight: 'bold',
    },
    button:{
      flexDirection:'row-reverse',
      alignItems:"center",
      position: "relative",
      marginRight:0,
      alignContent:'stretch',
    },
    container: {
      flex: 1,
      backgroundColor: '#e2e2e2',
      justifyContent: 'center',
      alignItems:"center",
      paddingTop: Platform.OS ===  "android" ? StatusBar.currentHeight:0
    },
    editAvatar: {
      alignItems: 'center',
      width: 130,
      height: 130,
      borderRadius: 63,
      borderWidth: 3,
      borderColor: "white",
      marginBottom:0,
      marginTop:15,
      marginLeft:0.5*(screenWidth)-65,
      opacity: 1
    },
    header:{
      backgroundColor: "#DCDCDC",
    },
    headerContent:{
      padding:30,
      alignItems: 'center',
    },
    iconContent:{
      flex:1,
      alignItems:'flex-end',
      paddingRight:5,
    },
    icon:{
      width:30,
      height:30,
      marginTop:20,
    },
    info:{
      fontSize:16,
      marginTop:20,
      color: "#FFFFFF",
      backgroundColor: "#9cabba", 
      borderRadius: 10,
      paddingHorizontal:5,
      overflow:"hidden",
    },
    infoContent:{
      flex:1,
      justifyContent:"flex-end",
      paddingLeft:5,
      alignContent: "flex-start",
    },
    item:{
      flexDirection : 'row',
    },
    name:{
      fontSize:22,
      color:"#000000",
      fontWeight:'600',
      marginTop:15
    },
    posttext:{
      textAlign:'center'
    },
    textStyle:{
      color: 'white',
    },
    thumbnail: {
      width: 300,
      height: 300,
      resizeMode: "contain"
    },
    touchableStyle:{
      backgroundColor: '#5F5DA6',
      borderRadius:15,
      paddingVertical:5,
      paddingHorizontal:15,
      alignSelf: 'flex-start',
      marginLeft:20,
      marginBottom:10,
    },
    userInfo1:{
      fontSize:16,
      color:"#778899",
      fontWeight:'600',
    },
    userInfo2:{
      fontSize:16,
      color:"#9dadbd",
      fontWeight:'500',
    },
    userInfoSection:{
      backgroundColor:"#f9f9f9",
      width: screenWidth,
    },
   //edit profile
    e_Input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderColor: '#979797',
      borderRadius: 8,
    },
    e_Heading: {
      height: 20,
      margin: 12,
      marginBottom: -10,
      fontWeight: 'bold',
    },
    e_AddPagesHeader: {
      height: 20,
      margin: 12,
      color: '#5F5DA6',
      fontWeight: 'bold',
    },
    e_AddPagesBorder: {
      borderBottomColor: '#C4C4C4',
      borderBottomWidth: 1,
      marginRight: 12,
      marginLeft: 12,
      marginTop: -5,
    },
    e_HeaderBorder: {
      borderBottomColor: '#C4C4C4',
      borderBottomWidth: 1,
    },
    e_Title: {
      height: 20,
      margin:12,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#5F5DA6',
    },
    e_saveButton: {
      margin: 13,
      height: 35,
      marginTop: 25,
      backgroundColor: '#5F5DA6',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
    },
    e_saveButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff'
    },
  });