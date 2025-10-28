import axios from "axios";

// Tipando a resposta vindo da requisição
interface TranslationResponse{
    reponseData:{
        translatedText: string // Texto traduzido pela api
    }
}

// Configurações constantes da API
const API_CONFIG = {
    url: "https://api.memory.translated.net/get",
    retries: 3, // Número máximo de tentativas em caso de erro
    delay: 1000, // Delay de 1 segundo em cada
    timeout: 10000, // Tempo máximo esperando uma resposta
} as const;

async function makeTranslationRequest(text:string): Promise<string> {
    // Configuração da requisição GET
    const requestConfig = {
        params: {q: text, langpair: 'pt|en'},
        headers:{
            'Accept': '*/*', // Aceita qualquer tipo de resposta
            'Accept-Encoding': 'gzip,deflate,br', // Compactação
            'Connection': 'keep-alive' // Mantém a conexão aberta
        },
        timeout: API_CONFIG.timeout
    }
    // Chama a API usando Axios e tipa a resposta
    const response = await axios.get<TranslationResponse>(API_CONFIG.url, requestConfig)

    // retorna o texto traduzido
    return response.data.reponseData.translatedText
}

export async function translateToEnglish(text:string): Promise<string>{
    // Validação simples que se o texto estiver vazio, retorno uma string vazia
    if(!text.trim()) return ""

    // Loop de retry
    for (let attempt = 1; attempt <= API_CONFIG.retries; attempt++){
        try{
            // Tenta realizar a requisição de tradução
            return await makeTranslationRequest(text)
        } catch(error){
            console.log(`Tentativa: ${attempt}/3 falhou`, error);
        }
    }

    // Se todas as tentativas falharem, retorna uma string vazia
    return ""
}