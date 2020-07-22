import React, { Component } from 'react';
//import react in our code.
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    TextInput
} from 'react-native';
//import all the components we are going to use.
import { scale, moderateScale, verticalScale } from '../../utils/Scale';

export default class Home extends Component {
    constructor() {
        super();
        this.arrayholder = [];
        this.state = {
            text: '',
            loading: false,
            isListEnd: false,
            //Loading state used while loading the data for the first time
            serverData: [],
            //Data Source for the FlatList
            fetching_from_server: false,
            //Loading state used while loading more data
        };
        this.offset = 1;
        //Index of the offset to load from web API
    }
    componentDidMount() {
        this.loadMoreData();
        console.log("deq",this.arrayholder);
    }
    loadMoreData = () => {
        if (!this.state.fetching_from_server && !this.state.isListEnd) {
            this.setState({ fetching_from_server: true }, () => {
                fetch('http://api.tvmaze.com/shows/' + this.offset + '/episodes')
                    //Sending the currect offset with get request
                    .then(response => response.json())
                    .then(responseJson => {
                        console.log("data", responseJson);
                        if (responseJson.length > 0) {
                            //Successful response from the API Call
                            this.offset = this.offset + 1;
                            //After the response increasing the offset for the next API call.
                            this.setState({
                                serverData: [...this.state.serverData, ...responseJson],
                                //adding the new data with old one available
                                fetching_from_server: false,
                                //updating the loading state to false
                            },
                            function() {
                                this.arrayholder = [...this.arrayholder, ...responseJson];
                              });
                        } else {
                            this.setState({
                                fetching_from_server: false,
                                isListEnd: true,
                            });
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            });
        }
    };
    SearchFilterFunction(text) {
        //passing the inserted text in textinput
        const newData = this.arrayholder.filter(function(item) {
          //applying filter for the inserted text in search bar
          const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          serverData: newData,
          text: text,
        });
      }
    renderFooter() {
        return (
            <View style={styles.footer}>
                {this.state.fetching_from_server ? (
                    <ActivityIndicator color="black" style={{ margin: 15 }} />
                ) : null}
            </View>
        );
    }
    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.textInputStyle}
                    onChangeText={text => this.SearchFilterFunction(text)}
                    value={this.state.text}
                    underlineColorAndroid="transparent"
                    placeholder="Search Here"
                />
                {this.state.loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                            <FlatList
                                style={{ width: '100%' }}
                                keyExtractor={(item, index) => index.toString()}
                                data={this.state.serverData}
                                onEndReached={() => this.loadMoreData()}
                                onEndReachedThreshold={0.5}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity style={styles.item}
                                        onPress={() => {
                                            console.log("click", item); this.props.navigation.navigate('Details', {
                                                data: item
                                            })
                                        }}>
                                        <Text style={styles.text}>
                                            {item.name.toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                                ListFooterComponent={this.renderFooter.bind(this)}
                            //Adding Load More button as footer component
                            />
                    )}
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
    item: {
        padding: scale(10),
    },
    separator: {
        height: scale(0.5),
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    text: {
        fontSize: scale(15),
        color: 'black',
    },
    footer: {
        padding: scale(10),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    textInputStyle: {
        height: scale(40),
        width: scale(300),
        borderWidth: 1,
        paddingLeft: scale(10),
        borderColor: '#009688',
        backgroundColor: '#FFFFFF',
    },
});