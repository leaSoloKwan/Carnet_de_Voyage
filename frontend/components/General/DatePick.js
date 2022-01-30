import React, {useEffect, useState} from 'react';
import {TextInput, View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ListItem} from 'native-base';

/* A DateTimePicker with its value display in a text input
    When you click on the text input, the date picker is first diplay, then the time picker.
*/
const DatePick = props => {
    const [mode, setMode] = useState('time');
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(props.date);

    useEffect(() => {
        props.setDate(date);
        if(mode === 'date')
            showTimepicker();
        else
            setShow(false);
    }, [date]);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        //setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showDatepicker = () => {
        setShow(true);
        setMode('date');
    };

    const showTimepicker = () => {
        setShow(true);
        setMode('time');
    };
    
    return (
    <View>
        {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
    <ListItem>
        <TouchableOpacity testID={props.testID} onPress={showDatepicker}>
            <View style={{flexDirection:'row', alignItems: 'center'}}>
                <MaterialCommunityIcons name='calendar'color={'#8F2C38'} size={24} /><Text> {props.label}</Text>
            </View>
            <TextInput
            style={{paddingVertical: 20, fontSize: 20}}
            editable={false}
            selectTextOnFocus={false}
            noBorder={true}
            autoCapitalize="none"
            placeholder={date.toLocaleDateString() + " " + date.toLocaleTimeString()}
            value={date.toLocaleDateString() + " " + date.toLocaleTimeString()}
            onChangeText={props.onChangeText()}
            onBlur={props.onBlur()}
            error={date && props.error}
            name={props.name}
            />
        </TouchableOpacity>
    </ListItem>
    </View>
    );
}

export default DatePick;