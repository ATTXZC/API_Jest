const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// Crie uma instância express
const app = express();

// Middleware
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

// Defina suas rotas
app.post('/submit', (req, res) => {
    const { nome, email, telefone } = req.body;
    const query = 'INSERT INTO email (nome, email, telefone) VALUES (?, ?, ?)';
    db.query(query, [nome, email, telefone], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao inserir dados' });
        }
        res.json({ message: 'Dados inseridos com sucesso!' });
    });
});

app.get('/getData', (req, res) => {
    const query = 'SELECT * FROM email';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao buscar dados' });
        }
        res.json(results);
    });
});

// Testes
describe('API Endpoints', () => {
    it('should insert data successfully', async () => {
        const response = await request(app)
            .post('/submit')
            .send({ nome: 'John Doe', email: 'john@example.com', telefone: '1234567890' });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Dados inseridos com sucesso!');
    });

    it('should fetch data successfully', async () => {
        const response = await request(app)
            .get('/getData');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
