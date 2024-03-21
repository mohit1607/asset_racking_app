
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Image,
    StatusBar,
    ImageBackground,
    Dimensions,
    Alert
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
const { width, height } = Dimensions.get('window');
import Icons from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser, getDomain } from './functions/helper';


const ClientLogin = ({ navigation }) => {
    const [loading, setloading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    // const [user, setUser] = useState();
    const [email, setemail] = useState('');
    const [pword, setpword] = useState('');
    const [ip, setip] = useState('');
    const [emailinvalid, setemailinvalid] = useState(false);

    const [err, seterr] = useState(false);
    const [errmsg, seterrmsg] = useState(
        'Password and Confirm Password do not match',
    );


    const inValidator = (err, msg) => {
        seterr(true), seterrmsg(msg);
    };


    const loginStart = () => {
        if (emailinvalid) return console.log('NO VALID');
        else if (email.length === 0) return inValidator(true, 'Email required');
        else if (pword.length === 0)
            return inValidator(true, 'Password Field Cannot be left Empty');
        // else if (pword.length < 6)
        //     return inValidator(true, 'Password Should at least be 6 characters');
        else {
            setloading(true);
            fetch('https://demo.vellas.net:99/sap_api/api/values/GetAssetlist?token=743F1F69-168A-489E-BC19-5ABF98E8000B&location=')
                .then(response => { console.log(response); return response.text() })
                .then(datas => {
                    const data = new URLSearchParams();
                    data.append('method', 'loginCheck');
                    data.append('data', JSON.stringify({ username: email, pwd: pword }));
                    var domain = getDomain();
                    console.log(domain + '/assettracking/webapp/php/index.php');

                    fetch(domain + '/assettracking/webapp/php/index.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: data.toString()
                    })
                        .then(response => response.text())
                        .then(data => {
                            console.log(data);
                            var resp = typeof (data) == 'string' ? JSON.parse(data) : data;
                            setloading(false);
                            if (resp) {
                                if (resp[0] == 'Login unsuccesfull' || resp[0] == 'Login failed') {
                                    Alert.alert(resp[0]);
                                    AsyncStorage.removeItem('username');
                                    AsyncStorage.removeItem('password');
                                }
                                else {
                                    AsyncStorage.setItem('username', email);
                                    AsyncStorage.setItem('password', pword);
                                    setUser({ username: email, pwd: pword })
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'LoggedInContainer' }],
                                    });
                                }
                            }


                        })
                        .catch(error => {
                            alert('Error:', error);
                            console.log('Error:', error);
                            setloading(false);

                        });
                })
                .catch(error => {
                    alert('Error:', error);
                    console.log('Error:', error);
                    setloading(false);

                });





            // console.log('https://aperia.vellas.net:6642/sap_api/api/values/GetAssetlist?token=743F1F69-168A-489E-BC19-5ABF98E8000B&location=')


        }
    };
    const validateEmail = () => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    useEffect(() => {
        checkLogin();
    }, []);

    const checkLogin = async () => {
        var user = await AsyncStorage.getItem('username');
        var pwd = await AsyncStorage.getItem('password');
        // var ipport = await AsyncStorage.getItem('ip');
        if (user && pwd) {
            fetch('https://demo.vellas.net:99/sap_api/api/values/GetAssetlist?token=743F1F69-168A-489E-BC19-5ABF98E8000B&location=')
                .then(response => { return response.text() })
                .then(datas => {
                    var domain = getDomain();
                    console.log(domain + '/assettracking/webapp/php/index.php');
                    const data = new URLSearchParams();
                    data.append('method', 'loginCheck');
                    data.append('data', JSON.stringify({ username: user, pwd: pwd }));
                    fetch(domain + '/assettracking/webapp/php/index.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: data.toString()
                    })
                        .then(response => response.text())
                        .then(data => {
                            console.log(typeof (data));
                            var resp = typeof (data) == 'string' ? JSON.parse(data) : data;
                            setloading(false);
                            if (resp) {
                                if (resp[0] == 'Login unsuccesfull' || resp[0] == 'Login failed') {
                                    Alert.alert(resp[0]);
                                    AsyncStorage.removeItem('username');
                                    AsyncStorage.removeItem('password');
                                }
                                else {
                                    AsyncStorage.setItem('username', user);
                                    AsyncStorage.setItem('password', pwd);
                                    setUser({ username: user, pwd: pwd })
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'LoggedInContainer' }],
                                    });
                                }
                            }


                        })
                        .catch(error => {
                            alert('Error:', error);
                            console.log('Error:', error);
                            setloading(false);

                        });
                })

        }
    }


    return (
        <View
            style={{
                backgroundColor: '#FFF',
                flex: 1,
            }}>

            <StatusBar barStyle="light-content" backgroundColor="#c4dcf9" />
            <ImageBackground
                source={require('../assets/bg.jpg')}
                resizeMode="stretch"
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
                <View style={{ backgroundColor: '#FFF', borderRadius: 15, height: '80%', width: '90%', padding: 10, justifyContent: 'center' }}>
                    <Image
                        source={require('../assets/sapLogo.png')}
                        resizeMode="contain"
                        style={{ maxHeight: 100, width: '100%' }}
                    />
                    <Text style={{ color: '#000', textAlign: 'center', fontSize: width / 13, fontWeight: 'bold', paddingTop: 10 }}>Asset Management</Text>
                    <View style={{ backgroundColor: '#edeff1', borderRadius: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, margin: 20 }}>
                        <Icons name="user-alt" size={width / 20} color={'#91919a'} />
                        <Text style={{ color: '#91919a', fontSize: width / 20, fontWeight: 'bold', marginHorizontal: 10 }}>|</Text>
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor="#91919a"
                            onChangeText={text => setemail(text)}
                            style={{
                                flex: 1,
                                color: '#000',
                                fontSize: width / 20,
                            }}
                        />
                    </View>
                    <View style={{ backgroundColor: '#edeff1', borderRadius: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginHorizontal: 20 }}>
                        <Icons name="key" size={width / 20} color={'#91919a'} />
                        <Text style={{ color: '#91919a', fontSize: width / 20, fontWeight: 'bold', marginHorizontal: 10 }}>|</Text>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#91919a"
                            textContentType="password"
                            secureTextEntry={true}
                            onChangeText={text => setpword(text)}
                            style={{
                                flex: 1,
                                color: '#000',
                                fontSize: width / 20,

                            }}
                        />
                    </View>
                    {err && (
                        <View
                            style={{
                                width: '100%',
                                marginHorizontal: 30,
                                marginTop: 10,
                                justifyContent: 'center',
                            }}>
                            <Text style={{ color: 'red', fontSize: width / 24 }}>&bull; {errmsg}</Text>
                        </View>
                    )}
                    <View style={{ marginHorizontal: 20, marginTop: 30 }}>


                        {loading ? (
                            <TouchableOpacity
                                style={{
                                    width: '100%',

                                    backgroundColor: '#79ace7',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 20,
                                    padding: 10
                                }}>
                                <ActivityIndicator />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={loginStart}
                                style={{
                                    width: '100%',

                                    backgroundColor: '#79ace7',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 20,
                                    padding: 10
                                }}>
                                <Text style={{ fontSize: width / 18, color: 'white' }}>Log in</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ImageBackground>


        </View>
    )
}

export default ClientLogin