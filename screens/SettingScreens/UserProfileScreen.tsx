import React from 'react';
import {
    View, StyleSheet, ActivityIndicator, Keyboard,
    TouchableOpacity, TouchableWithoutFeedback, Platform, Alert,
} from 'react-native';
import { Text } from '../../components/Themed';
import { ListItemTheme, ListItemContent, ListItemSubtitle, ListItemChevron, ListItemTitle } from '../../components/ListItemTheme';
import { Picker } from '@react-native-picker/picker';
import { Overlay, Input } from 'react-native-elements';
import { ButtonTheme } from '../../components/ButtonTheme';
import Address from '../../components/Address';
import * as AddressDB from '../../assets/raw_database.json';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as Location from 'expo-location';
import {
    showUserProfile, namePrefixChanged, editUserProfile, nameChanged, surNameChanged, telChanged, streetChanged, provinceChanged, editAddressUserProfile,
    zipcodeChanged, amphoeChanged, saveUserProfile,
} from '../../redux/actions/index';

import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

interface Props {
    navigation: any,
    userProfileLoading: any,
    userProfileExists: any,
    userProfileErrMessage: String,
    address: any,
    showUserProfile: any,
    namePrefix: any,
    name: any,
    surName: any,
    tel: any,
    expoPushToken: any,
    namePrefixChanged: any,
    userProfileEditErrMessage: any,
    editUserProfile: any,
    userProfileEditLoading: any,
    nameChanged: any,
    surNameChanged: any,
    telChanged: any,
    streetChanged: any,
    provinceChanged: any,
    userProfileAddLoading: any,
    editAddressUserProfile: any,
    zipcodeChanged: any,
    amphoeChanged: any,
    saveUserProfile: any,
}

class UserProfileScreen extends React.Component<Props>{
    state = {
        //เอาไว้แสดง Overlay
        isnamePrefixChoiceVisible: false,
        isNameVisible: false,
        isSurNameVisible: false,
        isTelVisible: false,
        isAddressVisible: false,
        isGPSLoadingVisible: false,
        //เอาไว้โชว์ Overlay อำเภอ และ จังหวัด
        isProvince: false,
        isAmphoe: false,

        isUserProfileEdit: false,//มีการแก้ไขมั้ย ยังไม่มีการใช้
        isUserProfileAdd: false,//มีการเพิ่มมั้ย ยังไม่มีการใช้
        //เอาไว้ทดสอบ
        address: {
            street: '',
            province: '',
            amphoe: '',
            zipcode: '',
        },
        expoPushToken: '',//เอาไว้เก็บ expo push token

    };

    //เอาไว้ลงทะเบียน จะได้ expo push token
    registerForPushNotificationsAsync = async () => {
        if (Constants.isDevice) {//เป็นอุปกรณ์
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {//ถ้าเดิมยังไม่อนุญาติ
                const { status } = await Notifications.requestPermissionsAsync();//ทำการขออนุญาติ
                finalStatus = status;//เก็บสถานะไว้
            }
            if (finalStatus !== 'granted') {//ถ้าไม่อนุญาติ
                Alert.alert('มีข้อความเตือน', 'ระบบต้องการ push token สำหรับ push notification!');
                return;//ออกจากฟังก์ชั่นเลย
            }
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            this.setState({ expoPushToken: token });//Set expo push token
        } else {
            Alert.alert('มีข้อความเตือน', 'Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    }

    goToScreen = async (screen: any) => {
        //ตัวเลือกให้ Overlay ไหนแสดงขึ้นมา
        switch (screen) {
            case 'namePrefix':
                this.setState({ isnamePrefixChoiceVisible: true });
                break;
            case 'name':
                this.setState({ isNameVisible: true });
                break;
            case 'surName':
                this.setState({ isSurNameVisible: true });
                break;
            case 'tel':
                this.setState({ isTelVisible: true });
                break;
            case 'address':
                //ทำการเรียกหน้าที่อยู่ โดยถ้าเป็นการเพิ่มข้อมูลครั้งแรกให้ระบุ GPS ไปเลย
                if (!this.props.userProfileExists) {
                    //ถ้าไม่มีข้อมูลใน DB
                    let { status } = await Location.requestForegroundPermissionsAsync();
                    if (status == 'granted') {
                        try {
                            //ถ้าอนุญาติ คือ จะต้องมีการขอระบบให้ใช้ Location ด้วย
                            this.setState({ isGPSLoadingVisible: true });

                            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                            const place = await Location.reverseGeocodeAsync({
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude
                            });

                            await this.showAddressFromLocation(place);

                            //เมื่อระบุเรียบร้อย ก็ให้ปิดหน้าโหลดลง
                            this.setState({ isGPSLoadingVisible: false });
                        }
                        catch (err: any) {
                            Alert.alert('มีข้อผิดพลาด', err.message);
                        }
                    }
                }
                this.setState({ isAddressVisible: true });
                break;
        }
    }

    componentDidMount() {
        //ทำการเรียก แสดงข้อมูลผู้ใช้
        this.props.showUserProfile();

    }

    showAddressFromLocation = async (place: any) => {
        const city = place[0].city; //อำเภอ
        const districe = place[0].district; //ตำบล
        const name = place[0].name; //ที่อยู่
        const postalCode = place[0].postalCode; //รหัสไปรษณีย์
        const region = place[0].region; //จังหวัด

        if (name != null && districe !== null) {
            //ทำการเปลี่ยนที่อยู่
            this.props.streetChanged(`${name} ต.${districe}`);
        }
        else {
            Alert.alert('ข้อผิดพลาด', 'ไม่มีที่อยู่จาก GPS');
        }

        if (region !== null) {
            //ทำการเปลี่ยนจังหวัด
            this.props.provinceChanged(region);
        }
        else {
            Alert.alert('ข้อผิดพลาด', 'ไม่มีจังหวัดจาก GPS');
        }

        if (city !== null) {
            //ทำการแสดงอำเภอ
            this.props.amphoeChanged(city);
        }
        else {
            Alert.alert('ข้อผิดพลาด', 'ไม่มีอำเภอจาก GPS');
        }

        if (postalCode != null) {
            //ทำการแสดงรหัสไปรษณีย์
            this.props.zipcodeChanged(postalCode);
        }
        else {
            Alert.alert('ข้อผิดพลาด', 'ไม่มีรหัสไปรษณีย์จาก GPS');
        }

    }

    /**
     * เอาไว้หาข้อมูลใน OBJ ของการ Query ข้อมูลผู้ใช้จาก users 
     * @param find ระบุ key
     * @returns value ตาม key ถ้าไม่มีจะแสดงว่า คลิกเพื่อเพิ่มข้อมูล
     */
    findContent = (find: String) => {
        switch (find) {
            case 'คำนำหน้าชื่อ':
                if (this.props.namePrefix === '') {
                    return 'คลิกเพื่อเพิ่มข้อมูล';
                }
                else {
                    return this.props.namePrefix;
                }
            case 'ชื่อ':
                if (this.props.name === '') {
                    return 'คลิกเพื่อเพิ่มข้อมูล';
                }
                else {
                    return this.props.name;
                }
            case 'นามสกุล':
                if (this.props.surName === '') {
                    return 'คลิกเพื่อเพิ่มข้อมูล';
                }
                else {
                    return this.props.surName;
                }
            case 'เบอร์โทร':
                if (this.props.tel === '') {
                    return 'คลิกเพื่อเพิ่มข้อมูล';
                }
                else {
                    return this.props.tel;
                }
            case 'ที่อยู่':
                if (this.props.address.zipcode === '') {
                    return 'คลิกเพื่อเพิ่มข้อมูล';
                }
                else {
                    return `${this.props.address.street} ${this.props.address.amphoe} ${this.props.address.province} ${this.props.address.zipcode}`;
                }
        }
    }
    /**
     * ไว้แสดง คำนำหน้า ชื่อ
     * @returns Picker คำนำหน้าชื่อ
     */
    namePrefixListItem = () => {
        let listItem = ['นาย', 'นาง', 'นางสาว'];
        return (listItem.map((x, i) => {
            return (<Picker.Item style={styles.pickerItemStyle} label={x} key={i + 1} value={x} />)
        }));
    }

    //แก้ไขหมด ยกเว้น ที่อยู่ มันซับซ้อนกว่า
    onButtonEditPress = async (key: String) => {
        switch (key) {
            case 'namePrefix':
                this.props.editUserProfile(key, this.props.namePrefix);
                break;
            case 'name':
                this.props.editUserProfile(key, this.props.name);
                break;
            case 'surName':
                this.props.editUserProfile(key, this.props.surName);
                break;
            case 'tel':
                this.props.editUserProfile(key, this.props.tel);
                break;
        }

        //ทำการตรวจสอบว่ามี expoPushToken หรือไม่
        if (this.props.expoPushToken === '') {
            //ถ้ายังไม่มี ก็ทำการขออนุญาติ และบันทึกลงในฐานข้อมูล
            await this.registerForPushNotificationsAsync();
            if (this.state.expoPushToken !== '') {
                this.props.editUserProfile('expoPushToken', this.state.expoPushToken);
            }
        }
    }

    //ให้แสดงการเลือกจังหวัด
    onShowProvince = () => {
        this.setState({
            isAddressVisible: false,
            isProvince: true,
        });
    }

    //ให้แสดงการเลือกอำเภอ
    onShowAmphoe = () => {
        //ตรวจสอบว่าเลือกจังหวัดหรือยัง
        if (this.props.address.province === '') {
            //เรียกให้จังหวัดขึ้นมาเลย
            this.onShowProvince();
        }
        else {
            //ถ้าเลือกจังหวัดแล้ว
            this.setState({
                isAddressVisible: false,
                isAmphoe: true,
            });
        }
    }

    onButtonAddressEditPress = async () => {
        //ตรวจสอบเบื้องต้น
        if (this.props.address.street !== '' && this.props.address.province !== '' && this.props.address.amphoe !== '' && this.props.address.zipcode) {
            this.props.editAddressUserProfile(this.props.address.street, this.props.address.province, this.props.address.amphoe, this.props.address.zipcode);
        }
        else {
            Alert.alert('ข้อผิดพลาด', 'ข้อมูลไม่ครบถ้วน');
        }

        //ทำการตรวจสอบว่ามี expoPushToken หรือไม่
        if (this.props.expoPushToken === '') {
            //ถ้ายังไม่มี ก็ทำการขออนุญาติ และบันทึกลงในฐานข้อมูล
            await this.registerForPushNotificationsAsync();
            if (this.state.expoPushToken !== '') {
                this.props.editUserProfile('expoPushToken', this.state.expoPushToken);
            }
        }

    }

    //เมื่อกด OK เลือกจังหวัดแล้ว ให้แสดงการเลือก อำเภอเลย
    onProviceOkPress = () => {
        this.setState({
            isProvince: false,
            isAddressVisible: true,
        });

        //เมื่อเลือกจังหวัดแล้ว ให้แสดงการเลือก อำเภอเลย
        this.onShowAmphoe();
    }

    onChangProvince = (province: String) => {
        this.props.provinceChanged(province);
    }

    //เมื่อเลือก จังหวัด และ อำเภอ แล้วกดปุ่ม ตกลง และจะหา zipcode เลย
    onAmphoeOkPress = () => {

        this.setState({
            isAmphoe: false,
            isAddressVisible: true,
        });

        if (this.props.address.province === '') {
            //ถ้าไม่มีการเลือกจังหวัด
            this.onShowProvince();
        }
        else if (this.props.address.amphoe === '') {
            //ถ้าไม่มีการเลือกอำเภอ
            this.onShowAmphoe();
        }
        else {
            //ถ้ามีการเลือกหมดแล้ว

            //หารหัสไปรษณีย์
            let amphoeObjList = _.uniqBy(_.filter(AddressDB, (ad) => { return ad.province == this.props.address.province }), 'amphoe');
            let zipCodeObj = _.filter(amphoeObjList, (ad) => { return ad.amphoe == this.props.address.amphoe });

            if (zipCodeObj.length > 0) {
                //ถ้ามีข้อมูล
                let zipcode = '' + zipCodeObj[0].zipcode + '';
                this.props.zipcodeChanged(zipcode);
            }
            else {
                //ให้เลือกใหม่เลย
                this.onShowProvince();
            }
        }
    }

    onChangAmphoe = (amphoe: String) => {
        this.props.amphoeChanged(amphoe);
    }

    //ไว้สำหรับในกรณีที่เพิ่มข้อมูลผู้ใช้ใหม่เลย
    onButtonAddPress = async () => {
        await this.registerForPushNotificationsAsync();//ทำการลงทะเบียน Push Notifications
        if (this.state.expoPushToken !== '') {
            this.props.saveUserProfile(this.props.namePrefix, this.props.name, this.props.surName, this.props.tel, this.props.address, this.state.expoPushToken);
        }
        else {
            Alert.alert('ข้อผิดพลาด', 'กรุณาอนุญาติการใช้งาน Push Notification ถ้าไม่อย่างงั้นจะบันทึกข้อมูลส่วนตัวไม่ได้');
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    {/*********************************************************************************************************************** */}
                    {/**ส่วนแสดงรายการข้อมูลผู้ใช้ */}
                    <View>
                        {
                            /*ให้แสดงหน้าโหลดก่อน*/
                            this.props.userProfileLoading ?
                                /*ให้แสดง Loading */
                                (
                                    <ActivityIndicator size='large' animating={this.props.userProfileLoading} />
                                ) : (
                                    menuList.map((item, i) => (
                                        <ListItemTheme
                                            key={i}
                                            bottomDivider
                                            Component={TouchableOpacity}
                                            onPress={this.goToScreen.bind(this, item.toScreen)}
                                        >
                                            <ListItemContent>
                                                <ListItemTitle style={styles.titleList}>{item.title}</ListItemTitle>
                                                <ListItemSubtitle><Text style={styles.subTitle}>{this.findContent(item.title)}</Text></ListItemSubtitle>
                                            </ListItemContent>
                                            <ListItemChevron />
                                        </ListItemTheme>
                                    ))
                                )
                        }
                    </View>
                    {/*********************************************************************************************************************** */}
                    {/**ส่วนของ Overlay ในการเพิ่มหรือแก้ไขข้อมูลต่าง */}
                    <Overlay /*คำนำหน้าชื่อ*/
                        isVisible={this.state.isnamePrefixChoiceVisible}
                        overlayStyle={{ width: 300, height: 300, borderRadius: 20 }}
                        onBackdropPress={() => this.setState({ isnamePrefixChoiceVisible: false })}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <View style={styles.containerOverlayView}>
                                <View style={{ alignItems: 'flex-start' }}>
                                    <Text style={styles.titleTextPrefix}>คำนำหน้าชื่อ</Text>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Picker
                                        style={styles.pickerStyle}
                                        itemStyle={styles.pickerItemStyle}
                                        selectedValue={this.props.namePrefix}
                                        onValueChange={prefix => this.props.namePrefixChanged(prefix)}
                                    >
                                        <Picker.Item style={styles.pickerItemStyle} label='กรุณาเลือกคำนำหน้าชือ' value='' />
                                        {this.namePrefixListItem()}
                                    </Picker>

                                    {

                                        /**ถ้ามีข้อมูลให้แสดงปุ่มบันทึกการแก้ไข ถ้าไม่มีข้อมูลให้แสดงปุ่มตกลง */
                                        this.props.userProfileExists ? (
                                            /*แสดงปุ่มสำหรับแก้ไข*/
                                            <View>
                                                <Text>{this.props.userProfileEditErrMessage}</Text>
                                                <ButtonTheme
                                                    title="บันทึกการแก้ไข"
                                                    onPress={this.onButtonEditPress.bind(this, 'namePrefix')}
                                                    loading={this.props.userProfileEditLoading}
                                                />
                                                <ButtonTheme
                                                    title="ปิดหน้านี้"
                                                    onPress={() => this.setState({ isnamePrefixChoiceVisible: false })}
                                                />
                                            </View>
                                        ) :
                                            (
                                                /*แสดงปุ่มสำหรับเพิ่ม*/
                                                <ButtonTheme
                                                    title="ปิดหน้านี้"
                                                    onPress={() => this.setState({ isnamePrefixChoiceVisible: false })}
                                                />
                                            )

                                    }
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Overlay>
                    {/**************************************************************************************************************************** */}
                    <Overlay /*ชื่อ*/
                        isVisible={this.state.isNameVisible}
                        overlayStyle={{ width: 300, height: 300, borderRadius: 20 }}
                        onBackdropPress={() => this.setState({ isNameVisible: false })}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <View style={styles.containerOverlayView}>
                                <Input
                                    value={this.props.name}
                                    onChangeText={text => this.props.nameChanged(text)}
                                    inputStyle={styles.inputStyle}
                                    label='ชื่อ'
                                    labelStyle={styles.inputTitleStyle}
                                />
                                <View style={{ alignItems: 'center' }}>
                                    {
                                        this.props.userProfileExists ? (
                                            /*แสดงปุ่มสำหรับแก้ไข*/
                                            <View>
                                                <ButtonTheme
                                                    title="บันทึกการแก้ไข"
                                                    onPress={this.onButtonEditPress.bind(this, 'name')}
                                                    loading={this.props.userProfileEditLoading}
                                                />
                                                <ButtonTheme
                                                    title="ปิดหน้านี้"
                                                    onPress={() => this.setState({ isNameVisible: false })}
                                                />
                                            </View>
                                        ) :
                                            (
                                                /*แสดงปุ่มสำหรับเพิ่ม*/
                                                <ButtonTheme
                                                    title="ปิดหน้านี้"
                                                    onPress={() => this.setState({ isNameVisible: false })}
                                                />
                                            )
                                    }
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Overlay>
                    {/*************************************************************************************************************** */}
                    <Overlay /*นามสกุล*/
                        isVisible={this.state.isSurNameVisible}
                        overlayStyle={{ width: 300, height: 300, borderRadius: 20 }}
                        onBackdropPress={() => this.setState({ isSurNameVisible: false })}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <View style={styles.containerOverlayView}>
                                <Input
                                    value={this.props.surName}
                                    onChangeText={text => this.props.surNameChanged(text)}
                                    inputStyle={styles.inputStyle}
                                    label='นามสกุล'
                                    labelStyle={styles.inputTitleStyle}
                                />
                                <View style={{ alignItems: 'center' }}>
                                    {
                                        /**ถ้ามีข้อมูลให้แสดงปุ่มบันทึกการแก้ไข ถ้าไม่มีข้อมูลให้แสดงปุ่มตกลง */
                                        this.props.userProfileExists ? (
                                            /*แสดงปุ่มสำหรับแก้ไข*/
                                            <View>
                                                <ButtonTheme
                                                    title="บันทึกการแก้ไข"
                                                    onPress={this.onButtonEditPress.bind(this, 'surName')}
                                                    loading={this.props.userProfileEditLoading}
                                                />
                                                <ButtonTheme
                                                    title="ปิดหน้านี้"
                                                    onPress={() => this.setState({ isSurNameVisible: false })}
                                                />
                                            </View>
                                        ) :
                                            (
                                                /*แสดงปุ่มสำหรับเพิ่ม*/
                                                <ButtonTheme
                                                    title="ปิดหน้านี้"
                                                    onPress={() => this.setState({ isSurNameVisible: false })}
                                                />
                                            )
                                    }
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Overlay>
                    {/****************************************************************************************************** */}
                    <Overlay /*เบอร์โทร*/
                        isVisible={this.state.isTelVisible}
                        overlayStyle={{ width: 300, height: 300, borderRadius: 20 }}
                        onBackdropPress={() => this.setState({ isTelVisible: false })}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <View style={styles.containerOverlayView}>
                                <Input
                                    value={this.props.tel}
                                    onChangeText={text => this.props.telChanged(text)}
                                    inputStyle={styles.inputStyle}
                                    label='เบอร์โทรศัพท์'
                                    keyboardType='phone-pad'
                                    maxLength={10}
                                    labelStyle={styles.inputTitleStyle}
                                />
                                <View style={{ alignItems: 'center' }}>
                                    {
                                        /**ถ้ามีข้อมูลให้แสดงปุ่มบันทึกการแก้ไข ถ้าไม่มีข้อมูลให้แสดงปุ่มตกลง */
                                        this.props.userProfileExists ? (
                                            /*แสดงปุ่มสำหรับแก้ไข*/
                                            <View>
                                                <ButtonTheme
                                                    title="บันทึกการแก้ไข"
                                                    onPress={this.onButtonEditPress.bind(this, 'tel')}
                                                    loading={this.props.userProfileEditLoading}
                                                />
                                                <ButtonTheme
                                                    title="ปิดหน้านี้"
                                                    onPress={() => this.setState({ isTelVisible: false })}
                                                />
                                            </View>
                                        ) :
                                            (
                                                /*แสดงปุ่มสำหรับเพิ่ม*/
                                                <ButtonTheme
                                                    title="ปิดหน้านี้"
                                                    onPress={() => this.setState({ isTelVisible: false })}
                                                />
                                            )
                                    }
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Overlay>
                    {/************************************************************************************************************************ */}
                    <Overlay /*ที่อยู่*/
                        isVisible={this.state.isAddressVisible}
                        overlayStyle={{ width: '100%', height: 450, borderRadius: 20 }}
                        onBackdropPress={() => this.setState({ isAddressVisible: false })}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <View style={styles.containerOverlayView}>
                                <Input
                                    value={this.props.address.street}
                                    onChangeText={text => this.props.streetChanged(text)}
                                    inputStyle={styles.inputStyle}
                                    label='ที่อยู่'
                                    multiline={true}
                                    numberOfLines={3}
                                    labelStyle={styles.inputTitleStyle}
                                />
                                <Input
                                    value={this.props.address.province}
                                    onChangeText={text => this.props.provinceChanged(text)}
                                    onFocus={this.onShowProvince.bind(this)}
                                    inputStyle={styles.inputStyle}
                                    label='จังหวัด'
                                    labelStyle={styles.inputTitleStyle}

                                />
                                <Input
                                    value={this.props.address.amphoe}
                                    onFocus={this.onShowAmphoe.bind(this)}
                                    inputStyle={styles.inputStyle}
                                    label='อำเภอ/เขต'
                                    labelStyle={styles.inputTitleStyle}
                                />
                                <Input
                                    value={`${this.props.address.zipcode}`}
                                    inputStyle={styles.inputStyle}
                                    label='รหัสไปรษณีย์'
                                    labelStyle={styles.inputTitleStyle}
                                    editable={false}
                                />
                                <View style={{ alignItems: 'center' }}>
                                    {
                                        /**ถ้ามีข้อมูลให้แสดงปุ่มบันทึกการแก้ไข ถ้าไม่มีข้อมูลให้แสดงปุ่มตกลง */
                                        this.props.userProfileExists ? (
                                            /*แสดงปุ่มสำหรับแก้ไข*/
                                            <View>
                                                <ButtonTheme
                                                    title="บันทึกการแก้ไข"
                                                    onPress={this.onButtonAddressEditPress.bind(this)}
                                                    loading={this.props.userProfileEditLoading}
                                                />
                                                <ButtonTheme
                                                    title="ปิดหน้านี้"
                                                    onPress={() => this.setState({ isAddressVisible: false })}
                                                />
                                            </View>
                                        ) :
                                            (
                                                /*แสดงปุ่มสำหรับเพิ่ม*/
                                                <ButtonTheme
                                                    title="ปิดหน้านี้"
                                                    onPress={() => this.setState({ isAddressVisible: false })}
                                                />
                                            )
                                    }
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Overlay>
                    {/***************************************************************************************************************************************** */}
                    {/**หน้ารอ GPS */}
                    <Overlay
                        isVisible={this.state.isGPSLoadingVisible}
                        overlayStyle={{ width: 'auto', height: 'auto', borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.5)', }}
                    >
                        <ActivityIndicator size='large' color='green' animating={this.state.isGPSLoadingVisible} />
                    </Overlay>
                    {/***************************************************************************************************************************************** */}
                    {/**เลือกจังหวัด */}
                    <Overlay
                        isVisible={this.state.isProvince}
                        overlayStyle={{ width: 250, height: 350, borderRadius: 20 }}
                    >
                        <Address
                            mode="province"
                            province={this.props.address.province}
                            onAddressPress={this.onProviceOkPress.bind(this)}
                            onAddressChang={this.onChangProvince.bind(this)}
                            selectValue={this.props.address.province}
                        />
                    </Overlay>
                    {/**เลือกอำเภอ */}
                    <Overlay
                        isVisible={this.state.isAmphoe}
                        overlayStyle={{ width: 250, height: 350, borderRadius: 20 }}
                    >
                        <Address
                            mode="amphoe"
                            province={this.props.address.province}
                            onAddressPress={this.onAmphoeOkPress.bind(this)}
                            onAddressChang={this.onChangAmphoe.bind(this)}
                            selectValue={this.props.address.amphoe}
                        />
                    </Overlay>
                    {/**************************************************************************************************** */}
                    {/**ส่วนแสดงปุ่มบันทึกข้อมูล */}
                    {
                        /*ถ้ามีการโหลดข้อมูลผู้ใช้อยู่ไม่ต้องแสดงนะ*/
                        this.props.userProfileLoading ? <Text></Text> : (
                            <View style={styles.containButtonUserProfile}>
                                {
                                    /*ถ้ามีข้อมูลผู้ใช้อยู่แล้วก็ไม่ต้องแสดงปุ่มเพิ่ม*/
                                    this.props.userProfileExists ? <Text></Text> : (
                                        <ButtonTheme
                                            title="บันทึกข้อมูลส่วนตัว"
                                            onPress={this.onButtonAddPress.bind(this)}
                                            loading={this.props.userProfileAddLoading}
                                        />
                                    )
                                }
                            </View>
                        )
                    }
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

//รับ state ปัจจุบัน แล้ว return เป็น object 
//จากเดิม state เป็น ({auth}) เพราะใช้หลักการ Destructuring
const mapStateToProps = (state: any) => {
    const { namePrefix, name, surName, tel, address, userProfileExists, userProfileLoading, userProfileAddLoading, userProfileEditLoading, userProfileErrMessage, userProfileEditErrMessage, expoPushToken } = state.userProfile;//state ที่ต้องการใช้เอามาบางส่วนได้
    //ถ้า return {email:email} จะเขียนได้เป็น {email} ได้สำหรับ object
    return { namePrefix, name, surName, tel, address, userProfileExists, userProfileLoading, userProfileAddLoading, userProfileEditLoading, userProfileErrMessage, userProfileEditErrMessage, expoPushToken };
};
//connect ให้ทั้ง state และ action เป็น props ของ LoginForm 
//As the second argument passed in to connect, mapDispatchToProps is used for dispatching actions to the store.
export default connect(mapStateToProps, {
    showUserProfile, namePrefixChanged, editUserProfile, nameChanged, surNameChanged, telChanged, streetChanged, provinceChanged, editAddressUserProfile,
    zipcodeChanged, amphoeChanged, saveUserProfile,
})(UserProfileScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    titleList: {
        fontSize: 14,
    },
    subTitle: {
        fontFamily: 'Kanit-Light',
        fontSize: 14,
    },
    containerOverlayView: {
        flex: 1,
        justifyContent: 'space-between',

    },
    titleTextPrefix: {
        fontFamily: 'Kanit-Regular',
        fontSize: 14,
    },
    pickerStyle: {
        color: '#344953',
        justifyContent: 'center',
        width: '100%',
        height: 125,
    },
    pickerItemStyle: {
        fontFamily: 'Kanit-Light',
        fontSize: 14,
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
    containButtonUserProfile: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
    },
    viewNoData: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    }
});

const menuList = [
    {
        key: 'namePrefix',
        title: 'คำนำหน้าชื่อ',
        toScreen: 'namePrefix',
    },
    {
        key: 'name',
        title: 'ชื่อ',
        toScreen: 'name',
    },
    {
        key: 'surName',
        title: 'นามสกุล',
        toScreen: 'surName',
    },
    {
        key: 'tel',
        title: 'เบอร์โทร',
        toScreen: 'tel',
    },
    {
        key: 'address',
        title: 'ที่อยู่',
        toScreen: 'address',
    }
];