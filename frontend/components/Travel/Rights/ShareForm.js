import React from 'react';
import {TextInput, Text } from 'react-native';
import { Formik } from 'formik'
import * as yup from 'yup';
import Button from '../../General/Button';
import { styles } from '../../../RootNavigation';

/* Form to add right to an user for a travel.
*/

const ShareForm = props => {
  // functions to validate the data in the form
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email")
      .required("L'email de l'utilisateur est requis."),
  })

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ email: '' }}
      onSubmit={values => {props.send({user_to_share: values.email, rights: props.right})}}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
        <>
          <TextInput
            name="email"
            placeholder="Email de l'utilisateur"
            style={[styles.textInput, {marginVertical: 10}]}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.title}
          />
          {errors.email &&
            <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
          }
          <Button
            onPress={handleSubmit}
            title={props.right=="WRITER"? 'Partager en écriture':'Partager en lecture'}
            disabled={!isValid}
          />
        </>
      )}
    </Formik>
  );
};

export default ShareForm;
