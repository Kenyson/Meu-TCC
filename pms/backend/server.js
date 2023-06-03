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
      telefone TEXT,
      senha TEXT
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
    'INSERT INTO medico (crm, estado, nome, sobrenome, telefone, especialidade, senha) VALUES (?, ?, ?, ?, ?, ?)',
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
  db.all('SELECT crm, estado, nome, sobrenome, telefone, especialidade FROM medico', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao obter médicos do banco de dados.');
    } else {
      res.json(rows);
    }
  });
});

app.get('/pacientes', (req, res) => {
  db.all('SELECT id, nome, sobrenome, cpf, data_nascimento, telefone FROM pacientes', (err, rows) => {
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
    'INSERT INTO pacientes (nome, sobrenome, cpf, data_nascimento, telefone, senha) VALUES (?, ?, ?, ?, ?, ?)',
    [novoPaciente.nome, novoPaciente.sobrenome, novoPaciente.cpf, novoPaciente.dataNascimento, novoPaciente.telefone, novoPaciente.senha],
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


app.post('/login', (req, res) => {
  const { userType, password } = req.body;

  if (userType === 'medico') {
    const { crm, estado } = req.body;
    db.get(
      'SELECT crm, estado, nome, sobrenome FROM medico WHERE crm = ? AND estado = ? AND senha = ?',
      [crm, estado, password],
      (err, row) => {
        if (err) {
          console.error(err);
          res.status(500).send('Erro ao autenticar médico.');
        } else {
          if (row) {
            res.status(200).json({
              success: true,
              message: 'Login médico bem-sucedido.',
              crm: row.crm,
              estado: row.estado,
              nome: row.nome,
              sobrenome: row.sobrenome
            });
          } else {
            res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
          }
        }
      }
    );
  } else if (userType === 'paciente') {
    const { cpf } = req.body;
    db.get(
      'SELECT id, cpf, nome, sobrenome FROM pacientes WHERE cpf = ? AND senha = ?',
      [cpf, password],
      (err, row) => {
        if (err) {
          console.error(err);
          res.status(500).send('Erro ao autenticar paciente.');
        } else {
          if (row) {
            res.status(200).json({
              success: true,
              message: 'Login paciente bem-sucedido.',
              id: row.id,
              cpf: row.cpf,
              nome: row.nome,
              sobrenome: row.sobrenome
            });
          } else {
            res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
          }
        }
      }
    );
  } else {
    res.status(400).send('Tipo de usuário inválido.');
  }
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
    [novaReceita.nome_comercial, novaReceita.principio_ativo, novaReceita.indicacao, novaReceita.medico_id, novaReceita.paciente_id, novaReceita.data_prescricao, novaReceita.posologia, novaReceita.observacoes],
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
  console.log(`Servidor está executando na porta ${porta}`);
});
