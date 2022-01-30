import React, {useState, useContext, useEffect} from 'react';
import { View, Text } from 'react-native';
import { styles, BACKEND, navigate, TokenContext } from '../../RootNavigation';
import TravelBloc from './TravelBloc';
import Background from '../General/Background';
import ButtonWithIcon from '../General/ButtonWithIcon';

/* Display the list of the travels (shared only or not shared only) in three categories :
- previous travels
- actual travels
- further travels
*/

function MyTravels(props) {
    const { token } = useContext(TokenContext);
    const [actualTravel, setActualTravel] = useState([]);
    const [previousTravels, setPreviousTravels] = useState([]);
    const [furtherTravels, setFurtherTravels] = useState([]);
    
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            let url= `${BACKEND}/travels/`
            if (props.route.params.shared)
                url = url + '/shared'

            fetch(url, {
                method: 'GET',
                headers: {'Content-Type': 'application/json', authorization: token},
            })
            .then(response => response.text())
            .then(data => {
                var travels = JSON.parse(data);
                var date = new Date();
                var tmpTravel = travels.shift();
                var tmpFurtherTravels = [];
                var tmpPreviousTravels = [];
                var tmpActuelTravel = [];
                
                // Further travels
                while ( tmpTravel !== undefined && new Date(tmpTravel.start) > date) {
                    tmpFurtherTravels.push(tmpTravel);
                    tmpTravel = travels.shift();
                }
                while ( tmpTravel !== undefined ) {
                    // Actual travel
                    if(new Date(tmpTravel.start) <= date && new Date(tmpTravel.end) >= date) {
                        tmpActuelTravel.push(tmpTravel);
                    } 
                    // Previous travels
                    else {
                        tmpPreviousTravels.push(tmpTravel);
                    }
                    
                    tmpTravel = travels.shift();
                }

                setActualTravel(tmpActuelTravel);
                setFurtherTravels(tmpFurtherTravels);
                setPreviousTravels(tmpPreviousTravels);
            })
            .catch(error => console.log(error));
        })
        
        return unsubscribe;
    }, [props.navigation]);
  
    return (
      <Background content={
        <View>
            { props.route.params.shared ? (null):
            <ButtonWithIcon testID='create' style='right'
                onPress={() => navigate("Action on a travel", {navigationTitle: 'Créer un nouveau voyage', method: 'POST'})}
                icon='plus-circle'
                title='Nouveau voyage'
            />}
            <View style={{marginHorizontal: 24, marginTop: 32}}>
                {actualTravel.map(tmpTravel => TravelBloc(tmpTravel))}
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Voyages à venir</Text>
                {furtherTravels.map(tmpTravel => TravelBloc(tmpTravel))}
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Voyages finis</Text>
                {previousTravels.map(tmpTravel => TravelBloc(tmpTravel))}
            </View>
        </View>
      } />
    );
}

export default MyTravels;