import { StatusBar } from 'expo-status-bar';
import React from "react";
import { useState } from 'react';
import { TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, TextInput, Text, View, Button,
   Dimensions, Image, Platform, LogBox } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from "react-native-modalbox";
import { NavigationContainer } from '@react-navigation/native';

//Required imports for database
import {useEffect} from "react";
import {db} from './firebase_config';
import {collection, getDocs, addDoc, doc, deleteDoc} from 'firebase/firestore';

// ignore warning for constantly refreshing view
LogBox.ignoreLogs(['Setting a timer for a long period of time'])

const AddEvent = () => {
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newRemarks, setNewRemarks] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newReminder, setNewReminder] = useState("");

  // additional firebase stuff
  const [event, setEvents] = useState([]);
  const eventCollectionRef = collection(db, "Event");
  const [category, setCategories] = useState([]);
  const categoryCollectionRef = collection(db, "Category");

  // datetimepicker const
  const [mode,setMode]= useState('newDate');
  const [show,setShow]= useState(false);
  const [newDate, setNewDate]= useState(new Date(Date.now()));
  const [dateText,setDateText]= useState('Select Date');
  const [newStartTime, setNewStartTime] = useState("Start Time")
  const [newEndTime, setNewEndTime] = useState("Start Time")
  const [timeType, setTimeType] = useState('');
  const [dateType, setDateType] = useState('');
  
  // reminder const & declaration
  const reminderList = ["No Reminder",
    "At time of event",
    "5 minutes before",
    "15 minutes before",
    "30 minutes before",
    "45 minutes before",
    "1 hour before",
    "2 hours before",
    "1 day before",
    "2 days before",
    "3 days before",
    "4 days before", 
    "5 days before",
    "1 week before"
  ]
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  const [modalReminderVisible, setModalReminderVisible] = useState(false);

  let ListCategory=category.map((category)=>{
    return <TouchableOpacity style={styles.buttonStyle} onPress={() => { setNewCategory(category.Name);setModalCategoryVisible(false); console.log(category.Name)}}> 
        <Text style={{ fontSize: 14 }}>{category.Name}</Text>
  </TouchableOpacity>
  })

  let ListReminders=reminderList.map((item,index)=>{
    return <TouchableOpacity style={styles.buttonStyle} onPress={() => {setNewReminder(item); setModalReminderVisible(false)}}>
        <Image
          source={require('./assets/alarm.png')} style={{width: 15, height: 15}} 
          // style={styles.ImageIconStyle}
          />
        <Text style={{ marginLeft:10, fontSize: 14 }}>{item}</Text>
      </TouchableOpacity> 
  })

  const getModalCategory = () =>{
    return (
      
      <Modal
        entry="bottom"
        backdropPressToClose={true}
        isOpen={modalCategoryVisible}
        style={styles.modalBox}
        onClosed={() => setModalCategoryVisible(false)}
      >
        <View style={styles.content}>            
          {ListCategory}
          <Button title='x Close' color={'#6568A6'} onPress={() => setModalCategoryVisible(false)} />
        </View>
      </Modal>
    );
  };

  const getModalReminder = () =>{
    return (
      <Modal
        entry="bottom"
        backdropPressToClose={true}
        isOpen={modalReminderVisible}
        style={styles.modalBox}
        propagateSwipe={true}
        onClosed={() => setModalReminderVisible(false)}
        ScrollViewProps={true}
        onPress={() => setModalReminderVisible(false)}
      >
        <View style={{flex:1}}>
          <ScrollView style={styles.modalScroll}> 
            {ListReminders}
            <TouchableOpacity style={styles.closeButtonStyle} onPress={() => setModalReminderVisible(false)}>
              <Text style={{ color: '#6568A6'}}>x Close</Text>
            </TouchableOpacity> 
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  
  const onChange = (event, selectedDate)=> {
    const currentDate = selectedDate || newDate;
    setShow(Platform.OS === 'ios');
    setNewDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate()+'/'+(tempDate.getMonth()+1)+'/'+tempDate.getFullYear();
    let fTime = tempDate.getHours() + ':' + tempDate.getMinutes();
    // setDateText(fDate);
    {timeType == 'Date' ? setDateText(fDate) : null};
    {timeType == 'Start' ? setNewStartTime(fTime) : null};
    {timeType == 'End' ? setNewEndTime(fTime) : null};

    console.log(fDate+"("+fTime+")"+"("+sTime+")")
  };

  const createEvent = async () => {
    await addDoc(eventCollectionRef,
        {
            Name: newName, 
            // eventID: newEventID,
            Location: newLocation,
            startTime: newStartTime,
            endTime: newEndTime,
            date: dateText,
            Reminder: newReminder,
            Remarks: newRemarks,
            Category: newCategory
        }
        );
  };
  
  const deleteEvent = async (id) =>{
      const eventDoc = doc(db, "Event", id);
      await deleteDoc(eventDoc)
  }

  useEffect(() => {
    const getEvents = async () => {
      const data = await getDocs(eventCollectionRef);
      setEvents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const getCategories = async () => {
      const data = await getDocs(categoryCollectionRef);
      setCategories(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    setInterval(() => {
      getEvents();
      getCategories();
      console.log(getEvents);
      console.log(getCategories);
    }, 1800)
  },[]);

  return (
    <View style={{flex:1}}>
      <SafeAreaView>
        <ScrollView nestedScrollEnabled style={styles.scrollView}>
        <View>
          <Text
            style={styles.Title}>
            Adding Event
          </Text>
        </View>
        <View style={styles.HeaderBorder}/>

        <Text
          style={styles.Heading}>
          Name:
        </Text>
        <TextInput
          style={styles.Input}
          onChangeText={setNewName}
          value={newName}
          placeholder="e.g. Work / Study"
          keyboardType="default"
        />

        <Text
          style={styles.Heading}>
          Location:
        </Text>
        <TextInput
          style={styles.Input}
          onChangeText={setNewLocation}
          value={newLocation}
          placeholder="e.g. Hive"
          keyboardType="default"
        />
        <Text
          style={styles.Heading}>
          Date:
        </Text>
        <TouchableOpacity style={{height: 25, backgroundColor: '#C4C4C4', borderRadius: 5, margin: 13, justifyContent: 'center'}}
        onPress={()=>{ setTimeType("Date"); showMode('date')} }>
          <Text>  {dateText}</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', marginLeft: 13}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{marginTop: 10, width: '50%', fontWeight: 'bold', height: 20}}>From:</Text>
            <Text style={{marginTop: 10, width: '50%', fontWeight: 'bold', height: 20}}>To:</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', marginLeft: 13, marginRight: 13}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity style={{width: 170, height: 25, backgroundColor: '#C4C4C4', borderRadius: 5, marginRight: 17, marginBottom: 10, justifyContent: 'center'}}
            onPress={()=> {setTimeType("Start"); showMode('time')}}>
              <Text>  {newStartTime}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{width: 170, height: 25, backgroundColor: '#C4C4C4', borderRadius: 5, marginRight: 1, marginBottom: 10, justifyContent: 'center'}}
            onPress={()=>{setTimeType("End"); showMode('time')}}>
              <Text>  {newEndTime}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={styles.Heading}>
          Category:
        </Text>

        <TouchableOpacity 
          style={{height: 25, backgroundColor: '#C4C4C4', borderRadius: 5, margin: 11, justifyContent: 'center'}} 
          onPress={() => setModalCategoryVisible(true)}>
            {newCategory==''?<Text>  Select Category</Text>:<Text>  {newCategory}</Text>}
        </TouchableOpacity>

        <Text
          style={styles.Heading}>
          Reminder:
        </Text>
        <TouchableOpacity 
        style={{height: 25, backgroundColor: '#C4C4C4', borderRadius: 5, margin: 11, justifyContent: 'center'}}
        onPress={() => setModalReminderVisible(true)}>
          {newReminder ==''?<Text>  Select Reminder</Text>:<Text>  {newReminder}</Text>}
        </TouchableOpacity>

        <Text
          style={styles.Heading}>
          Remarks:
        </Text>
        <TextInput
          style={styles.longInput}
          onChangeText={setNewRemarks}
          value={newRemarks}
          placeholder="Details (e.g. items to bring along)"
          keyboardType="default"
          multiline={true}
        />

        <TouchableOpacity style={styles.saveButton} onPress={createEvent}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        {event.map((event) => {
          return (
            <NavigationContainer independent={true}>
                <Text>
                    {/* eventID: {event.eventID}, */}
                    Name: {event.Name},
                    Location: {event.Location},
                    startTime: {event.startTime},
                    endTime: {event.endTime},
                    Category: {event.Category},
                    Reminder: {event.Reminder},
                    Remarks: {event.Remarks},
                    Date: {event.date} {/* date must be small letter not Date!*/}
                </Text>

                <Button
                onPress={() => deleteEvent(event.id)}
                title= "Delete Event"
                >
                </Button>
            </NavigationContainer>
          );
        })}

        </ScrollView>
      </SafeAreaView>
      {show && (
        <DateTimePicker
        testID='dateTimePicker'
        value={newDate}
        mode = {mode}
        is24Hour = {true}
        display='default'
        onChange={onChange}
        />
      )}
      {getModalCategory()}
     {getModalReminder()}
    </View>
  );
};

const styles = StyleSheet.create({
  Input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#979797',
    borderRadius: 8,
  },
  longInput: {
    height: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#979797',
    borderRadius: 8,
    textAlignVertical: 'top', // android top-left align
  },
  Heading: {
    height: 20,
    margin: 12,
    marginBottom: -10,
    fontWeight: 'bold',
  },
  AddPagesHeader: {
    height: 20,
    margin: 12,
    color: '#5F5DA6',
    fontWeight: 'bold',
  },
  AddPagesBorder: {
    borderBottomColor: '#C4C4C4',
    borderBottomWidth: 1,
    marginRight: 12,
    marginLeft: 12,
    marginTop: -5,
  },
  HeaderBorder: {
    borderBottomColor: '#C4C4C4',
    borderBottomWidth: 1,
  },
  Title: {
    height: 30,
    margin: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5F5DA6',
  },
  saveButton: {
    margin: 13,
    height: 35,
    backgroundColor: '#5F5DA6',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center"
  },
  modalBox: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  modalScroll:{
    marginTop: 300,
    overflow: "hidden",
    textAlign: "left",
    // alignItems:"center",
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    paddingLeft:15,
    paddingBottom:15,
    flex: 1,
    height: 'auto',
    backgroundColor: "white"
  },
  content: {
    position: "absolute",
    bottom: 0,
    // height: verticalScale(250),
    height: 200,
    borderTopLeftRadius: 15,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 15,
    borderTopRightRadius: 15,
    backgroundColor: "white"
  },
  textStyle: {
    fontSize: 22
  },
  buttonStyle:{
    alignItems: 'flex-start',
    flexDirection: 'row',
    color: '#000',
    fontSize: 20,
    //fontWeight: "bold",
    padding: 10,
    minWidth: '100%'
  },
  closeButtonStyle:{
    alignItems: 'flex-start',
    color: '#6568A6',
    fontSize: 16,
    //fontWeight: "bold",
    padding: 10,
  },
  scrollView: {
    // flex: 1,
  },
  timeContainer: {
    flex: 1,
    backgroundColor: '#e2e2e2',
    justifyContent: 'center',
  },
  posttext:{
    textAlign:'center'
  }
});

export default AddEvent;