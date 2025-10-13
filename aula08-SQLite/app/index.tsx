import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { getNotes } from "../src/db/notes";

export default function HomeScreen() {
  const [ notes, setNotes ] = useState<any[]>([]) // Estado será para armazenar todas as notas
  const router = useRouter() // Hook de navegação

  // Sempre será executado quando a tela estiver em foco
  useFocusEffect(
    useCallback(()=>{
      setNotes(getNotes())// Carrega as notas do banco
    },[])
  )
  return (
    <View
      style={styles.container}
    >
      <Button title="Adicionar Nota" onPress={()=>router.push("/add")}/>
      
      <FlatList 
        data={notes}
        renderItem={({item})=>(
          <View
            style={{
              borderBottomWidth:1,
              padding:10,
              marginBottom:5
            }}
          > 
            <Text>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container:{
    flex:1
  }
})