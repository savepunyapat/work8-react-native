import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Text, View, FlatList, LogBox, Image } from 'react-native';
import firebase from 'firebase/compat/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Provider as PaperProvider, Card, List, Button } from 'react-native-paper';
import Constants from 'expo-constants';
import LoginScreen from './screens/Login';

const FirebaseConfig = {
  apiKey: "AIzaSyD4L87M1OKCAA5_OF1UuxbDWosxKp9tR2o",
  authDomain: "mobileweblab1.firebaseapp.com",
  databaseURL: "https://mobileweblab1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mobileweblab1",
  storageBucket: "mobileweblab1.appspot.com",
  messagingSenderId: "282755090941",
  appId: "1:282755090941:web:298a12dbef3cd029473194",
  measurementId: "G-8HQ8CD2VW9"
};


LogBox.ignoreAllLogs(true);

try {
  firebase.initializeApp(FirebaseConfig);
} catch (err) { }

function dbListener(path, setData) {
  const tb = ref(getDatabase(), path);
  onValue(tb, (snapshot) => {
    setData(snapshot.val());
  })
}


function renderCorona(item, index, setItem) {
  var icon = <Image style={{ width: 30, height: 20 }} source={{ uri: `https://covid19.who.int/countryFlags/${item.code}.png` }} />
  var desc = <View>
    <Text>{"ผู้ป่วยสะสม " + item.confirmed + " ราย"}</Text>
    <Text>{"เสียชีวิต " + item.death + " ราย"}</Text>
    <Text>{"รักษาหาย " + item.cure + " ราย"}</Text>
  </View>;
  return <List.Item onPress={() => setItem(item)} title={item.name} description={desc} left={(props => icon)}></List.Item>
}



function Detail(props) {

  return <View>
    <Text>{JSON.stringify(props.item)}</Text>
    <Button onPress={() => props.setItem(null)}>
      Back
    </Button>
  </View>
};



function Loading() {
  return <View><Text>Loading</Text></View>
}



export default function App() {
  const [corona, setCorona] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [citem, setCitem] = React.useState(null);
  React.useEffect(() => {
    var auth = getAuth();
    auth.onAuthStateChanged(function (us) {
      setUser(us);
    });
    dbListener("/corona", setCorona);
    console.log(corona)
  }, []);
  if (citem != null) {
    return <Detail item={citem} setItem={setCitem} />;
  }

  if (corona.length == 0) {
    return <Loading />;
  }
  if (user == null) {
    return <LoginScreen />;
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Card.Cover source={require("./assets/coronavirus.png")} />
        <ScrollView>
          <Card>
            <Card.Title title="Coronavirus Situation" />
            <Card.Content>
              <Text>Your Phone Number: {user.phoneNumber}</Text>
              <FlatList data={corona}
                renderItem={({ item }) => renderCorona(item, index, setCitem)} >
              </FlatList>
            </Card.Content>
          </Card>
        </ScrollView>
        <Button icon="logout" mode="contained" onPress={() => getAuth().signOut()}>
          Sign Out
        </Button>
        <StatusBar backgroundColor="rgba(0,0,0,0.5)" style="light" />

      </View>
    </PaperProvider>

  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
});
