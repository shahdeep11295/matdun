import React, { Component } from 'react';
//import react in our code.
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Platform,
    ActivityIndicator,
    Image,
    Dimensions
} from 'react-native';
//import all the components we are going to use.
import { scale, moderateScale, verticalScale } from '../../utils/Scale';

export default class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: props.route.params.data
        };
    }

    componentDidMount() {
        console.log(this.state.detail);
    }

    render() {
        const { detail } = this.state;
        return (
            <View style={styles.container}>
                <Image style={styles.image}
                    source={{ uri: detail.image.original }} />
                    <Text style={styles.text}>Name: {detail.name}</Text>
                    <Text style={styles.text}>Description: {detail.summary.replace(/<(.|\n)*?>/g, '')}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: verticalScale(30),
    },
    image: {
        width: Dimensions.get('window').width, height: scale(200),
    },
    text: {
        fontSize: scale(20),
        color: 'black',
        marginTop:verticalScale(20),
        marginLeft:scale(16),
        marginRight:scale(16),
        textAlign:"justify"
    },

});