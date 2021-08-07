import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { CardTheme, CardTitle, CardDivider } from '../../components/CardTheme';
import { Text } from '../../components/Themed';
import { getAbout } from '../../redux/actions/UserSettingAction';
import { connect } from 'react-redux';


interface Props {
    navigation: any,
    getAbout: any,
    user_aboutObj: any,
    user_about_err: any,
    user_about_loading: any,
    user_about_success: any,
}

class UserAbout extends React.Component<Props>{

    componentDidMount() {
        //ทำการโหลด About
        this.props.getAbout();
    }

    render() {
        return (
            <View style={styles.container}>
                <CardTheme>
                    <CardTitle style={styles.cardTitleStyle} >Pekki</CardTitle>
                    <CardDivider />
                    <View >
                        {
                            this.props.user_about_loading ? (
                                <ActivityIndicator size='large' animating={this.props.user_about_loading} />
                            ) : (
                                this.props.user_about_success ? (
                                    <View>
                                        <Text style={styles.textStyle}>{this.props.user_aboutObj.pekki}</Text>
                                        <Text style={styles.textStyle}>{`บริการ : ${this.props.user_aboutObj.service}`}</Text>
                                        <Text style={styles.textStyle}>{`อีเมล : ${this.props.user_aboutObj.contact.email}`}</Text>
                                        <Text style={styles.textStyle}>{`ไลน์ไอดี : ${this.props.user_aboutObj.contact.line}`}</Text>
                                    </View>
                                ) : (
                                    <Text>{this.props.user_about_err}</Text>
                                )
                            )
                        }
                    </View>
                </CardTheme>
            </View>
        )
    }
}

//รับ state ปัจจุบัน แล้ว return เป็น object 
//จากเดิม state เป็น ({auth}) เพราะใช้หลักการ Destructuring
const mapStateToProps = (state: any) => {
    const { user_aboutObj, user_about_err, user_about_loading, user_about_success } = state.UserAbout;//state ที่ต้องการใช้เอามาบางส่วนได้
    //ถ้า return {email:email} จะเขียนได้เป็น {email} ได้สำหรับ object
    return { user_aboutObj, user_about_err, user_about_loading, user_about_success };
};
//connect ให้ทั้ง state และ action เป็น props ของ LoginForm 
//As the second argument passed in to connect, mapDispatchToProps is used for dispatching actions to the store.
export default connect(mapStateToProps, {
    getAbout
})(UserAbout);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    cardTitleStyle: {
        fontSize: 20,
    },
    textStyle: {
        fontFamily: 'Kanit-Light',
        fontSize: 14,
    }
})