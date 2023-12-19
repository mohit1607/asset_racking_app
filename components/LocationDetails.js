import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, TextInput, StatusBar, Image, StyleSheet, Alert, ImageBackground, ActivityIndicator } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
const { width, height } = Dimensions.get('window');
import Icons from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
const LocationDetails = ({ navigation }) => {

    const [loading, setloading] = useState(false);
    const [asset, setasset] = useState({ id: 'XX XXX XXXX', name: 'XX XXX XXX', location: 'XX XX XXX' });
    const [assetDetails, setassetDetails] = useState([]);
    const camerRef = useRef(null)

    useEffect(() => {

    }, [])
    const onSuccess = e => {
        // alert(e.data);
        if (e.data) {
            // setloading(false)
            console.log(e.data)
            var jData = JSON.parse(e.data);
            if (jData && jData.id) {
                setasset(jData);
                const url = `https://demo.vellas.net:94/sap_api/api/values/GetAssetlist?token=743F1F69-168A-489E-BC19-5ABF98E8000B&location=${jData.id}&assetcode=`;
                console.log(url);
                fetch(url)
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        // if (data && JSON.parse(data).length > 0) {

                        setassetDetails(data)
                        // }
                        // else {
                        //     // Alert.alert('Wrong credentials!')
                        //     setassetDetails([])
                        // }
                    })
                    .catch(e => {
                        console.log('error:', e)
                    })
            }
            else {
                Alert.alert('Invalid data');
            }

        }
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
                        <QRCodeScanner
                            ref={camerRef}
                            containerStyle={{ width: 300, height: 300, justifyContent: 'center', alignItems: 'center' }}
                            cameraStyle={{ width: 200, height: 200 }}
                            markerStyle={{ width: 180, height: 180, borderRadius: 8 }}
                            onRead={onSuccess}
                            showMarker={true}
                            flashMode={RNCamera.Constants.FlashMode.torch}

                        />
                        <View style={{ marginHorizontal: 20, marginTop: 10 }}>

                            <TouchableOpacity
                                onPress={() => { setloading(true); camerRef.current.reactivate() }}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#79ace7',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 20,
                                    padding: 10,
                                    width: 200
                                }}>
                                <Text style={{ fontSize: width / 18, color: 'white' }}>Scan again</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{ width: '100%', justifyContent: 'flex-start', marginTop: 30, marginBottom: 20 }}>
                            <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 13, fontWeight: 'bold', paddingTop: 10 }}>Location Information</Text>
                            <View style={{ backgroundColor: '#fff', borderRadius: 15, padding: 10, marginTop: 10 }}>
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, paddingLeft: 10, marginBottom: 10 }}>Location Id</Text>
                                    <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, borderWidth: 1, padding: 10, borderColor: '#rgba(0,0,0,0.4)' }}>{asset.id}</Text>

                                </View>
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, paddingLeft: 10, marginBottom: 10 }}>Location Name</Text>
                                    <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, borderWidth: 1, padding: 10, borderColor: '#rgba(0,0,0,0.4)' }}>{asset.location}</Text>
                                </View>
                            </View>
                        </View>

                        {assetDetails && assetDetails.length > 0 && <View style={{ width: '100%', justifyContent: 'flex-start', marginTop: 30, marginBottom: 20 }}>
                            <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 13, fontWeight: 'bold', paddingTop: 10 }}>Asset Information ({assetDetails.length})</Text>
                            {assetDetails && assetDetails.map((value, index) => {
                                return <View key={index} style={{ backgroundColor: '#fff', borderRadius: 15, padding: 10, marginTop: 10 }}>
                                    <View style={{ marginBottom: 10 }}>
                                        <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, paddingLeft: 10, marginBottom: 10 }}>Asset Tag</Text>
                                        <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, borderWidth: 1, padding: 10, borderColor: '#rgba(0,0,0,0.4)' }}>{value.AssetTag}</Text>

                                    </View>
                                    <View style={{ marginBottom: 10 }}>
                                        <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, paddingLeft: 10, marginBottom: 10 }}>Asset Name</Text>
                                        <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, borderWidth: 1, padding: 10, borderColor: '#rgba(0,0,0,0.4)' }}>{value.AssetName}</Text>
                                    </View>
                                    <View style={{ marginBottom: 10 }}>
                                        <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, paddingLeft: 10, marginBottom: 10 }}>Asset Model</Text>
                                        <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, borderWidth: 1, padding: 10, borderColor: '#rgba(0,0,0,0.4)' }}>{value.FrgnName}</Text>
                                    </View>
                                </View>
                            })}
                        </View>}

                        {/* {asset && <TouchableOpacity
                            onPress={() => navigation.navigate('Comparison', {
                                scanData: [asset]
                            })}
                            style={{
                                width: '100%',
                                backgroundColor: '#79ace7',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 20,
                                padding: 10,
                            }}>
                            <Text style={{ fontSize: width / 18, color: 'white' }}>Compare with SAP data</Text>
                        </TouchableOpacity>} */}
                    </View>
                </ScrollView>
            </ImageBackground>
        </View >
    )
}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    }
});

export default LocationDetails