import { Text,Button,Alert, TextInput, StyleSheet, ActivityIndicator, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { deleteUser } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, collection, addDoc, db, getDocs } from "../src/services/firebaseConfig";
import ItemLoja from "../src/components/ItemLoja";
import ThemeToggleButton from "../src/components/ThemeToggleButton";
import { useTheme } from "../src/context/ThemeContext";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configuração global das notificações no foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true, // exibe o banner da notificação
        shouldShowList: true, // exibe o histórico
        shouldPlaySound: true, //toca som
        shouldSetBadge: false //não altera o badge do app
    })
})

export default function HomeScreen() {
    const {colors} = useTheme()//Obtenho a paleta de cores(dark ou light)
    const [ title, setTitle ] = useState('');
    const router = useRouter()//Hook de navegação entre telas
    interface Item{
        id:String;
        title:String;
        isChecked:boolean;
    }

    const [ listaItems, setListaItems ] = useState<Item[]>([])

    const realizarLogoff = async()=>{
        await AsyncStorage.removeItem('@user')
        router.push('/')
    }

    const excluirConta = () =>{
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita!",
            [
                {text:"Cancelar",style:"cancel"},
                {text:"Excluir",style:'destructive',
                    onPress:async()=>{
                        try{
                            const user = auth.currentUser
                            if(user){
                                await deleteUser(user)//Apaga do firebase Auth
                                await AsyncStorage.removeItem('@user')
                                Alert.alert("Conta Excluída", "Sua conta foi excluída com sucesso!")
                                router.replace('/')
                            } else{
                                Alert.alert("Erro", "Nenhum usuário logado.")
                            }
                        } catch (error) {
                            console.log("Erro ao excluir a conta: ", error);
                            Alert.alert("Error", "Não foi possível excluir conta")
                        }
                    }
                }
            ]
        )
    }

    const salvarItem = async() => {
        try{
            const docRef = await addDoc(collection(db,'items'),{
                title: title,
                isChecked: false, // botão que vai atualizar automaticamente
            })
            Alert.alert("Sucesso", "Produto salvo com sucesso!")
            console.log("Documento Salvo", docRef.id);
            setTitle('')//Limpa o TextInput
        }catch(e){
            console.error("Error adding document: ", e);
        }
    }

    const buscarItems = async() => {
        try{
            const querySnapshot = await getDocs(collection(db, "items"));
            const items: any[] = [];
            querySnapshot.forEach((item) => {
                items.push({
                    ...item.data(),
                    id: item.id
                })
            })
            // console.log("Itens encontrados: ", items)
            setListaItems(items)//Atualiza o estado com as informações do array
        } catch (error) {
            console.error("Erro ao buscar os dados: ", error);
        }
    }

    const dispararNotificacao = async() => { // notificação local
        await Notifications.scheduleNotificationAsync({
            content:{
                title: "Promoções disponíveis", // título da notificação
                body: "Não perca nossas promoções do dia 08/09/2025"// corpo da notificação
            },
            trigger:{
                type:"timeInterval", //Tipo do trigger: Intervalo de tempo
                seconds:2, // aguarda 02 segundos antes de disparar
                repeats:false, //não repete
            } as Notifications.TimeIntervalTriggerInput // cast para o tipo correto
        })
    }

    useEffect(()=>{
        buscarItems()
    },[listaItems])

    useEffect(()=>{
        (async()=>{
            if (Device.isDevice){
            // Verificar se já tem de permisão de notificação
            const{status:existingStatus} = await Notifications.getPermissionsAsync()
            let finalStatus = existingStatus

            // Se não tiver permissão, solicita ao usuário
            if(existingStatus!=="granted"){
                const {status} = await Notifications.requestPermissionsAsync()
                finalStatus = status
            }

            // Se ainda não foi permitido o uso das notificações
            if(finalStatus!=="granted"){
            alert("Permissão para notificação não concedida")
           }
        }})()
    },[])

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView // componente que ajusta automaticamente o layout
                style={styles.container}
                behavior={Platform.OS==='ios'?'padding':'height'} // No IOS é utilizado padding pra fazer esse ajuste, e no android o height
                keyboardVerticalOffset={20} // Descola o conteúdo na vertical em 20 pixels
            >
            
            <ThemeToggleButton/>
            <Text style={[styles.texto, {color: colors.text}]}>Seja bem-vindo a Tela Inicial da Aplicação</Text>
            <Button title="Sair da Conta" onPress={realizarLogoff}/>
            <Button title="Exluir conta" color='red' onPress={excluirConta}/>
            <Button title="Alterar Senha" onPress={() => router.push("/AlterarSenha")}/>
            <Button title="Enviar notificação" color='purple' onPress={dispararNotificacao} />

            {listaItems.length<=0?(
                <ActivityIndicator />
            ):(
                <FlatList 
                    data={listaItems}
                    renderItem={({ item }) => (
                       <ItemLoja 
                        title={item.title} 
                        isChecked={item.isChecked}
                        id={item.id}
                       />
                    )}
                />
            )}

            <TextInput  placeholder="Digite o nome do produto" 
                        style={[styles.input,{
                            backgroundColor:colors.input,
                            color:colors.inputText
                        }]}
                        placeholderTextColor={colors.placeHolderTextColor}
                        value={title}
                        onChangeText={(value) => setTitle(value)}
                        onSubmitEditing={salvarItem}/>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    input:{
        backgroundColor: 'lightgray',
        padding: 10,
        fontSize: 15,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 'auto',
    },
    texto:{
        fontSize:16,
        fontWeight:'bold'
    }
})