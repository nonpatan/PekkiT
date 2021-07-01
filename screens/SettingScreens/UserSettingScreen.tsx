import React from 'react';
import {
    View, TouchableOpacity, TouchableHighlight, Alert, StyleSheet
} from 'react-native';
import { ListItem, Avatar, } from 'react-native-elements';
import firebase from 'firebase';
//import { connect } from 'react-redux';
//import { changAvatar } from '../../redux/actions/index';
//import fireBaseConnect from '../../redux/actions/FireBaseConnect';
import { ListItemContainer } from '../../components/ListItemTheme';
import { Text } from '../../components/Themed';

interface Props {
    navigation: any,
    avatarURL: any,
    changAvatar: any,
}

export default class UserSettingScreen extends React.Component<Props>{
    state = {
        username: '',
        emailVerify: false,
        email: '',
        photoURL: '',
    }

    onChangImage = () => {
        this.props.changAvatar();
    }

    componentDidMount() {
        const user = firebase.auth().currentUser;
        let username, email, emailVerify, photoURL;

        if (user != null) {
            //ถ้ามีผู้ใช้
            username = user.displayName;
            email = user.email;
            emailVerify = user.emailVerified;
            photoURL = user.photoURL;
            //กำหนดค่าใน state
            this.setState({
                username,
                email,
                emailVerify,
            });

            if (photoURL !== null) {
                //console.log('PhotoURL is :' + photoURL);;
                this.setState({
                    photoURL,
                });
            }
        }
    }

    componentDidUpdate() {
        if (this.props.avatarURL !== null) {
            if (this.state.photoURL !== this.props.avatarURL) {
                this.setState({
                    photoURL: this.props.avatarURL,
                })
            }
        }
    }

    goToPasswordChanged = () => {
        this.props.navigation.navigate('UserSettingPasswordChanged');
    }

    onSendEmailVerify = async () => {
        console.log('SendEmailVerify');
        /*try {
            await fireBaseConnect.sendEmailVerify();
            Alert.alert('ข้อความแจ้ง', 'ระบบได้ส่ง Verify ไปยังอีเมลส์ของท่านแล้ว');
        }
        catch (err) {
            Alert.alert('ข้อผิดพลาด', err.message);
        }*/
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containAvatar}>
                    {this.state.photoURL !== '' ? (
                        <Avatar
                            size="large"
                            rounded
                            icon={{ name: 'person', color: 'green' }}

                            source={{
                                uri: this.state.photoURL,
                            }}

                            onPress={this.onChangImage.bind(this)}
                        >
                            <Avatar.Accessory />
                        </Avatar>

                    ) : (
                            <Avatar
                                size="large"
                                rounded
                                icon={{ name: 'person', color: 'green' }}
                                overlayContainerStyle={{ backgroundColor: 'white' }}
                                containerStyle={{ borderColor: 'green' }}

                                onPress={this.onChangImage.bind(this)}
                            >
                                <Avatar.Accessory />
                            </Avatar>
                        )
                    }

                </View>
                <View>
                    <ListItemContainer
                        key={0}
                        bottomDivider
                    >
                        <ListItem.Content>
                            <ListItem.Title><Text style={styles.titleList}>{`ชื่อผู้ใช้ : ${this.state.username}`}</Text></ListItem.Title>
                        </ListItem.Content>
                    </ListItemContainer>

                    <ListItemContainer
                        key={1}
                        bottomDivider
                    >
                        <ListItem.Content>
                            <ListItem.Title><Text style={styles.titleList}>{`อีเมล : ${this.state.email}`}</Text></ListItem.Title>
                        </ListItem.Content>
                    </ListItemContainer>

                    <ListItemContainer
                        key={2}
                        bottomDivider
                        Component={this.state.emailVerify ? TouchableHighlight : TouchableOpacity}
                        onPress={this.state.emailVerify ? undefined : this.onSendEmailVerify.bind(this)}
                    >
                        <ListItem.Content>
                            <ListItem.Title ><Text style={this.state.emailVerify ? styles.titleList : styles.titleListError}>{`ยืนยันอีเมล : ${this.state.emailVerify ? 'ยืนยันแล้ว' : 'ไม่ได้ยืนยัน คลิกเพื่อยืนยัน'}`}</Text></ListItem.Title>
                        </ListItem.Content>
                    </ListItemContainer>

                    <ListItemContainer
                        key={3}
                        bottomDivider
                        Component={TouchableOpacity}
                        onPress={this.goToPasswordChanged.bind(this)}
                    >
                        <ListItem.Content >
                            <ListItem.Title ><Text style={styles.titleList}>{`เปลี่ยนรหัสผ่าน`}</Text></ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItemContainer>
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
    containAvatar: {
        alignItems: 'center',
        marginTop: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    titleList: {
        fontFamily: 'Kanit-Light',
        fontSize: 14,
    },
    containButtonLogOut: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonStyle: {
        borderRadius: 20,
        width: 200,
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
    },
    buttonTitleStyle: {
        fontFamily: 'Kanit-Medium',
        color: '#cfff95',
        fontSize: 14,
    },
    titleListError: {
        fontFamily: 'Kanit-Light',
        fontSize: 14,
        color: 'red',
    },
});