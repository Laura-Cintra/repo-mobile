// Importa o Axios para fazer requisições HTTP
import axios from "axios";

const HF_API_KEY = process.env.EXPO_PUBLIC_HF_API_KEY

// Função para gerar título curto a partir de conteúdo da nota.
// O conteúdo(descrição da nota para ser usado como base para gerar o título)
// A função deverá retornar uma dado do tipo string

export async function generateTitleFromContentHF(content:string) {
    // Se o conteúdo estiver vazio, retorna uma string vazia
    if(!content.trim()) return "";
    
    try{
        // Requisição POST para API de inferência da Hugging Face
        const response = await 
        axios.post("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", // Url do modelo
            {
                // input é o texto que será processado
                inputs:content,
                // Parameters são configurações adicionais do modelo
                parameters:{
                    max_length: 20,      //Tamanho máximo do título gerado
                    min_length: 10,       //Tamanho mínimo
                    do_sample: false,    //caso true, gera variações aleatórias
                    early_stopping: true //Encerra geração assim que o modelo achar adequado.
                }
            },
            {
                // Cabeçalho da requisição
                headers:{
                    Authorization:`Bearer ${HF_API_KEY}`, // Autenticação
                    "Content-Type":"application/json", // Tipo do conteúdo
                }
            }
        )

        // O modelo retornar um array de resultado.
        // Alguns modelos usam 'summary_text', outros 'generated_text'
        const generatedText = response.data?.[0]?.summary_text || response.data?.[0]?.generated_text|| ""

        // Retorna o título gerado
        return generatedText.trim() // Sem espaços no começo/fim

    }catch(error){
        // Se der error, mostra no console e retorna uma string vazia
        console.log("Erro na geração do título: ",error)
        return ""
    }

}