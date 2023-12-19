import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, TextInput, StatusBar, Image, StyleSheet, Alert, ImageBackground } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
const { width, height } = Dimensions.get('window');
import Icons from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';

const Home = ({ navigation }) => {

    const [loading, setloading] = useState(false);
    const [user, setuser] = useState(null);

    useEffect(() => {
        const { currentUser } = auth();
        console.log(currentUser)
        if (currentUser) {
            setuser(currentUser.email)
        } else {

            navigation.reset({
                index: 0,
                routes: [{ name: 'ClientSign' }],
            });
        }
    }, [])

    const onLogOut = () => {
        auth().signOut();
        navigation.reset({
            index: 0,
            routes: [{ name: 'ClientSign' }],
        });
    };


    return (
        <View style={{ flex: 1, backgroundColor: '#FFF', }}>
            <StatusBar barStyle="dark-content" backgroundColor="#c4dcf9" />
            <ImageBackground
                source={require('../assets/bg.jpg')}
                resizeMode="stretch"
                style={{ flex: 1, width: '100%' }}
            >
                <ScrollView contentContainerStyle={{ width: '100%', minHeight: height }}>
                    <View style={{ paddingHorizontal: 30, flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        {/* <Icons name="user-circle-o" size={width * 0.5} color={'#000'} /> */}
                        <Text style={{ color: '#000', textAlign: 'center', fontSize: width / 13, paddingTop: 10 }}>Welcome,</Text>
                        <Text style={{ color: '#000', textAlign: 'center', fontSize: width / 13, paddingTop: 10 }}>{user}</Text>
                        <View style={{ marginHorizontal: 20, marginTop: 10 }}>

                            <TouchableOpacity
                                onPress={onLogOut}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#79ace7',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 20,
                                    padding: 10,
                                    width: 200
                                }}>
                                <Text style={{ fontSize: width / 18, color: 'white' }}>Log out</Text>
                            </TouchableOpacity>

                        </View>


                        <View style={{ width: '100%', justifyContent: 'flex-start', marginTop: 30 }}>
                            <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 13, fontWeight: 'bold', paddingTop: 10 }}>Scan Operation</Text>
                            <View style={{ backgroundColor: '#fff', borderRadius: 15, padding: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Image
                                        source={require('../assets/scan1.png')}
                                        resizeMode="contain"
                                        style={{ width: 50, height: 50, borderRadius: 10, marginRight: 10 }}
                                    />
                                    <TouchableOpacity onPress={() => navigation.navigate('AssetTracking')}><Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, }}>Extract Asset Info</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Image
                                        source={require('../assets/scan2.png')}
                                        resizeMode="contain"
                                        style={{ width: 50, height: 50, borderRadius: 10, marginRight: 10 }}
                                    />
                                    <TouchableOpacity onPress={() => navigation.navigate('LocationDetails')}><Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, }}>Extract Location Data</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Image
                                        source={require('../assets/scan3.png')}
                                        resizeMode="contain"
                                        style={{ width: 50, height: 50, borderRadius: 10, marginRight: 10 }}
                                    />
                                    <TouchableOpacity onPress={() => navigation.navigate('LocationAsset')}><Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, }}>Compare Data</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={{ width: '100%', justifyContent: 'flex-start', marginTop: 30 }}>
                            <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 13, fontWeight: 'bold', paddingTop: 10 }}>Cloud Data</Text>
                            <View style={{ backgroundColor: '#fff', borderRadius: 15, padding: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Image
                                        source={require('../assets/scan4.png')}
                                        resizeMode="contain"
                                        style={{ width: 50, height: 50, borderRadius: 10, marginRight: 10 }}
                                    />
                                    <TouchableOpacity>
                                        <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, }}>Saved Data</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View >
    )
}

const styleSheet = StyleSheet.create({
    attachment: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        marginTop: 10,
        // marginHorizontal: 5,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
            },
            android: {
                elevation: 3,
            },
        }),
    },
})

export default Home