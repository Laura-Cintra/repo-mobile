import { View,TextInput,Button,Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { addNote } from "../src/db/notes";

export default function AddNoteScreen(){
    const[ title, setTitle ] = useState("") // Estado do título
    const[ content, setContent ] = useState("") // Estado do conteúdo
    const router = useRouter()// Hook para navegação

    // Função chamada ao pressionar "Salvar"
    function handleSave(){
        if(!title.trim()){ // Validação simples com campo titulo
            Alert.alert("Atenção","Digite um título para a nota.")
            return
        }
        addNote(title,content) // Adiciona no banco
        router.back() // Volta para a tela HomeScreen
    }

    return(
        <View style={{flex:1,padding:20}}>
            <TextInput 
                placeholder="Título"
                value={title}
                onChangeText={(value)=>setTitle(value)}
                style={{borderWidth:1,padding:10,
                    marginBottom:10,borderRadius:6
                }}
            />
            <TextInput 
                placeholder="Conteúdo"
                value={content}
                onChangeText={(value)=>setContent(value)}
                multiline
                style={{borderWidth:1,padding:10,
                    height:120, borderRadius:6,
                    marginBottom:10
                }}
            />
            <Button title="SALVAR" onPress={handleSave}/>
        </View>
    )
}