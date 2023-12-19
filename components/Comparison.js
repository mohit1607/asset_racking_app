import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, TextInput, StatusBar, Image, StyleSheet, Alert, ImageBackground } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
const { width, height } = Dimensions.get('window');
import Icons from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';

const Comparison = ({ navigation, route }) => {

    const [loading, setloading] = useState(false);
    const [tableHead, settableHead] = useState(['', 'Scan', 'SAP']);
    const [tableTitle, settableTitle] = useState([]);
    const [tableData, settableData] = useState([]);
    const [dummyData, setdummyData] = useState([{ AssetTag: '123456' }, { AssetTag: '1234567' }, { AssetTag: '12365' }]);

    useEffect(() => {
        const { scanData } = route.params;
        console.log('scanData', scanData);
        if (scanData.length > 0) {
            let titleDtata = [];
            let tableDaata = [];
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "SAPDet": scanData
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://demo.vellas.net:94/sap_api/api/Values/PostSAPComparison", requestOptions)
                .then(response => response.text())
                .then(result => {
                    try {

                        var data = JSON.parse(result);
                        // tableDaata(result)
                        data.map(val => {
                            tableDaata.push([val.SCAN, val.SAP]);
                            titleDtata.push(val.AssetTag);
                        })
                        settableTitle([...titleDtata]);
                        settableData([...tableDaata]);

                        console.log('table', tableDaata)
                    }
                    catch (e) {
                        console.log('error', e)
                    }
                })
                .catch(error => console.log('error', error));






        }
    }, [])

    const processData = (data) => {
        return data.map(row => {
            return row.map(cell =>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Icons name={cell == "True" ? "check" : "remove"} size={15} color={cell == "True" ? 'green' : 'red'} />
                </View>
            );
        });
    };

    const processedData = processData(tableData);

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF', }}>
            <StatusBar barStyle="dark-content" backgroundColor="#c4dcf9" />
            <ImageBackground
                source={require('../assets/bg.jpg')}
                resizeMode="stretch"
                style={{ flex: 1, width: '100%' }}
            >
                <ScrollView contentContainerStyle={{ width: '100%', minHeight: height }}>
                    <View style={{ paddingHorizontal: 30, flex: 1, justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                        <View style={{ width: '100%', justifyContent: 'flex-start', marginTop: 30, }}>
                            <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 13, fontWeight: 'bold', paddingTop: 10, marginBottom: 30 }}>Comparison Result</Text>
                            <View style={{ backgroundColor: '#fff', borderRadius: 15, padding: 10 }}>
                                <Table borderStyle={{ borderWidth: 1 }}>
                                    <Row data={tableHead} flexArr={[2, 1, 1]} style={styles.head} textStyle={styles.text} />
                                    <TableWrapper style={styles.wrapper}>
                                        <Col data={tableTitle} style={styles.title} heightArr={[28, 28]} textStyle={styles.text} />
                                        <Rows data={processedData} flexArr={[1, 1]} style={styles.row} textStyle={styles.text} />
                                    </TableWrapper>
                                </Table>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View >
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    wrapper: { flexDirection: 'row' },
    title: { flex: 2, backgroundColor: '#f6f8fa' },
    row: { height: 28 },
    text: { textAlign: 'center', color: '#000' }
});

export default Comparison