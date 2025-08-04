import axios from "axios";

export const fetchPosts = async () => {
    const response = await axios.get("https://689098e2944bf437b5969914.mockapi.io/users");
    return response.data; // retorna os dados da requisição
}