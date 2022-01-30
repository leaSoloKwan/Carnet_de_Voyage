import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { navigate } from '../../RootNavigation';

/* Display some info about the activity in a little rectangle
*/

const ActivityBloc = props => {
  const id_travel = props.activity.id_travel;
  const id_act = props.activity.id;
  const right = props.right;

  return (
      <TouchableOpacity onPress={() => navigate('Activity', {id: id_travel, id_act: id_act, right: right})} style={styles.section} key={id_act}>
        <Text style={styles.sectionTitle}>{props.activity.name}</Text>
        <View style={styles.inrow}>
          <Text style={styles.italic}>{new Date(props.activity.start).toLocaleDateString() + " " + new Date(props.activity.start).toLocaleTimeString()} - {new Date(props.activity.end).toLocaleDateString() + " " + new Date(props.activity.end).toLocaleTimeString()}</Text>
          <Text style={styles.right, styles.sectionSubTitle}>{props.activity.type}</Text>
        </View>
        <Text style={[styles.sectionSubTitle, styles.center]}>{props.activity.place}</Text>
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
  center: {
    textAlign: 'center',
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

export default ActivityBloc;
