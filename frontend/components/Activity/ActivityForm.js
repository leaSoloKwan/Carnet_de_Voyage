import React, {useState, useEffect} from 'react';
import {TextInput, Text, View, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import Button from '../General/Button';
import DatePick from '../General/DatePick';
import { styles } from '../../RootNavigation';

const baseUrl = "https://api-adresse.data.gouv.fr/search/?q=";

/* Form to modify or create a travel.
Field 'place' with autocompletion for the France
DateTime fiels of type DataPick
*/

const ActivityForm = props => {
  const [startDate, setStartDate] = useState(props.initialValues.start);
  const [endDate, setEndDate] = useState(props.initialValues.end);
  const [place, setPlace] = useState(props.initialValues.place);
  const [dataInput, setDataInput] = useState([]);
  const [hideResult, setHideResult] = useState(true);

  useEffect(() => {
    completion([place]);
  }, [place]);

  // function to autocomplete the place value
  async function completion (query) {
    let result = []
    if(query != ""){
      fetch(`${baseUrl}+${query}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      })
      .then(response => response.text())
      .then(dataInput => {
        if(dataInput){
          let features = JSON.parse(dataInput).features;
          features.forEach((item) => {
           
            if(!result.includes(item.properties.label)){
              result.push(item.properties.label)
            }
          })
        }
        setDataInput(result);
      });
    } else {
      setDataInput(result);
    }
  }

  // functions to validate the data in the form
  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required('Le titre du voyage est requis.'),
    place: yup
      .string()
      .required('La localisation est requise.'),
    type: yup
      .string()
      .required('Le type est requis.'),
  })
  const [errorDate, setErrorDate] = useState(false);

  useEffect(() => {
    if(startDate > endDate) {
      setErrorDate(true);
    } else {
      setErrorDate(false);
    }
  }, [startDate, endDate])

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ name: props.initialValues.name,type: props.initialValues.type, place: props.initialValues.place, place: place, start: startDate, end: endDate}}
      onSubmit={values => {values.place = place; values.start = startDate; values.end = endDate; if (!errorDate) props.submit(values);}}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        isValid,
      }) => (
        <>
          <Text style={styles.sectionSubTitle}>Titre de l'activite</Text>
          <TextInput
            testID='name'
            name="name"
            placeholder="Mon activité"
            style={styles.textInput}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
          />
          {errors.name &&
            <Text style={{ fontSize: 10, color: 'red' }}>{errors.name}</Text>
          }
          <Text style={styles.sectionSubTitle}>Type de l'activite</Text>
          <TextInput
            testID='type'
            name="type"
            placeholder="Mon type d'activité"
            style={styles.textInput}
            onChangeText={handleChange('type')}
            onBlur={handleBlur('type')}
            value={values.type}
          />
          {errors.type &&
            <Text style={{ fontSize: 10, color: 'red' }}>{errors.type}</Text>
          }
          <Text style={styles.sectionSubTitle}>Lieu</Text>
          <TextInput
            testID='place'
            name="place"
            placeholder="Adresse, Ville, Région, etc."
            style={styles.textInput}
            onChangeText={(text) => {setHideResult(false);setPlace(text); values.place=text}}
            value={place}
            onSubmitEditing={() => setHideResult(true)}
            onFocus={() => setHideResult(false)}
          />
          {!hideResult && (
            <View style={styles.sectionAutocomplete}>
              {dataInput.map(item => 
                <TouchableOpacity style={styles.resultAutocomplete} onPress={() => {setPlace(item); setHideResult(true)}} key={item}><Text>{item}</Text></TouchableOpacity>
              )}
            </View>
          )}
          {errors.place &&
            <Text style={{ fontSize: 10, color: 'red' }}>{errors.place}</Text>
          }
          <Text style={styles.sectionSubTitle}>Dates de l'activite</Text>
          <DatePick
            onChangeText={() => {handleChange('start')}}
            onBlur={() => {handleBlur('start')}}
            testID='start'
            name="start"
            setDate={setStartDate}
            error={errors.start}
            label="Début"
            date={new Date(props.initialValues.start)}
          />
          <DatePick
            onChangeText={() => {handleChange('end')}}
            onBlur={() => {handleBlur('end')}}
            testID='end'
            name="end"
            setDate={setEndDate}
            error={errors.end}
            label="Fin"
            date={new Date(props.initialValues.end)}
          />
          {errorDate &&
            <Text style={{ fontSize: 10, color: 'red' }}>La date de début du voyage doit être avant la date de fin.</Text>
          }
          <Button
            testID="save"
            onPress={handleSubmit}
            title="Sauvegarder"
            disabled={!isValid}
          />
        </>
      )}
    </Formik>
  );
};

export default ActivityForm;
