import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity,Alert } from 'react-native';
import { useState } from 'react';
import MapView, {Marker, Polyline} from 'react-native-maps';

export default function App() {
  // Função para converter graus em radianos
  function deg2rad(deg){
    return deg*(Math.PI/180)
  }

  // Cálculo da distância entre dois pontos de latitude/longitude, em KM
  function getDistanceFromLatLonInKM(lat1,lon1,lat2,lon2){
    const R = 6371 //Raio médio da terra em KM
    const dLat = deg2rad(lat2-lat1)
    const dLong = deg2rad(lon2-lon1)
    const a = 
          Math.sin(dLat/2)* Math.sin(dLat/2)+
          Math.cos(deg2rad(lat1))*
          Math.cos(deg2rad(lat2))*
          Math.sin(dLong/2)*
          Math.sin(dLong/2);
    const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    return R*c
  }

  // Array de marcadores (cada item é latitude e longitude)
  const [markers,setMarkers]=useState([])

  // Distância calculada em KM
  const[distance,setDistance]=useState(null)

  // Função será chamada quando o usuário toca no mapa
    const handleMapsPress = (event)=>{
      const{latitude,longitude}=event.nativeEvent.coordinate;

      // Se já temos 2 marcadores, não adicionamos mais
      if(markers.length>=2){
        Alert.alert("Limite de marcadores",
          "Clique em limpar para fazer um novo cálculo")
        return;
      }

      // Adiciona novo marcador
      const newMarkers = [...markers,{latitude,longitude}]
      setMarkers(newMarkers)

      // Se for o segundo marcador, calcula a distância
      if(newMarkers.length===2){
        const dist = getDistanceFromLatLonInKM(
          newMarkers[0].latitude,
          newMarkers[0].longitude,
          newMarkers[1].latitude,
          newMarkers[1].longitude
        )
        setDistance(dist.toFixed(2))// Arredonda para 2 casas decimais
      }
    }

    const handleDragEnd = (index, event)=>{
      const{latitude,longitude}=event.nativeEvent.coordinate;
      const newMarkers = [...markers]
      newMarkers[index] = {latitude,longitude}
      setMarkers(newMarkers)

       // Se for o segundo marcador, calcula a distância
      if(newMarkers.length===2){
        const dist = getDistanceFromLatLonInKM(
          newMarkers[0].latitude,
          newMarkers[0].longitude,
          newMarkers[1].latitude,
          newMarkers[1].longitude
        )
        setDistance(dist.toFixed(2))// Arredonda para 2 casas decimais
      }
    }

    // Limpar os marcadores da tela
    const handleClear = ()=>{
      setMarkers([]) // Limpa o estados que armazena os marcadores
      setDistance(null)// Limpa o estado que armazena a distância calculada
    }

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        {distance?<Text style={styles.infoText}>Distância calculada: {distance} KM</Text>:(
          <Text style={styles.infoText}>
            Toque em dois pontos no mapa para calcular distância
          </Text>
        )}
        <TouchableOpacity style={styles.button} onPress={handleClear}>
          <Text style={styles.buttonText}>Limpar</Text>
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        onPress={handleMapsPress}
        initialRegion={{
          latitude:-23.5505,
          longitude:-46.6333,
          latitudeDelta:0.05,
          longitudeDelta:0.05
        }}
      >
      {/* Renderiza o Polyline se houver dois marcadores no mapa */}
      {markers.length===2&&(
        <Polyline coordinates={markers} strokeColor='blue' strokeWidth={3}/>
      )}

      {/* Renderiza cada marcador de acordo com o que está presente no array */}
      {markers.map((m,index)=>{
        return(
          <Marker
            key={index}
            coordinate={m}
            pinColor={index===0?'blue':'red'}
            draggable
            onDragEnd={(e)=>handleDragEnd(index,e)}
          />
        )
      })}
      </MapView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  infoBox: {
    position: 'absolute',
    zIndex: 1,
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: '#4c4c4cff',
    borderRadius: 15,
    padding: 10
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8
  },
  button: {
    alignSelf: 'center',
    backgroundColor: "#1e7addff",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8
  },
  buttonText: {
    color: "#fff",
    fontWeight: 'bold'
  }
});