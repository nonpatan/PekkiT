import * as React from 'react';
import { StyleSheet, TouchableOpacity, Platform, View, Alert } from 'react-native';
import { ListItem, Button, Avatar } from 'react-native-elements'
import { IoniconsIcon } from '../components/Icon';
import { ListItemContainer } from '../components/ListItemTheme';
import { Text } from '../components/Themed';
import firebase from 'firebase';
import { connect } from 'react-redux';

interface Props {
  navigation: any,
  avatarURL: any,
}
class SettingScreen extends React.Component<Props>{

  state = {
    loading: false,//ตรวจสอบว่าโหลดเสร็จหรือยัง
    photoURL: '',//แสดงรูปด้วย
  }

  onButtonPress = () => {
    this.setState({
      loading: true,
    });
    firebase.auth().signOut().then(() => {
      this.setState({
        loading: false,
      });
    })
      .catch((err) => {
        this.setState({
          loading: false,
        });
        Alert.alert('มีข้อผิดพลาด', err.message);
      })
  }

  goToScreen = (screen: String) => {
    this.props.navigation.navigate(screen);
  }

  componentDidMount() {
    //ทำการกำหนดค่าพื้นฐานผู้ใช้
    const user = firebase.auth().currentUser;
    let username, email, emailVerify, photoURL;

    if (user != null) {
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

      //ถ้ามีภาพ กำหนดไว้
      if (photoURL !== null) {
        this.setState({
          photoURL,
        });
      }
    }
  }

  /**
   * เอาไว้ อัพเด็ด รูป
   */
  componentDidUpdate() {
    if (this.props.avatarURL !== null) {
      if (this.state.photoURL !== this.props.avatarURL) {
        this.setState({
          photoURL: this.props.avatarURL,
        })
      }
    }
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
            />
          ) :
            (<Avatar
              rounded
              size="large"
              icon={{ name: 'person', color: 'green' }}
              overlayContainerStyle={{ backgroundColor: 'white' }}
              containerStyle={{ borderColor: 'green' }}
            />)
          }
        </View>
        <View>
          {
            menuList.map((item, i) => (
              <ListItemContainer
                key={i}
                bottomDivider
                Component={TouchableOpacity}
                onPress={this.goToScreen.bind(this, item.toScreen)}
              >
                <IoniconsIcon name={Platform.OS === 'ios' ? item.iosIcon : item.androidIcon} size={26} />
                <ListItem.Content>
                  <ListItem.Title ><Text style={styles.titleList}>{item.title}</Text></ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItemContainer>
            ))
          }
        </View>
        <View style={styles.containButtonLogOut}>
          <Button
            titleStyle={styles.buttonTitleStyle}
            buttonStyle={styles.buttonStyle}
            title="ออกจากระบบ"
            onPress={this.onButtonPress.bind(this)}
            loading={this.state.loading}
          />
        </View>
      </View>
    )
  }
}

//รับ state ปัจจุบัน แล้ว return เป็น object 
//จากเดิม state เป็น ({auth}) เพราะใช้หลักการ Destructuring
const mapStateToProps = (state: any) => {
  const { avatarURL } = state.userSetting;//state ที่ต้องการใช้เอามาบางส่วนได้
  //ถ้า return {email:email} จะเขียนได้เป็น {email} ได้สำหรับ object
  return { avatarURL };
};
//connect ให้ทั้ง state และ action เป็น props ของ LoginForm 
//As the second argument passed in to connect, mapDispatchToProps is used for dispatching actions to the store.
export default connect(mapStateToProps, {
})(SettingScreen);

const menuList = [
  {
    title: 'ข้อมูลผู้ใช้',
    iosIcon: 'ios-person',
    androidIcon: 'md-person',
    toScreen: 'UserSetting',
  },
  {
    title: 'ข้อมูลส่วนตัว',
    iosIcon: 'ios-contract',
    androidIcon: 'md-contract',
    toScreen: 'UserProfile',
  },
  {
    title: 'เกี่ยวกับ',
    iosIcon: 'ios-information-circle',
    androidIcon: 'md-information-circle',
    toScreen: 'UserAbout',
  },
];

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
});