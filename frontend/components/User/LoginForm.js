import React, {useState} from 'react';
import {TextInput, View, StyleSheet} from 'react-native';
import Button from '../General/Button';

/* Component to log in
*/

const LoginForm = props => {
  const [login, setlogin] = useState('');
  const [password, setPassword] = useState('');
  return (
    <View>
      <TextInput testID='login'
        style={[styles.input, {marginTop:20}]}
        onChangeText={setlogin}
        value={login}
        placeholder="Login"
      />
      <TextInput testID='password'
        style={[styles.input, {marginBottom:20}]}
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
      />
      <Button testID='connect'
        title="Se connecter"
        onPress={() => props.onConnect(login, password)}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1},
  input: {height: 40, margin: 12, borderWidth: 1},
});
export default LoginForm;
