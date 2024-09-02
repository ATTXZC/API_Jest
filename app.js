const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 6003;

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Substitua pelo seu usuário do MySQL
    password: 'cimatec', // Substitua pela sua senha do MySQL
    database: 'leads', // Nome do seu banco de dados
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao banco de dados MySQL.');
});

// Servir o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para inserir dados
app.post('/submit', (req, res) => {
    const { nome, email, telefone } = req.body;
    const query = 'INSERT INTO email (nome, email, telefone) VALUES (?, ?, ?)';
    db.query(query, [nome, email, telefone], (err, result) => {
        if (err) {
            throw err;
        }
        res.json({ message: 'Dados inseridos com sucesso!' });
    });
});

// Rota para buscar dados
app.get('/getData', (req, res) => {
    const query = 'SELECT * FROM email';
    db.query(query, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});

// Rota para atualizar dados
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone } = req.body;
    const query = 'UPDATE email SET nome = ?, email = ?, telefone = ? WHERE id = ?';
    db.query(query, [nome, email, telefone, id], (err, result) => {
        if (err) {
            throw err;
        }
        res.json({ message: 'Dados atualizados com sucesso!' });
    });
});

// Rota para deletar dados
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM email WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            throw err;
        }
        res.json({ message: 'Dados deletados com sucesso!' });
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
