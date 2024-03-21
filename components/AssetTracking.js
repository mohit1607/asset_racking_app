import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, TextInput, StatusBar, Image, StyleSheet, Alert, ImageBackground, ActivityIndicator } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
const { width, height } = Dimensions.get('window');
import Icons from 'react-native-vector-icons/FontAwesome';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { getDomainSAP } from './functions/helper';

const AssetTracking = ({ navigation }) => {

    const [loading, setloading] = useState(false);
    const [asset, setasset] = useState({ tag: 'XX XXX XXXX', name: 'XX XXX XXX', location: 'XX XX XXX' });
    const camerRef = useRef(null)

    useEffect(() => {

    }, [])
    const onSuccess = e => {
        // alert(e.data);
        if (e.data) {
            console.log(e.data)
            var jData = JSON.parse(e.data);

            if (jData && jData.Asset) {
                setasset({ Asset: jData.Asset });
                setloading(true);
                var domain = getDomainSAP();
                const url = `${domain}/sap_api/api/values/GetAssetlist?token=743F1F69-168A-489E-BC19-5ABF98E8000B&location=&assetcode=${jData.Asset}`;
                console.log(url);
                fetch(url)
                    .then(res => res.text())
                    .then(data => {
                        setloading(false);
                        console.log(data);
                        var resp = typeof (data) == 'string' ? JSON.parse(data) : data;
                        // if (data && JSON.parse(data).length > 0) {

                        if (resp[0]) {
                            // resp[0].Location = resp[0].Location;
                            // delete (resp[0].Location)
                            setasset({ ...jData, ...resp[0] })
                        }
                        else {
                            setloading(false);
                            Alert.alert('Data not found in SAP')
                        }
                        // }
                        // else {
                        //     // Alert.alert('Wrong credentials!')
                        //     setassetDetails([])
                        // }
                    })
                    .catch(e => {
                        setloading(false);
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
                            flashMode={RNCamera.Constants.FlashMode.off}

                        />
                        <View style={{ marginHorizontal: 20, marginTop: 10 }}>

                            <TouchableOpacity
                                onPress={() => { camerRef.current.reactivate() }}
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
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 13, fontWeight: 'bold', paddingRight: 10 }}>Asset Information</Text>
                                {loading && <ActivityIndicator color='red' />}
                            </View>
                            <View style={{ backgroundColor: '#fff', borderRadius: 15, padding: 10, marginTop: 10 }}>
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, paddingLeft: 10, marginBottom: 10 }}>Asset Serial No.</Text>
                                    <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, borderWidth: 1, padding: 10, borderColor: '#rgba(0,0,0,0.4)' }}>{asset.Asset}</Text>

                                </View>
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, paddingLeft: 10, marginBottom: 10 }}>Asset Name</Text>
                                    <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, borderWidth: 1, padding: 10, borderColor: '#rgba(0,0,0,0.4)' }}>{asset.AssetName}</Text>

                                </View>
                                {/* <View style={{ marginBottom: 10 }}>
                                    <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, paddingLeft: 10, marginBottom: 10 }}>Asset Model</Text>
                                    <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, borderWidth: 1, padding: 10, borderColor: '#rgba(0,0,0,0.4)' }}>{asset.FrgnName}</Text>

                                </View> */}
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, paddingLeft: 10, marginBottom: 10 }}>Asset Location</Text>
                                    <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, borderWidth: 1, padding: 10, borderColor: '#rgba(0,0,0,0.4)' }}>{asset.Location}</Text>

                                </View>
                            </View>
                        </View>
                        {asset && <TouchableOpacity
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
                                marginBottom: 20
                            }}>
                            <Text style={{ fontSize: width / 18, color: 'white' }}>Compare with SAP data</Text>
                        </TouchableOpacity>}
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

export default AssetTracking