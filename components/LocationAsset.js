import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, TextInput, StatusBar, Image, StyleSheet, Alert, ImageBackground, ActivityIndicator } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
const { width, height } = Dimensions.get('window');
import Icons from 'react-native-vector-icons/FontAwesome';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
const LocationAsset = ({ navigation }) => {

    const [loading, setloading] = useState(false);
    const [showLocation, setshowLocation] = useState(true);
    const [selectedLocation, setselectedLocation] = useState(null);
    const [asset, setasset] = useState([]);
    const [assetDetails, setassetDetails] = useState([]);
    const camerRef = useRef(null)

    useEffect(() => {

    }, [])
    const onSuccess = e => {
        // alert(e.data);
        if (e.data) {
            setloading(false)
            console.log(e.data)
            var jData = JSON.parse(e.data);
            if (jData) {
                if (showLocation) {
                    if (jData.Location) {
                        setasset([jData])
                    }
                    else {
                        Alert.alert('Invalid data')
                    }
                }
                else {
                    if (jData.Asset) {
                        jData.Location = asset[0].Location;
                        console.log('asset', jData)
                        setassetDetails([...assetDetails, jData])
                    }
                    else {
                        Alert.alert('Invalid data')
                    }
                }
            }
            else {
                Alert.alert('Invalid data');
            }

        }
    };

    const addtolocation = () => {
        if (assetDetails.length > 0) {
            var jdata = [...asset];
            jdata[selectedLocation].assets = [...assetDetails];


        }
        else {
            var jdata = [...asset];
            jdata[selectedLocation].assets = [];
        }
        setshowLocation(true);
        setassetDetails([])
    }

    const removeAsset = (index) => {
        var jdata = [...asset];
        jdata.splice(index, 1);
        setasset(jdata)
    }

    const removeAssetDetail = (index) => {
        var jdata = [...assetDetails];
        jdata.splice(index, 1);
        setassetDetails(jdata)
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#FFF', }}>
            <StatusBar barStyle="dark-content" backgroundColor="#c4dcf9" />
            <ImageBackground
                source={require('../assets/bg.jpg')}
                resizeMode="stretch"
                style={{ flex: 1, width: '100%' }}
            >
                <ScrollView contentContainerStyle={{ width: '100%', minHeight: height }}>
                    <View style={{ paddingHorizontal: 30, flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 20 }}>
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
                                <Text style={{ fontSize: width / 18, color: 'white' }}>Scan to add</Text>
                            </TouchableOpacity>

                        </View>
                        {showLocation ? <View style={{ width: '100%', justifyContent: 'flex-start', marginTop: 30, marginBottom: 20, flex: 1 }}>
                            <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 13, fontWeight: 'bold', paddingTop: 10 }}>Location details</Text>
                            {asset.length > 0 && asset.map((value, index) => {
                                return <View style={{ backgroundColor: '#fff', borderRadius: 15, padding: 10, marginTop: 10 }} key={index}>
                                    {/* <View style={{ alignItems: 'flex-end' }}>
                                        <TouchableOpacity onPress={() => {
                                            removeAsset(index)
                                        }}>
                                            <Icons name="minus-circle" size={25} color={'red'} />
                                        </TouchableOpacity>
                                    </View> */}
                                    <View >
                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, paddingLeft: 10 }}>Name: {value.Location}</Text>

                                        </View>
                                        {/* <View style={{ marginBottom: 10 }}>
                                            <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, paddingLeft: 10 }}>Location: {value.location}</Text>

                                        </View> */}
                                        <TouchableOpacity
                                            onPress={() => {
                                                camerRef.current.reactivate()
                                                setshowLocation(false);
                                                setselectedLocation(index);
                                                if (value.assets && value.assets.length > 0) {
                                                    setassetDetails([...value.assets])
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                borderColor: '#79ace7',
                                                borderWidth: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 20,
                                                padding: 10,
                                                marginTop: 20
                                            }}>
                                            <Text style={{ fontSize: width / 18, color: 'black' }}>Add Assets</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            })}
                        </View>

                            :
                            <View style={{ width: '100%', justifyContent: 'flex-start', marginTop: 30, marginBottom: 20, flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 10 }}>
                                    <TouchableOpacity onPress={() => {
                                        setshowLocation(true);
                                        camerRef.current.reactivate();
                                        setassetDetails([])
                                    }}>
                                        <Icons name="chevron-left" size={25} color={'black'} />
                                    </TouchableOpacity>
                                    <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 13, fontWeight: 'bold', marginLeft: 10 }}>Add Assets ({assetDetails.length})</Text>
                                </View>
                                {assetDetails.length > 0 && assetDetails.map((value, index) => {
                                    return <View style={{ backgroundColor: '#fff', borderRadius: 15, padding: 10, marginTop: 10 }} key={index}>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => {
                                                removeAssetDetail(index)
                                            }}>
                                                <Icons name="minus-circle" size={25} color={'red'} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, paddingLeft: 10 }}>Tag: {value.Asset}</Text>

                                        </View>
                                        {/* <View style={{ marginBottom: 10 }}>
                                            <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, paddingLeft: 10 }}>Name: {value.AssetName}</Text>

                                        </View>
                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, paddingLeft: 10 }}>Model: {value.FrgnName}</Text>

                                        </View>
                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 18, paddingLeft: 10 }}>Location: {value.LocationName}</Text>

                                        </View> */}
                                    </View>
                                })}
                            </View>}
                        {asset && asset.length > 0 && (showLocation ? <TouchableOpacity
                            onPress={() => {
                                console.log(asset);
                                var allAssets = [];
                                for (i = 0; i < asset.length; i++) {
                                    if (!asset[i].assets || !asset[i].assets.length > 0) {
                                        Alert.alert(`Kindly add asset to this location to compare`);
                                        allAssets = [];
                                        break;
                                    }
                                    allAssets = [...allAssets, ...asset[i].assets];

                                }
                                if (allAssets.length > 0) {
                                    navigation.navigate('Comparison', {
                                        scanData: allAssets
                                    })
                                }

                            }}
                            style={{
                                width: '100%',
                                backgroundColor: '#79ace7',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 20,
                                padding: 10,
                            }}>
                            <Text style={{ fontSize: width / 18, color: 'white' }}>Compare with SAP data</Text>
                        </TouchableOpacity> : <TouchableOpacity
                            onPress={addtolocation}
                            style={{
                                width: '100%',
                                backgroundColor: '#79ace7',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 20,
                                padding: 10,
                            }}>
                            <Text style={{ fontSize: width / 18, color: 'white' }}>Update location</Text>
                        </TouchableOpacity>)}
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

export default LocationAsset