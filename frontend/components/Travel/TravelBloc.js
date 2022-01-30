import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { navigate } from '../../RootNavigation';

/* Display some info about the travel in a little rectangle
*/

const TravelBloc = props => {
  
  return (
      <TouchableOpacity onPress={() => navigate('Travel', {id: props.id, 'right': props.right})} style={styles.section} key={props.id} testID={props.title}>
        <Text style={styles.sectionTitle}>{props.title}</Text>
        <View style={styles.inrow}>
          <Text style={styles.italic}>{new Date(props.start).toLocaleDateString()} - {new Date(props.end).toLocaleDateString()}</Text>
          <Text style={styles.right, styles.sectionSubTitle}>{props.place}</Text>
        </View>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    borderTopLeftRadius: 20,
    padding: 12,
    fontSize: 24,
    fontWeight: '600',
    backgroundColor: '#F9F9F9',
  },
  sectionSubTitle: {
    fontWeight: 'bold',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  right: {
    textAlign: 'right',
  },
  italic: {
    fontStyle: 'italic',
  },
  section: {
    marginTop: 10,
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderColor: '#CCC',
    backgroundColor: '#E0E0E0'
  },
  inrow: {
    marginHorizontal: 12,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default TravelBloc;
