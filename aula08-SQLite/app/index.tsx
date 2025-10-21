import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, Button, FlatList, StyleSheet, Text, View } from "react-native";
import { getNotes, deleteNote } from "../src/db/notes";
import { MotiView, MotiText } from "moti";

export default function HomeScreen() {
  const [ notes, setNotes ] = useState<any[]>([]) // Estado será para armazenar todas as notas
  const router = useRouter() // Hook de navegação

  // Sempre será executado quando a tela estiver em foco
  useFocusEffect(
    useCallback(()=>{
      setNotes(getNotes())// Carrega as notas do banco
    },[])
  )

  // Função para deletar a nota
  function handleDelete(id:number){
    Alert.alert(
    "Confirmar Exclusão",
    "Tem certeza que deseja excluir esta nota?",
      [
        { 
          text: "Cancelar", 
          style: "cancel" 
        },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              deleteNote(id) // Deleta do banco de dados SQLite
              
              setNotes(getNotes()) // Atualiza a lista sem a nota que foi removida na linha acima 
              
              // Exibe uma mensagem de sucesso
              Alert.alert("Nota Excluída", "A nota foi excluída com sucesso!");
            } catch (error) {
              console.log("Erro ao excluir a nota: ", error);
              Alert.alert("Erro", "Não foi possível excluir a nota.");
            }
          }
        }
      ]
    );
  }

  return (
    <View
      style={styles.container}
    >
      <Button title="Adicionar Nota" onPress={()=>router.push("/add")}/>
      
      <FlatList 
        data={notes}
        keyExtractor={item=>item.id.toString()}
        renderItem={({item, index})=>(
          <MotiView
            from={{opacity: 0, translateY: 20}}
            animate={{opacity: 1, translateY: 0}}
            transition={{delay: index * 250}}

            style={{
              borderBottomWidth:1,
              padding:10,
              marginBottom:5
            }}
          > 
            <MotiText 
              from={{scale: 0.90}}
              animate={{scale: 1}}
              transition={{type: "timing", duration: 300}}
              style={{fontWeight:'bold'}}
            >
              {item.title}
            </MotiText>
            <Text>{item.content}</Text>

            <View style={{flexDirection:'row',gap:5,marginTop:5}}>
              {/* Botão Editar */}
              <View style={{width:100}}>
                <Button
                  title="Editar"
                  onPress={()=>router.push(`/edit/${item.id}`)}
                />
              </View>
              {/* Botão Deletar */}
              <View style={{width:100}}>
                <Button title="Deletar" color="#bb0c0cff" onPress={()=>handleDelete(item.id)}/>
              </View>
            </View>
          </MotiView>
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