import React from 'react';
import {ImageBackground, ScrollView} from 'react-native';

/* A component which defines the background image and allow the scroll view
*/

const Background = props => {
    return (
        <ImageBackground source={require('../../images/background.png')} style={{width: '100%', height: '100%'}} imageStyle={{opacity:0.5}}>
            <ScrollView testID='scroll'>
                {props.content}
            </ScrollView>
        </ImageBackground>
    );
  }

export default Background;