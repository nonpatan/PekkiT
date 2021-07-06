import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';

interface Props {
  navigation: any
}
export default class JobScreen extends React.Component<Props>{

    gotoNext = ()=>{
       this.props.navigation.navigate('NotFound');
    }

    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.title}>หน้างาน</Text>
                <Text style={styles.title} onPress={this.gotoNext.bind(this)}>NotFound</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
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
  });