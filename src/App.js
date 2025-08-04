import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "./api/posts"; // Importa a função para buscar os posts

export default function App() {
    // useQuery é um hook principal do Tanstack Query
    const { data, isLoading, error , isError } = useQuery({
        queryKey: ['posts'], // chave única para identificar a consulta
        queryFn: fetchPosts, // função que busca os dados (faz a requisição)
    });

    // Exibe um activityIndicator enquanto os dados estão sendo carregados
    if(isLoading) {
        return <ActivityIndicator size="large" style={styles.center}/>;
    }
}