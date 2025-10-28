import { View, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { addNote } from "../src/db/notes";
import { MotiView } from "moti";
import { generateTitleFromContentHF } from "@/src/ia/generateTitleHF";
import { translateToEnglish } from "@/src/services/translationService";

export default function AddNoteScreen(){
    const[title, setTitle] = useState("") // Estado do título
    const[content, setContent] = useState("") // Estado do conteúdo
    const[loading, setLoading] = useState(false) // Estado de loading da IA
    const[translated, setTranslated] = useState("")
    const [loadingTranlate, setLoadingTranslate] = useState(false)

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

    // Função para gerar o título com IA
    async function handleGenerateTitle() {
        if(!content.trim()){
            Alert.alert("Anteção","Digite algo no conteúdo antes de gerar o título.")
            return
        }
        setLoading(true)
        const generated = await generateTitleFromContentHF(content)
        if(generated){
            setTitle(generated)
            setLoading(false)
        }
    }

    // Se o conteúdo tiver informação, vai exibir
    async function handleTranslate() {
        // Validação simples
        if(!content.trim()){
            Alert.alert("Atenção", "Digite algum conteúdo para ser traduzido.")
            return
        }

        try{
            setLoadingTranslate(true)
            console.log("Traduzindo texto", content);
            
            const result = await translateToEnglish(content)
            console.log("Texto traduzido: ", result);
            
            setTranslated(result)
            setLoadingTranslate(false)
        }catch(error){
            console.log("Erro na tradução", error);
            Alert.alert("Erro", "Ocorreu um erro ao traduzir o texto!")
        }
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
                from={{opacity: 0, translateX: 30}}
                animate={{opacity: 1, translateX: 0}}
                transition={{delay: 300}}
            >
                <TextInput 
                    placeholder="Translation in English"
                    value={translated || ""} // Garantir que nunca seja undefined
                    onChangeText={(value)=>setContent(value)}
                    editable={false}
                    multiline
                    style={{borderWidth:1,padding:10,
                        height:120, borderRadius:6,
                        marginBottom:10
                    }}
                />
            </MotiView>
            
            <MotiView
                style={{marginBottom:10}}
                from={{opacity:0.8,scale:1}}
                animate={{opacity:1,scale:1.05}}
                transition={{
                    loop:true,
                    type:'timing',
                    duration:1000
                }}
            >
                
             <Button
                title="Gerar Título com IA"
                onPress={handleGenerateTitle}
                disabled={loading}
             />
            </MotiView>

            <MotiView
                style={{marginBottom:10}}
                from={{opacity:0.8,scale:1}}
                animate={{opacity:1,scale:1.05}}
                transition={{
                    loop:true,
                    type:'timing',
                    duration:1000
                }}
            >
                
             <Button
                title="Traduzir para o inglês"
                onPress={handleTranslate}
                disabled={loadingTranlate}
                color="purple"
             />
            </MotiView>

            <MotiView
                from={{opacity:0.8,scale:1}}
                animate={{opacity:1,scale:1.05}}
                transition={{
                    loop:true,
                    type:'timing',
                    duration:1000
                }}
            >

             <Button title="SALVAR" onPress={handleSave} color="red"/>
            </MotiView>
        </MotiView>
    )
}