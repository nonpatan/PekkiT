//สร้าง class firebase เพื่อติดต่อกับ Firebase แต่จะยังไม่รวมพวก login นะ ค่อยเพิ่มทีหลัง เพราะต้องแก้ไข code เก่าด้วยยุ่งป่าวๆ
import firebase from 'firebase';
import uuid from 'uuid';

class FireBaseConnect {


    uploadImage = async (uri) => {
        //console.log('got image to upload. uri:' + uri);
        try {
            const user = firebase.auth().currentUser;

            //ส่วนนี้จะเป็นการเตรียมภาพเพื่อ upload โดยภาพจะ upload เป็น blob stream
            const response = await fetch(uri);//fetch resources asynchronously across the network.
            const blob = await response.blob();//takes a Response stream and reads it to completion. It returns a promise that resolves with a Blob.
            ///////////////////////////////////////////////////////////////

            //ทำการ upload ภาพไปที่ storage firebase
            const ref = firebase
                .storage()
                .ref('avatar')
                .child(user.uid);//uuid เอาไว้ตั้งชื่อ sets of universally unique identifiers uuid.v4()
            const task = ref.put(blob);

            return new Promise((resolve, reject) => {
                //Monitor Upload Progress
                task.on(
                    'state_changed',
                    () => {
                        // Observe state change events such as progress, pause, and resume
                        /* noop but you can track the progress here */
                    },
                    reject /* this is where you would put an error callback! */,//เมื่อเกิด error 
                    () => resolve(task.snapshot.ref.getDownloadURL().then(url => url))//เมื่ออัพโหลดเสร็จ
                );
            });
        } catch (err) {
            alert(`Upload Avatar Error : ${err.message}`);
        }
    }

    updateAvatar = (url) => {
        //await this.setState({ avatar: url });
        var userf = firebase.auth().currentUser;
        if (userf != null) {
            //console.log("User:" + userf.email);
            userf.updateProfile({ photoURL: url })
                .then(function () {
                    alert("Avatar image is saved successfully.");
                }, function (error) {
                    alert("Error update avatar. Error:" + error.message);
                    //throw new Error("Error update avatar. Error:" + error.message);
                });
        } else {
            alert("Unable to update avatar. You must login first.");
            //throw new Error("Unable to update avatar. You must login first.");
        }
    }

    onLogout = () => {
        firebase.auth().signOut().then(function () {
            console.log("Sign-out successful.");
        }).catch(function (error) {
            console.log("An error happened when signing out");
        });
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    passwordChanged = async (newPassword) => {

        const user = firebase.auth().currentUser;
        if (user !== null) {
            try {
                await user.updatePassword(newPassword);
            }
            catch (err) {
                throw err;
            }
        }
        else {
            throw new Error("ไม่มี user");
        }

    }

    sendEmailVerify = async () => {
        const user = firebase.auth().currentUser;
        if (user !== null) {
            try {
                await user.sendEmailVerification();
            }
            catch (err) {
                throw err;
            }
        }
        else {
            throw new Error("ไม่มี user");
        }
    }

    /**
     * ทำการ Query ข้อมูลผู้ใช้ จาก users 
     * โดยจะทำการ Query แค่ครั้งเดียว
     * @returns dataSnapshot
     */
    loadUserProfile = async () => {
        const user = firebase.auth().currentUser;
        if (user !== null) {
            try {
                //ทำการโหลดข้อมูลข้อผู้ใช้
                // Get a reference to the database service
                const database = firebase.database().ref(`users/${user.uid}`);
                let dataSnapshot = await database.once('value');
                if (dataSnapshot.exists()) {
                    return dataSnapshot.val();
                }
                else {
                    return 'ไม่มีข้อมูล';
                }
            }
            catch (err) {
                throw err;
            }
        }
        else {
            throw new Error("ไม่มี user");
        }
    }

    //บันทึกข้อมูลส่วนตัวผู้ใช้
    saveUserProfile = async (namePrefix, name, surName, tel, address) => {
        const user = firebase.auth().currentUser;
        if (user !== null) {
            try {
                const database = firebase.database().ref(`users/${user.uid}`);
                await database.set({
                    namePrefix,
                    name,
                    surName,
                    tel,
                    address,
                });

                //เมื่อ save เรียบร้อย
                return 'complete';
            }
            catch (err) {
                throw err;
            }
        }
        else {
            throw new Error("ไม่มี user");
        }
    }

    //บันทึกข้อมูลส่วนตัวช่าง
    saveTechnicianProfile = async (namePrefix, name, surName, tel, address) => {
        const user = firebase.auth().currentUser;
        if (user !== null) {
            try {
                const database = firebase.database().ref(`technician/${user.uid}`);
                await database.set({
                    namePrefix,
                    name,
                    surName,
                    tel,
                    address,
                    score: {
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        totalScore: 0,
                    }
                });

                //เมื่อ save เรียบร้อย
                return 'complete';
            }
            catch (err) {
                throw err;
            }
        }
        else {
            throw new Error("ไม่มี user");
        }
    }

    //แก้ไขข้อมูลส่วนตัวผู้ใช้
    editUserProfile = async (key, value) => {
        const user = firebase.auth().currentUser;
        if (user !== null) {
            try {
                const database = firebase.database().ref(`users/${user.uid}`);
                await database.update({
                    [key]: value,
                });

                return 'complete';
            }
            catch (err) {
                throw err;
            }
        }
        else {
            throw new Error("ไม่มี user");
        }
    }

    //แก้ไขส่วนข้อมูลช่าง
    editTechnicianProfile = async (key, value) => {
        const user = firebase.auth().currentUser;
        if (user !== null) {
            try {
                const database = firebase.database().ref(`technician/${user.uid}`);
                await database.update({
                    [key]: value,
                });

                return 'complete';
            }
            catch (err) {
                throw err;
            }
        }
        else {
            throw new Error("ไม่มี user");
        }
    }

    //แก้ไขที่อยู่ สำหรับข้อมูลส่วนตัวผู้ใช้
    editAddressUserProfile = async (street, province, amphoe, zipcode) => {
        const user = firebase.auth().currentUser;
        if (user !== null) {
            try {
                const database = firebase.database().ref(`users/${user.uid}/address`);
                await database.update({
                    street,
                    province,
                    amphoe,
                    zipcode,
                });

                return 'complete';
            }
            catch (err) {
                throw err;
            }
        }
        else {
            throw new Error('ไม่มี user');
        }
    }

    //แก้ไขที่อยู่ สำหรับข้อมูลส่วนตัวช่าง
    editAddressTechnicianProfile = async (street, province, amphoe, zipcode) => {
        const user = firebase.auth().currentUser;
        if (user !== null) {
            try {
                const database = firebase.database().ref(`technician/${user.uid}/address`);
                await database.update({
                    street,
                    province,
                    amphoe,
                    zipcode,
                });

                return 'complete';
            }
            catch (err) {
                throw err;
            }
        }
        else {
            throw new Error('ไม่มี user');
        }
    }

    //tool ช่วยหา Object ที่มีสถานะต่างๆ เพราะทำใน TypeScript มันเรื่องมากแรง
    fineStatusObject = async (data, typeJobs) => {

        let jobArr = [];//เอาไว้เก็น obj ที่ตรงเงื่อนไข
        let entries = Object.entries(data);

        if (typeJobs == 0) {
            entries.forEach(e => {
                if (e[1].serviceStatus == 'รอดำเนินการ' || e[1].serviceStatus == 'รอยืนยัน') {
                    jobArr.push(e);
                }
            });
        }
        else if (typeJobs == 2) {
            entries.forEach(e => {
                if (e[1].serviceStatus == 'ยกเลิก' || e[1].serviceStatus == 'เสร็จสิ้น' || e[1].serviceStatus == 'ไม่สามารถรับงานได้') {
                    jobArr.push(e);
                }
            });
        }
        else if (typeJobs == 1) {
            entries.forEach(e => {
                if (e[1].repairStatus == 'รอดำเนินการ' || e[1].repairStatus == 'รอยืนยัน') {
                    jobArr.push(e);
                }
            });
        }
        else if (typeJobs == 3) {
            entries.forEach(e => {
                if (e[1].repairStatus == 'ยกเลิก' || e[1].repairStatus == 'เสร็จสิ้น' || e[1].repairStatus == 'ไม่สามารถรับงานได้') {
                    jobArr.push(e);
                }
            });
        }

        return jobArr;
    }

    //ทำการโหลดข้อมูลลูกค้า ตาม ID ที่กำหนด
    getCustomerProfileByID = async (id) => {
        let returnData = '';
        try {
            const rootRef = firebase.database().ref();
            const customerRef = rootRef.child(`users/${id}`);
            customerRef.on('value', snapshot => {
                if (snapshot.exists()) {
                    returnData = snapshot.val();
                }
                else {
                    returnData = 'ไม่มีข้อมูล';
                }
            });
        }
        catch (err) {
            throw err;
        }

        return returnData;
    }

    /**
     * ไว้กำหนด สถาณะการจองงาน
     * @param {*} jobID รหัสงาน
     * @param {*} tableName ชื่อตาราง
     * @param {*} statusKeyName Key ที่ต้องการกำหนดสถานะ
     * @param {*} value ค่าที่ต้องการกำหนด
     * @returns เสร็จสิ้น หรือ error message
     */
    setStatusJob = async (jobID, tableName, statusKeyName, value) => {
        try {
            const rootRef = firebase.database().ref();
            const jobRef = rootRef.child(`${tableName}/${jobID}`);
            await jobRef.update({ [statusKeyName]: value });
            return 'เสร็จสิ้น';
        }
        catch (err) {
            throw err;
        }
    }
}



const fireBaseConnect = new FireBaseConnect();

export default fireBaseConnect;