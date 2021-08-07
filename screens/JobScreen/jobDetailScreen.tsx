import * as React from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, Alert, View } from 'react-native';
import { Text } from '../../components/Themed';
import { ListItemTheme, ListItemContent, ListItemSubtitle, ListItemChevron, ListItemTitle } from '../../components/ListItemTheme';
import { CardTheme, CardTitle, CardDivider } from '../../components/CardTheme';
import { ButtonTheme } from '../../components/ButtonTheme';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
    jobShowDetailById, jobCancel, jobConfirm,resetLoading
} from '../../redux/actions/index';
import Colors from '../../constants/Colors';

interface Props {
    navigation: any,
    jobShowDetailById: any,
    jobCancel: any,
    jobConfirm: any,
    jobSelected: any,
    jobSelected_loading: any,
    jobSelected_ErrMessage: any,
    jobDetailExisted: any,
    jobConfirm_loading: any,
    jobCancel_loading: any,
    isJobConfirm_Err: any,
    isJobCancel_Err: any,
    jobCancel_ErrMessage: any,
    jobConfirm_ErrMessage: any,
    resetLoading:any,
}

class JobDetailScreen extends React.Component<Props>{

    _isMounted = false;

    state = {
        cancelButoonDisable: false,//ไว้สำหรับปุ่มยกเลิก ให้ทำงานหรือไม่ทำงาน ของช่างคือปุ่ม ยกเลิอกงาน
        finishButtonDisable: false,//ไว้สำหรับปุ่มปิดงาน ให้ทำงานหรือไม่ทำงาน ของ ช่างคือปุ่ม รับงาน
        jobDateTemp: null,//เก็บวันเพื่อตรวจสอบ
        jobID: '',//id ของ งานที่เลือก
        selectedIndex: 4,//เป็นการเลือกแท๊ป ว่าเป็น บริการ หรือ ซ่อม บริการคือ 0,2 ซ่อม 1,3
        rating: 0,//ของช่างไม่ต้องมีก็ได้
    }

    /**ทำการแสดงรายละเอียดของงานที่ต้องการ */
    componentDidMount() {
        this._isMounted = true;

        if (this._isMounted) {
            //รับ id ของงานที่เลือกมา
            const { route }: any = this.props;
            const { jobID, selectedIndex } = route.params;//V.5 จะใช้ route.params ในการรับค่า



            if (jobID === 'noJobID') {
                Alert.alert('มีข้อผิดพลาด', 'ไม่มี key ของงานที่ต้องการ');
            }
            else if (selectedIndex == 'noSelectedID') {
                Alert.alert('มีข้อผิดพลาด', 'ไม่มีการเลือกแท็ป');
            }
            else {
                //เก็บค่า jobID ไว้
                this.setState({
                    jobID, selectedIndex,
                });
                //ถ้ามีงานก็ไปดึงข้อมูลเลย โดยจะใช้ข้อมูลเดิมในหน้าแรกมาดึง จะได้ข้อมูลงาน และข้อมูลลูกค้าเลย
                this.props.jobShowDetailById(jobID, selectedIndex);
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        //กำหนดโหลดใหม่ เนื่องจากว่ามันเก็บสถานะเดิมไว้ คือ ถ้าเป็น false แล้วจะไม่เป็น true แระ กรณีที่ว่าเราเลื่อนไปหน้าก่อนหน้า
        this.props.resetLoading();
    }

    /**เมื่อกดยกเลิกงาน */
    onCancel = () => {
        //ยกเลิกงาน
        if (this.state.jobID !== '') {
            //ยกเลิกการจอง
            this.props.jobCancel(this.state.jobID, this.state.selectedIndex);
        }
        else {
            Alert.alert('มีข้อผิดพลาด', 'ไม่มีรหัสงาน');
        }

    }

    /**เมื่อกดยืนยัน */
    onConfirm = () => {
        //ปิดงาน
        if (this.state.jobID !== '') {

            //รับงาน
            this.props.jobConfirm(this.state.jobID, this.state.selectedIndex,);


        }
        else {
            Alert.alert('มีข้อผิดพลาด', 'ไม่มีรหัสงาน');
        }
    }

    render() {
        
        return (
            <ScrollView>
                {
                    this.props.jobSelected_loading ? (
                        <ActivityIndicator size='large' animating={this.props.jobSelected_loading} />
                    ) : (
                        this.props.jobDetailExisted ? (
                            //ถ้ามีรายการอะนะ
                            ((this.state.selectedIndex == 0) || (this.state.selectedIndex == 2)) ? (
                                ///////////// ส่วนบริการ //////////////////
                                this.props.jobSelected !== null ? (
                                    //ถ้ามีรายละเอียด
                                    <View>
                                        <CardTheme>
                                            <CardTitle style={styles.cardTitleStyle}>บริการที่เลือก</CardTitle>
                                            <CardDivider />
                                            <View>
                                                {
                                                    _.filter(_.compact(this.props.jobSelected.serviceSelected.priceRange), 'amount').map((item: any, i: number) => (
                                                        <ListItemTheme
                                                            key={i}
                                                            bottomDivider
                                                        >
                                                            <ListItemContent>
                                                                <ListItemTitle style={styles.titleList}>{`${item.name}`}</ListItemTitle>
                                                                <ListItemSubtitle style={styles.subTitleList}>{`ราคาต่อหน่วย ${(item.priceDiscount == '') ? (item.price) : (item.priceDiscount)} จำนวน ${item.amount} หน่วย`}</ListItemSubtitle>
                                                            </ListItemContent>
                                                        </ListItemTheme>
                                                    ))
                                                }
                                            </View>
                                        </CardTheme>

                                        <CardTheme>
                                            <CardTitle style={styles.cardTitleStyle}>ข้อมูลลูกค้า</CardTitle>
                                            <CardDivider />
                                            <View>
                                                {
                                                    <View>
                                                        <Text style={styles.textStyle}>{`ชื่อ ${this.props.jobSelected.customerSelected.namePrefix} ${this.props.jobSelected.customerSelected.name} ${this.props.jobSelected.customerSelected.surName}`}</Text>
                                                        <Text style={styles.textStyle}>{`เบอร์โทร ${this.props.jobSelected.customerSelected.tel}`}</Text>
                                                    </View>
                                                }
                                            </View>
                                        </CardTheme>

                                        <CardTheme>
                                            <CardTitle style={styles.cardTitleStyle}>ที่อยู่และวันเวลา เพื่อรับบริการ</CardTitle>
                                            <CardDivider />
                                            <View>
                                                {
                                                    <View>
                                                        <Text style={styles.textStyle}>{`ที่อยู่ ${this.props.jobSelected.serviceAddress.street} ${this.props.jobSelected.serviceAddress.amphoe} ${this.props.jobSelected.serviceAddress.province} ${this.props.jobSelected.serviceAddress.zipcode}`}</Text>
                                                        <Text style={styles.textStyle}>{`วัน เวลา ${(new Date(this.props.jobSelected.serviceDate)).toLocaleString()}`}</Text>
                                                    </View>
                                                }
                                            </View>
                                        </CardTheme>

                                        <CardTheme>
                                            <CardTitle style={styles.cardTitleStyle}>สถานะการชำระค่าบริการ</CardTitle>
                                            <CardDivider />
                                            <View>
                                                {
                                                    this.props.jobSelected.pay.payStatus == false ? (
                                                        //แสดงว่ายังไม่จ่ายเงิน
                                                        <View style={styles.viewShowMessage}>
                                                            <Text style={styles.textStyle}>ยังไม่ชำระค่าบริการ</Text>
                                                        </View>
                                                    ) : (
                                                        //แสดงว่าจ่ายเงินแล้ว
                                                        <View style={styles.viewShowMessage}>
                                                            <Text style={styles.textStyle}>ชำระค่าบริการแล้ว</Text>
                                                            <Text style={styles.textStyle}>{`ยอดชำระ : ${this.props.jobSelected.pay.paymentAmount}`}</Text>
                                                            <Text style={styles.textStyle}>{this.props.jobSelected.pay.payback > 0 ? (`จ่ายเงินคืน : ${this.props.jobSelected.pay.payback}`) : (``)}</Text>
                                                        </View>
                                                    )
                                                }
                                            </View>
                                        </CardTheme>

                                        <CardTheme>
                                            <CardTitle style={styles.cardTitleStyle}>สถานะบริการ</CardTitle>
                                            <CardDivider />
                                            <View style={styles.viewShowMessage}>
                                                <Text style={styles.textStyle}>{this.props.jobSelected.serviceStatus}</Text>
                                                {
                                                    (this.props.jobSelected.serviceStatus == 'รอยืนยัน') ? (
                                                        <View>
                                                            <ButtonTheme
                                                                title='ยืนยันรับงาน'
                                                                onPress={this.onConfirm.bind(this)}
                                                                loading={this.props.jobConfirm_loading}
                                                            />
                                                            <Text>{this.props.isJobConfirm_Err ? (this.props.jobConfirm_ErrMessage) : ("")}</Text>
                                                            <ButtonTheme
                                                                title='ยกเลิกรับงาน'
                                                                onPress={this.onCancel.bind(this)}
                                                                loading={this.props.jobCancel_loading}
                                                            />
                                                            <Text>{this.props.isJobCancel_Err ? (this.props.jobCancel_ErrMessage) : ("")}</Text>
                                                        </View>
                                                    ) :
                                                        (
                                                            <View></View>
                                                        )
                                                }
                                            </View>
                                        </CardTheme>

                                    </View>
                                ) : (
                                    //ถ้าไม่มีรายละเอียด
                                    <View style={styles.viewTechnicianOut}>
                                        <Text style={styles.textShowError}>{this.props.jobSelected_ErrMessage}</Text>
                                    </View>
                                )
                            ) : (
                                //////////// ส่วนซ่อม ///////////////////
                                this.props.jobSelected !== null ? (
                                    <View>
                                        <CardTheme>
                                            <CardTitle style={styles.cardTitleStyle}>อาการเสียที่เลือก {this.props.jobSelected.repairSelected.name}</CardTitle>
                                            <CardDivider />
                                            <View>
                                                <View style={styles.viewShowMessage}>
                                                    {
                                                        this.props.jobSelected.repairDefective !== null ? (
                                                            (_.filter(this.props.jobSelected.repairDefective, { defectStatus: true })).length > 0 ? (
                                                                _.filter(this.props.jobSelected.repairDefective, { defectStatus: true }).map((item: any, i: number) => (
                                                                    <Text key={i} style={styles.textStyle}>{item.name}</Text>
                                                                ))
                                                            ) : (
                                                                <Text style={styles.textShowError}>ไม่มีการเลือกอาการ</Text>
                                                            )
                                                        ) : (
                                                            <Text style={styles.textShowError}>ไม่มีการเลือกอาการ</Text>
                                                        )

                                                    }

                                                </View>
                                                <View style={styles.viewShowMessage}>
                                                    {
                                                        this.props.jobSelected.repairDefectiveOption !== '' ?
                                                            (
                                                                <Text style={styles.textStyle}>{this.props.jobSelected.repairDefectiveOption}</Text>
                                                            ) :
                                                            (
                                                                <Text style={styles.textStyle}>ไม่มีอาการเพิ่มเติม</Text>
                                                            )
                                                    }
                                                </View>
                                            </View>
                                        </CardTheme>

                                        <CardTheme>
                                            <CardTitle style={styles.cardTitleStyle}>ช่างที่เลือก</CardTitle>
                                            <CardDivider />
                                            <View>
                                                {
                                                    <View>
                                                        <Text style={styles.textStyle}>{`ชื่อ ${this.props.jobSelected.customerSelected.namePrefix} ${this.props.jobSelected.customerSelected.name} ${this.props.jobSelected.customerSelected.surName}`}</Text>
                                                        <Text style={styles.textStyle}>{`ที่อยู่ ${this.props.jobSelected.customerSelected.address.street} ${this.props.jobSelected.customerSelected.address.amphoe} ${this.props.jobSelected.customerSelected.address.province} ${this.props.jobSelected.customerSelected.address.zipcode}`}</Text>
                                                        <Text style={styles.textStyle}>{`เบอร์โทร ${this.props.jobSelected.customerSelected.tel}`}</Text>
                                                    </View>
                                                }
                                            </View>
                                        </CardTheme>

                                        <CardTheme>
                                            <CardTitle style={styles.cardTitleStyle}>ที่อยู่และวันเวลา เพื่อรับบริการ</CardTitle>
                                            <CardDivider />
                                            <View>
                                                {
                                                    <View>
                                                        <Text style={styles.textStyle}>{`ที่อยู่ ${this.props.jobSelected.repairAddress.street} ${this.props.jobSelected.repairAddress.amphoe} ${this.props.jobSelected.repairAddress.province} ${this.props.jobSelected.repairAddress.zipcode}`}</Text>
                                                        <Text style={styles.textStyle}>{`วัน เวลา ${(new Date(this.props.jobSelected.repairDate)).toLocaleString()}`}</Text>
                                                    </View>
                                                }
                                            </View>
                                        </CardTheme>

                                        <CardTheme>
                                            <CardTitle style={styles.cardTitleStyle}>สถานะการชำระค่าบริการ</CardTitle>
                                            <CardDivider />
                                            <View >
                                                {
                                                    this.props.jobSelected.pay.payStatus == false ? (
                                                        //แสดงว่ายังไม่จ่ายเงิน
                                                        <View style={styles.viewShowMessage}>
                                                            <Text style={styles.textStyle}>ยังไม่ชำระค่าบริการ</Text>
                                                        </View>
                                                    ) : (
                                                        //แสดงว่าจ่ายเงินแล้ว
                                                        <View style={styles.viewShowMessage}>
                                                            <Text style={styles.textStyle}>ชำระค่าบริการแล้ว</Text>
                                                            <Text style={styles.textStyle}>{`ยอดชำระ : ${this.props.jobSelected.pay.paymentAmount}`}</Text>
                                                            <Text style={styles.textStyle}>{this.props.jobSelected.pay.payback > 0 ? (`จ่ายเงินคืน : ${this.props.jobSelected.pay.payback}`) : (``)}</Text>
                                                        </View>
                                                    )
                                                }
                                            </View>
                                        </CardTheme>

                                        <CardTheme>
                                            <CardTitle style={styles.cardTitleStyle}>สถานะบริการ</CardTitle>
                                            <CardDivider />
                                            <View style={styles.viewShowMessage}>
                                                <Text style={styles.textStyle}>{this.props.jobSelected.repairStatus}</Text>
                                                {
                                                    (this.props.jobSelected.repairStatus == 'รอยืนยัน') ? (
                                                        <View>
                                                            <ButtonTheme
                                                                title='ยืนยันรับงาน'
                                                                onPress={this.onConfirm.bind(this)}
                                                                loading={this.props.jobConfirm_loading}
                                                            />
                                                            <Text>{this.props.isJobConfirm_Err ? (this.props.jobConfirm_ErrMessage) : ("")}</Text>
                                                            <ButtonTheme
                                                                title='ยกเลิกรับงาน'
                                                                onPress={this.onCancel.bind(this)}
                                                                loading={this.props.jobCancel_loading}
                                                            />
                                                            <Text>{this.props.isJobCancel_Err ? (this.props.jobCancel_ErrMessage) : ("")}</Text>
                                                        </View>
                                                    ) :
                                                        (
                                                            <View></View>
                                                        )
                                                }
                                            </View>
                                        </CardTheme>

                                    </View>
                                ) : (
                                    //ถ้าไม่มีรายละเอียดการซ่อม
                                    <View style={styles.viewTechnicianOut}>
                                        <Text style={styles.textShowError}>{this.props.jobSelected_ErrMessage}</Text>
                                    </View>
                                )
                            )
                        ) : (
                            <View>
                                <Text>ไม่มีรายการนะฮัฟ</Text>
                            </View>
                        )
                    )
                }
            </ScrollView>

        );
    }

}

//รับ state ปัจจุบัน แล้ว return เป็น object 
//จากเดิม state เป็น ({auth}) เพราะใช้หลักการ Destructuring
const mapStateToProps = (state: any) => {
    const { jobSelected, jobSelected_loading, jobSelected_ErrMessage, jobDetailExisted, jobConfirm_loading, jobCancel_loading, isJobConfirm_Err, isJobCancel_Err, jobCancel_ErrMessage, jobConfirm_ErrMessage } = state.jobDetail;//state ที่ต้องการใช้เอามาบางส่วนได้

    //ถ้า return {email:email} จะเขียนได้เป็น {email} ได้สำหรับ object
    return {
        jobSelected, jobSelected_loading, jobSelected_ErrMessage, jobDetailExisted, jobConfirm_loading, jobCancel_loading, isJobConfirm_Err, isJobCancel_Err, jobCancel_ErrMessage, jobConfirm_ErrMessage
    };
};
//connect ให้ทั้ง state และ action เป็น props ของ LoginForm 
//As the second argument passed in to connect, mapDispatchToProps is used for dispatching actions to the store.
export default connect(mapStateToProps, {
    jobShowDetailById, jobCancel, jobConfirm,resetLoading,
})(JobDetailScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    cardTitleStyle: {
        fontSize: 18,
    },
    textStyle: {
        fontFamily: 'Kanit-Light',
        fontSize: 14,
    },
    textStyleHead: {
        fontFamily: 'Kanit-Regular',
        fontSize: 14,
    },
    titleListShow: {
        fontFamily: 'Kanit-Light',
        fontSize: 14,
    },
    titleList: {
        fontSize: 16,
    },
    subTitleList: {
        fontSize: 14,
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
    textShowError: {
        fontFamily: 'Kanit-Light',
        fontSize: 14,
        color: Colors.light.textError,
    },
    viewShowMessage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textShowMessage: {
        fontFamily: 'Kanit-Light',
        fontSize: 14,
    },
})