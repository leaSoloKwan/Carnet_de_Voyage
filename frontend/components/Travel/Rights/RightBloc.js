import React, {useContext} from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { styles, BACKEND, TokenContext } from '../../../RootNavigation';
import ButtonWithIcon from '../../General/ButtonWithIcon';

/* Display the right of an user about a travel in a little rectangle
*/

const RightBloc = props => {
  const { token } = useContext(TokenContext);
  
  // function to modify the right (READER => WRITER or WRITER => READER)
  function modifyRight() {
    let right;
    if (props.shared.right == "WRITER")
      right = "READER"
    else
      right = "WRITER"

    fetch(`${BACKEND}/travels/${props.id}/share`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', authorization: token},
      body: JSON.stringify({'data': JSON.stringify({"user_to_share": props.shared.user_email, "rights": right})})
    })
    .then(response => response.text())
    .then(data => {
      if (JSON.parse(data).msg == "ok") {
        props.refresh();
      } else {
        alert('Une erreur est survenue lors de la modification des droits')
      }
    })
    .catch(error => console.log(error));
  }

  // function to delete the right
  function deleteRight() {
    fetch(`${BACKEND}/travels/${props.id}/share?user_to_share=${props.shared.user_email}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json', authorization: token},
    })
    .then(response => response.text())
    .then(data => {
      if (JSON.parse(data).msg == "ok") {
        props.refresh();
      } else {
        alert('Une erreur est survenue lors de la suppression des droits')
      }
    })
    .catch(error => console.log(error));
  }

  return (
      <View style={{marginTop:32}}>
        <Text style={[style.sectionSubTitle, styles.center]}>{props.shared.user_email}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <ButtonWithIcon
            style='light'
            onPress={deleteRight}
            icon='trash-can'
            //title='Supprimer'
          />
          {props.shared.right == "WRITER" ? (
          <ButtonWithIcon
            style='dark'
            onPress={modifyRight}
            icon='account-remove'
            title="N'autoriser que la lecture"
          />
          ):(
          <ButtonWithIcon
            style='dark'
            onPress={modifyRight}
            icon='account-plus'
            title="Autoriser l'écriture"
          />)}
        </View>
      </View>
  );
}

const style = StyleSheet.create({
  sectionTitle: {
    borderTopLeftRadius: 20,
    padding: 12,
    fontSize: 24,
    fontWeight: '600',
    backgroundColor: '#F9F9F9',
  },
  sectionSubTitle: {
    fontWeight: 'bold',
    borderBottomColor: '#CCC',
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderRadius: 20,
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

export default RightBloc;
