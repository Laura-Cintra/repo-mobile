import * as SQLite from "expo-sqlite"

// Abre ou cria o banco de dados local
const db = SQLite.openDatabaseSync("notas.db")

// Cria tabela 'notes' se ela não existir
db.execSync(`
    CREATE TABLE IF NOT EXISTS notes(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        createAt TEXT NOT NULL
    )    
`)

// Função para ler todas as notas do banco
export function getNotes(){
    return db.getAllSync('SELECT * FROM notes ORDER BY id DESC')
}

// Função para adicionar uma nova nota
export function addNote(title:string,content:string){
    const createAt = new Date().toISOString() // Pega data/hora atual
    db.runSync(
        'INSERT INTO notes (title,content,createAt) VALUES (?,?,?)',
        [title,content,createAt]
    )
}

// Função para atualizar a nota existente
export function updateNote(id:number,title:string,content:string){
    db.runSync(
        'UPDATE notes SET title=?, content=? WHERE id=?',
        [title,content,id]
    )
}
// Função para deletar uma nota pelo ID
export function deleteNote(id:number){
    db.runSync('DELETE FROM notes WHERE id=?',[id])
}