/*เอาไว้แสดง อำเภอ จังหวัด รหัสไปรษณีย์*/

import React from 'react';
import {
    View, StyleSheet, Text, ActivityIndicator, Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import Color from '../constants/Colors';

import { Button} from 'react-native-elements';

import * as AddressDB from '../assets/raw_database.json';

import _ from 'lodash';

export default class Address extends React.Component {

    state = {
        titleText: 'เลือกจังหวัด',
        selectAmphoe: null,
        proviceUniq: null,
        amphoeObjList: null,
        zipCode: '',
        isLoading: true,//ไว้ตรวจสอบว่ากำลังโหลดอยู่นะ
    }

    componentDidMount() {
        //props mode คือจะให้แสดงอะไร จังหวัด หรือ อำเภอ
        switch (this.props.mode) {
            case 'province':
                let province = _.map(AddressDB, 'province');
                let proviceUniq = _.uniq(province);
                //ทำการ set state เป็นจังหวัดต่างๆในฐานข้อมูล
                this.setState({
                    proviceUniq,
                    titleText: 'เลือกจังหวัด',
                    isLoading: false, //โหลดเสร็จแระ
                });
                break;
            case 'amphoe':
                //จะต้องมีการเลือกจังหวัดก่อนนะ ไม่งั้นไม่ทำงาน
                if (this.props.province !== '') {
                    //filter ทำการดึงรายการที่ระบุจังหวัดที่ต้องการ จะได้ list of object แต่จะมีซ้ำกันอยู่
                    //uniqBy ทำให้ list ที่ซ้ำกันโดยเลือกที่อำเภอ จะได้ list of object ที่เป็นอำเภอไม่ซ้ำกันในจังหวัดที่ระบุ
                    let amphoeObjList = _.uniqBy(_.filter(AddressDB, (ad) => { return ad.province == this.props.province }), 'amphoe');
                    this.setState({
                        amphoeObjList,
                        titleText: 'เลือกอำเภอ',
                        isLoading:false, //โหลดเสร็จแระ
                    });
                }
                else {
                    Alert.alert('ข้อผิดพลาด', 'กรุณาเลือกจังหวัดก่อน');
                }
                break;
        }
    }


    provinceList = () => {
        switch (this.props.mode) {
            case 'province':
                if (this.state.proviceUniq !== null) {
                    return (this.state.proviceUniq.map((x, i) => {
                        return (<Picker.Item label={x} key={i + 1} value={String(x)} />)
                    }));
                }
                break;
            case 'amphoe':
                if (this.state.amphoeObjList !== null) {
                    return (this.state.amphoeObjList.map((x, i) => {
                        return (<Picker.Item label={x.amphoe} key={i + 1} value={x.amphoe} />)
                    }));
                }
                break;
            default:
                return (<Picker.Item label='ไม่มีข้อมูล' value='' />);
                break;
        }

    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{ alignItems: 'flex-start', marginTop: 10, marginLeft: 10 }}>
                    <Text style={styles.titleTextPrefix}>{this.state.titleText}</Text>
                </View>
                {this.state.isLoading ? (
                    <View style={{ alignItems: 'center' }}>
                        <ActivityIndicator size="small" animating={this.state.isLoading} />
                    </View>
                ) : (
                        <Picker
                            selectedValue={this.props.selectValue}
                            style={styles.pickerStyle}
                            itemStyle={styles.pickerItemStyle}
                            onValueChange={itemValue => this.props.onAddressChang(itemValue)}
                        >
                            <Picker.Item label='กรุณาเลือกรายการ' key={0} value='' />
                            {this.provinceList()}
                        </Picker>
                    )}

                <View style={{ alignItems: 'center' }}>
                    <Button
                        titleStyle={styles.buttonTitleStyle}
                        buttonStyle={styles.buttonStyle}
                        title="ตกลง"
                        onPress={this.props.onAddressPress}
                    />
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    inputStyle: {
        width: 250,
        fontFamily: 'Kanit-Light',
        fontSize: 14,
    },
    inputTitleStyle: {
        fontFamily: 'Kanit-Regular',
        fontSize: 14,
    },
    titleTextPrefix: {
        fontFamily: 'Kanit-Regular',
        fontSize: 14,
        color: 'gray',
    },
    pickerStyle: {
        color: '#344953',
        justifyContent: 'center',
        width: '100%',
        height: 250,
    },
    pickerItemStyle: {
        fontFamily: 'Kanit-Light',
        fontSize: 14,
    },
    buttonTitleStyle: {
        fontFamily: 'Kanit-Medium',
        color: Color.buttonText,
        fontSize: 14,
    },
    buttonStyle: {
        borderRadius: 20,
        width: 200,
        backgroundColor: Color.backgroundColor,
        marginBottom: 5,
    },
});