import * as React from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { ButtonGroupTheme } from '../components/ButtonGroupTheme';
import { ListItemTheme, ListItemContent, ListItemSubtitle, ListItemChevron, ListItemTitle } from '../components/ListItemTheme';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  jobsShowList,
} from '../redux/actions/index';

interface Props {
  navigation: any,
  jobsShowList: any,
  jobListLoading: any,
  jobListErrMessage: any,
  jobServiceListObjArray: any,
  isJobListExist: any,
}

class JobScreen extends React.Component<Props>{

  _isMounted = false;
  state = {
    selectedIndex: 0,//กำหนด index ของปุ่ม button group
    button:['บริการ', 'ซ่อม', 'ประวัติ บริการ', 'ประวัติ ซ่อม'],
  }

  updateIndex(selectedIndex: number) {

    //เมื่อเลือกปุ่มจะแสดงรายการตามปุ่มที่กด
    this._isMounted = true;

    if (this._isMounted) {

      if (selectedIndex == 0) {
        //บริการ
        this.props.jobsShowList(selectedIndex);
        this.setState({ selectedIndex });
      }
      else if (selectedIndex == 2) {
        //ประวัติบริการ
        this.props.jobsShowList(selectedIndex);
        this.setState({ selectedIndex });
      }
      else if (selectedIndex == 1) {
        //ซ่อม
        this.props.jobsShowList(selectedIndex);
        this.setState({ selectedIndex });
      }
      else if (selectedIndex == 3) {
        //ประวัติซ่อม
        this.props.jobsShowList(selectedIndex);
        this.setState({ selectedIndex });
      }

    }
    else {

      //ถ้าไม่มีการเลือกก็ไปบริการเลย
      this.props.jobsShowList(0);
      this.setState({ selectedIndex: 0 });

    }

  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.props.jobsShowList(this.state.selectedIndex);
    }

  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  goToJobDetailScreen = (jobID: String) => {
    //ไปหน้าแสดงรายละเอียดรายการ
    this.props.navigation.navigate('JobDetail', { jobID, selectedIndex: this.state.selectedIndex });
  }

  gotoNext = () => {
    this.props.navigation.navigate('Test');
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{ width: '100%' }}>
          {/**ปุ่มต่างๆ */}
          <ButtonGroupTheme
            onPress={this.updateIndex.bind(this)}
            selectedIndex={this.state.selectedIndex}
            buttons={this.state.button}
          />
          {
            //ทำการตรวจสอบว่าต้องแสดงโหลดมั้ย
            this.props.jobListLoading ?
              /*ให้แสดง Loading */
              (<ActivityIndicator size='large' animating={this.props.jobListLoading} />) :
              /*ให้แสดงข้อมูลที่โหลดมาได้*/
              (
                this.props.isJobListExist ? (
                  //ถ้ามีรายการ
                  ((this.state.selectedIndex == 0) || (this.state.selectedIndex == 2)) ? (
                    //สำหรับรายการบริการ
                    this.props.jobServiceListObjArray.reverse().map((item: any, i: number) => (
                      <ListItemTheme
                        key={i}
                        bottomDivider
                        Component={TouchableOpacity}
                        onPress={this.goToJobDetailScreen.bind(this, item[0])}
                      >
                        <ListItemContent>
                          <ListItemTitle style={styles.titleList}>{(new Date(item[1].date)).toLocaleString()}</ListItemTitle>
                          <ListItemSubtitle>
                            <View style={styles.viewListItem}>
                              <Text style={styles.titleList}>{item[1].serviceSelected.name}</Text>
                              <Text style={styles.titleList}>{item[1].serviceStatus}</Text>
                            </View>
                          </ListItemSubtitle>
                        </ListItemContent>
                        <ListItemChevron />
                      </ListItemTheme>
                    ))
                  ) :
                    (
                      //สำหรับรายการซ่อม
                      this.props.jobServiceListObjArray.reverse().map((item: any, i: number) => (
                        <ListItemTheme
                          key={i}
                          bottomDivider
                          Component={TouchableOpacity}
                          onPress={this.goToJobDetailScreen.bind(this, item[0])}
                        >
                          <ListItemContent>
                            <ListItemTitle style={styles.titleList}>{(new Date(item[1].date)).toLocaleString()}</ListItemTitle>
                            <ListItemSubtitle>
                              <View style={styles.viewListItem}>
                                <Text style={styles.titleList}>{item[1].repairSelected.name}</Text>
                                <Text style={styles.titleList}>{item[1].repairStatus}</Text>
                              </View>
                            </ListItemSubtitle>
                          </ListItemContent>
                          <ListItemChevron />
                        </ListItemTheme>
                      ))
                    )

                ) : (//ถ้าไม่มีรายการ
                  <View style={styles.viewTechnicianOut}>
                    <Text style={styles.textShowProfile}>{`${this.props.jobListErrMessage}`}</Text>
                  </View>
                )

              )
          }
        </ScrollView>
      </View>
    );
  }
}

//รับ state ปัจจุบัน แล้ว return เป็น object 
//จากเดิม state เป็น ({auth}) เพราะใช้หลักการ Destructuring
const mapStateToProps = (state: any) => {
  const { jobListLoading, jobListErrMessage, jobServiceListObjArray, isJobListExist } = state.job;//state ที่ต้องการใช้เอามาบางส่วนได้

  //ถ้า return {email:email} จะเขียนได้เป็น {email} ได้สำหรับ object
  return {
    jobListLoading, jobListErrMessage, jobServiceListObjArray, isJobListExist
  };
};
//connect ให้ทั้ง state และ action เป็น props ของ LoginForm 
//As the second argument passed in to connect, mapDispatchToProps is used for dispatching actions to the store.
export default connect(mapStateToProps, {
  jobsShowList,
})(JobScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  titleList: {
    fontSize: 14,
  },
  textStyle:{
    fontFamily: 'Kanit-Light',
    fontSize: 14,
  },
  viewListItem: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  viewTechnicianOut: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textShowProfile: {
    fontFamily: 'Kanit-Light',
    fontSize: 14,
  },
});