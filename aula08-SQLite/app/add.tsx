import { View,TextInput,Button,Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { addNote } from "../src/db/notes";
import { MotiView, MotiText } from "moti";

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
        <MotiView 
            from={{opacity: 0, translateY: 40}}
            animate={{opacity: 1, translateY: 0}}
            transition={{type: 'timing', duration: 500}}
            style={{flex: 1, padding: 20}}>
            <MotiView
                from={{opacity: 0, translateX: -30}}
                animate={{opacity: 1, translateX: 0}}
                transition={{delay: 300}}
            >
                <TextInput 
                    placeholder="Título"
                    value={title}
                    onChangeText={(value)=>setTitle(value)}
                    style={{borderWidth:1,padding:10,
                        marginBottom:10,borderRadius:6
                    }}
                />
            </MotiView>

            <MotiView
                from={{opacity: 0, translateX: 30}}
                animate={{opacity: 1, translateX: 0}}
                transition={{delay: 300}}
            >
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
            </MotiView>
            <MotiView
                from={{scale: 1}}
                animate={{scale: 1.05}}
                transition={{
                    loop: true, 
                    type: 'timing', 
                    duration: 1000
                }}
            >
                <Button title="SALVAR" onPress={handleSave}/>
            </MotiView>
        </MotiView>
    )
}