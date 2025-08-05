import axios from "axios";

API_URL = "https://689098e2944bf437b5969914.mockapi.io/users"

export const fetchPosts = async () => {
    const response = await axios.get(API_URL);
    return response.data; // retorna os dados da requisição
}