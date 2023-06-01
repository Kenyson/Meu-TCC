const express = require('express');
const app = express();
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const porta = 3000;

const dbPath = 'C:/Users/Kenyson/Desktop/TCC/Meu-TCC/pms/backend/database.db';
const db = new sqlite3.Database(dbPath);

app.use(express.json());
app.use(cors());

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS medico (
      crm INTEGER PRIMARY KEY,
      estado TEXT,
      nome TEXT,
      sobrenome TEXT,
      telefone TEXT,
      especialidade TEXT,
      senha TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS pacientes (
      id INTEGER PRIMARY KEY,
      nome TEXT,
      sobrenome TEXT,
      cpf TEXT,
      data_nascimento TEXT,
      telefone TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS receitas (
      id INTEGER PRIMARY KEY,
      nome_comercial TEXT,
      principio_ativo TEXT,
      indicacao TEXT,
      medico_id INTEGER,
      paciente_id INTEGER,
      data_prescricao TEXT,
      posologia TEXT,
      observacoes TEXT,
      FOREIGN KEY (medico_id) REFERENCES medico (crm),
      FOREIGN KEY (paciente_id) REFERENCES pacientes (id)
    )
  `);
});

app.post('/medicos', (req, res) => {
  const novoMedico = req.body;
  db.run(
    'INSERT INTO medico (crm, estado, nome, sobrenome, telefone, especialidade, senha) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [novoMedico.crm, novoMedico.estado, novoMedico.nome, novoMedico.sobrenome, novoMedico.telefone, novoMedico.especialidade, novoMedico.senha],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao adicionar médico ao banco de dados.');
      } else {
        novoMedico.id = this.lastID;
        res.status(201).json(novoMedico);
      }
    }
  );
});

app.get('/medicos', (req, res) => {
  db.all('SELECT * FROM medico', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao obter médicos do banco de dados.');
    } else {
      res.json(rows);
    }
  });
});

app.get('/pacientes', (req, res) => {
  db.all('SELECT * FROM pacientes', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao obter pacientes do banco de dados.');
    } else {
      res.json(rows);
    }
  });
});

app.post('/pacientes', (req, res) => {
  const novoPaciente = req.body;
  db.run(
    'INSERT INTO pacientes (nome, sobrenome, cpf, data_nascimento, telefone) VALUES (?, ?, ?, ?, ?)',
    [novoPaciente.nome, novoPaciente.sobrenome, novoPaciente.cpf, novoPaciente.data_nascimento, novoPaciente.telefone],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao adicionar paciente ao banco de dados.');
      } else {
        novoPaciente.id = this.lastID;
        res.status(201).json(novoPaciente);
      }
    }
  );
});

app.get('/receitas', (req, res) => {
  db.all('SELECT * FROM receitas', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao obter receitas do banco de dados.');
    } else {
      res.json(rows);
    }
  });
});

app.post('/receitas', (req, res) => {
  const novaReceita = req.body;
  db.run(
    'INSERT INTO receitas (nome_comercial, principio_ativo, indicacao, medico_id, paciente_id, data_prescricao, posologia, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      novaReceita.nome_comercial,
      novaReceita.principio_ativo,
      novaReceita.indicacao,
      novaReceita.medico_id,
      novaReceita.paciente_id,
      novaReceita.data_prescricao,
      novaReceita.posologia,
      novaReceita.observacoes
    ],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao adicionar receita ao banco de dados.');
      } else {
        novaReceita.id = this.lastID;
        res.status(201).json(novaReceita);
      }
    }
  );
});

app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
