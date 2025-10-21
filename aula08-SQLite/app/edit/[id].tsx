import React, { useEffect, useState } from 'react'
import { Alert, Button, TextInput, View } from 'react-native'
import { MotiView } from "moti";
import { useLocalSearchParams, useRouter } from 'expo-router'

// Importando fuções do banco SQLite
import { getNotes, updateNote } from '@/src/db/notes'


// Definindo a interface Note para tipar as notas
interface Note {
    id: number,
    title: string,
    content: string,
    createdAt: string
}

export default function EditNoteScreen() {
    // Pega o parâmentro da rota
    const params = useLocalSearchParams<{ id: string }>()
    const router = useRouter() // Hook de navegação

    // Estados para armazenar título e conteúdo da nota
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    // useEffect
    useEffect(() => {
        if (!params.id) return // Se não tiver o id, não faz nada

        const note = (getNotes() as Note[])
            .find(n => n.id === Number(params.id))

        // Se encontrou a nota, preenche os estados
        if (note) {
            setTitle(note.title)
            setContent(note.content)
        }
    }, [params.id])

    // Função chamada ao clicar em "Atualizar nota"
    function handleUpdate() {
        if (!title.trim()) { // Validação simples, título não pode estar vazio
            Alert.alert("Atenção", "Digite um título.")
            return
        }

        // Atualiza a note SQLite
        updateNote(Number(params.id), title, content)

        // Volta na tela anterior
        router.back()

    }
    // Renderiza a interface
    return (
        <MotiView 
            from={{opacity: 0, translateY: 40}}
            animate={{opacity: 1, translateY: 0}}
            transition={{type: 'timing', duration: 500}}
            style={{flex: 1, padding: 20}}
        >
            <TextInput
                placeholder="Título"
                value={title}
                onChangeText={(value) => setTitle(value)}
                style={{
                    borderWidth: 1, padding: 10,
                    marginBottom: 10, borderRadius: 6
                }}
            />
            <TextInput
                placeholder="Conteúdo"
                value={content}
                onChangeText={(value) => setContent(value)}
                multiline
                style={{
                    borderWidth: 1, padding: 10,
                    height: 120, borderRadius: 6,
                    marginBottom: 10
                }}
            />
            <MotiView
                from={{scale: 1}}
                animate={{scale: 1.05}}
                transition={{
                    loop: true, 
                    type: 'timing', 
                    duration: 1000
                }}
            >
                <Button title="ATUALIZAR NOTA" onPress={handleUpdate} />
            </MotiView>
        </MotiView>
    )
}