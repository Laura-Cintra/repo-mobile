import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../src/services/firebaseConfig';
import { useTheme } from '../src/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import ThemeToggleButton from '../src/components/ThemeToggleButton';

export default function LoginScreen() {
  
  // Hook do i18next, que fornece a função t, para buscar e traduzir para o idioma atual
  const {t, i18n} = useTranslation();

  // Hook do tema da aplicação
  const {colors} = useTheme();

  // Estados para armazenar os valores digitados
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const router = useRouter(); // Hook para navegação

  useEffect(() => {
    const verificarUsuarioLogado = async () => {
      try{
        const usuarioSalvo = await AsyncStorage.getItem('@user');
        if (usuarioSalvo) {
          router.push('/HomeScreen'); // Se tiver armazenado local, redireciono para a HomeScreen
        }
      } catch (error) {
        console.log("Erro ao verificar login", error);
      }
    }
    
    // Chama a função estruturada acima
    verificarUsuarioLogado();
  }, [])

  // Função para simular o envio do formulário
  const handleLogin= () => {
    if ( !email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }
    // Função para realizar o login
    signInWithEmailAndPassword(auth, email, senha)
      .then(async(userCredential) => {
        // armazenando as credenciais do usuário
        const user = userCredential.user
        await AsyncStorage.setItem('@user', JSON.stringify(user))
        router.push('/HomeScreen')
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log("Error Messagem: ", errorMessage);
        if(error.code === 'auth/invalid-credential'){
          Alert.alert("Error","Verifique email e senha digitados.")
        }
      })
  };

  // Função para enviar o e-mail de reset de senha para o usuário
  const esqueceuSenha = () => {
    if(!email){
      alert("Digite o email para recuperar a senha")
      return
    }
    sendPasswordResetEmail(auth, email)
      .then(() => { alert("Enviado o email de recuperação") })
      .catch((error) => console.log("Erro ao enviar email ", error.message))
        alert("Erro ao enviar email. Verifique se o email está correto.")
  }

  // Função para alterar o idioma
  const mudarIdioma = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  return (
    <View style={[styles.container,{backgroundColor:colors.background}]}>
      
      <ThemeToggleButton/>
      
      <View style={styles.langContainer}>
        <TouchableOpacity onPress={() => mudarIdioma('pt')}>
          <Text style={[styles.langText, {color: colors.text}]}>PT</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => mudarIdioma('eng')}>
          <Text style={[styles.langText, {color: colors.text}]}>EN</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.titulo,{color:colors.text}]}>{t("login")}</Text>

      {/* Campo Email */}
      <TextInput
        style={[styles.input, {backgroundColor: colors.input, color:colors.inputText}]}
        placeholder="E-mail"
        placeholderTextColor={colors.inputText}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Campo Senha */}
      <TextInput
        style={[styles.input, {backgroundColor: colors.input, color:colors.inputText}]}
        placeholder={t('password')}
        placeholderTextColor={colors.inputText}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Botão */}
      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.textoBotao}>Login</Text>
      </TouchableOpacity>

      <Link href="CadastrarScreen" style={[{marginTop:20,color:'white',marginLeft:150}, {color: colors.text}]}>Cadastre-se</Link>
      
      {/* Botão */}
      <Text style={[{color: 'white', justifyContent: 'center', marginLeft: 130, cursor: 'pointer'}, {color: colors.text}]} onPress={esqueceuSenha}>Esqueceu a senha</Text>
    </View>
  );
}

// Estilização
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 20,
  },
  langContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'flex-end',
    padding: 20,
  },
  langText: {
    fontSize: 17,
    fontWeight: 'bold',
    margin: 2
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  botao: {
    backgroundColor: '#00B37E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
