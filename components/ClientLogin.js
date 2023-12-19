
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Image,
    StatusBar,
    ImageBackground,
    Dimensions
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
const { width, height } = Dimensions.get('window');
import Icons from 'react-native-vector-icons/FontAwesome5';


const ClientLogin = ({ navigation }) => {
    const [loading, setloading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    const [email, setemail] = useState('');
    const [pword, setpword] = useState('');
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
        else if (pword.length < 6)
            return inValidator(true, 'Password Should at least be 6 characters');
        else {
            setloading(true);
            auth()
                .signInWithEmailAndPassword(email, pword)
                .then(() => {
                    console.log('User signed in!');
                    setloading(false);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'LoggedInContainer' }],
                    });
                })
                .catch(error => {
                    console.log(error);

                    if (error.code === 'auth/user-not-found')
                        inValidator(true, 'Incorrect Credentials');
                    else if (error.code === 'auth/invalid-login')
                        inValidator(true, 'Invalid Login');

                    setloading(false);
                });
        }
    };
    const validateEmail = () => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    };


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