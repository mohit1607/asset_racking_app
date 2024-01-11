import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, TextInput, StatusBar, Image, StyleSheet, Alert, ImageBackground, ActivityIndicator } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
const { width, height } = Dimensions.get('window');
import Icons from 'react-native-vector-icons/FontAwesome';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { getDomainSAP } from './functions/helper';

const Comparison = ({ navigation, route }) => {

    const [loading, setloading] = useState(false);
    const [tableHead, settableHead] = useState(['', 'Scan', 'SAP', 'Details']);
    const [tableTitle, settableTitle] = useState([]);
    const [tableData, settableData] = useState([]);
    const [dummyData, setdummyData] = useState([{ AssetTag: '123456' }, { AssetTag: '1234567' }, { AssetTag: '12365' }]);

    useEffect(() => {
        const { scanData } = route.params;
        console.log('scanData', scanData);
        if (scanData.length > 0) {
            setloading(true);
            var fScan = [];
            for (var i = 0; i < scanData.length; i++) {
                fScan.push({ AssetTag: scanData[i].Asset })
            }
            let titleDtata = [];
            let tableDaata = [];
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            console.log('fScan', JSON.stringify({
                "token": "CA644C93-30A6-45B7-8B54-7837C5664086",
                "LocationName": scanData[0].Location,
                "SAPDet": fScan
            }));
            var raw = JSON.stringify({
                "token": "CA644C93-30A6-45B7-8B54-7837C5664086",
                "LocationName": scanData[0].Location,
                "SAPDet": fScan
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            var domain = getDomainSAP();
            fetch(domain + "/sap_api/api/Values/PostSAPComparison", requestOptions)
                .then(response => response.text())
                .then(result => {
                    try {
                        setloading(false);
                        var data = typeof (result) == 'string' ? JSON.parse(result) : result;
                        // var data = JSON.parse(result);
                        // tableDaata(result)
                        data.map(val => {
                            tableDaata.push([val.AssetTag, val.SCAN, val.SAP, convertContent(val.SCAN, val.SAP)]);
                            // titleDtata.push(val.AssetTag);
                        })
                        settableTitle([...titleDtata]);
                        tableDaata.sort((a, b) => {
                            // Convert "True" and "False" to boolean values for comparison
                            const boolA = a[1] === "True";
                            const boolB = b[1] === "True";

                            // Sort "True" values before "False" values
                            return boolB - boolA;
                        });
                        settableData([...tableDaata]);

                        console.log('table', tableDaata)
                    }
                    catch (e) {
                        setloading(false);
                        console.log('error', e)
                    }
                })
                .catch(error => {
                    setloading(false);
                    console.log('error', error)
                });
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

    const convertContent = (scan, sap) => {

        if (scan == 'True' && sap == 'True') {
            return 'Matching';
        }
        else if (scan == 'True' && sap == 'False') {
            return 'Asset not belong to this location';

        }
        else if (scan == 'False' && sap == 'True') {
            return 'Asset missing from this location';

        }
        else if (scan == 'False' && sap == 'False') {
            return 'No information found';

        }
    }


    const modifiedTableData = () => {
        return tableData.map(row => [
            row[0], // Keep the 1st column as it is
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Icons name={row[1] == "True" ? "check" : "remove"} size={15} color={row[1] == "True" ? 'green' : 'red'} />
            </View>,
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Icons name={row[2] == "True" ? "check" : "remove"} size={15} color={row[2] == "True" ? 'green' : 'red'} />
            </View>,
            <Text style={{ color: '#000', textAlign: 'left', fontWeight: 'bold' }}> {row[3]}</Text>

            // Keep the 4th column as it is
            // Add more columns if needed
        ]);
    }

    const processedData = modifiedTableData(tableData);

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
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10, marginBottom: 30 }}>
                                <Text style={{ color: '#000', textAlign: 'left', fontSize: width / 20, fontWeight: 'bold' }}>Comparison Result</Text>
                                {loading && <ActivityIndicator color='red' />}
                            </View>
                            <View style={{ backgroundColor: '#fff', borderRadius: 15, padding: 10 }}>
                                <Table borderStyle={{ borderWidth: 1 }}>
                                    <Row data={tableHead} flexArr={[1, 1, 1, 2]} style={styles.head} textStyle={styles.text} />
                                    <TableWrapper style={styles.wrapper}>
                                        <Rows data={processedData} flexArr={[1, 1, 1, 2]} style={styles.row} textStyle={styles.text} />
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