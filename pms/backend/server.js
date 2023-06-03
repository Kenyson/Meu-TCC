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
      crm TEXT PRIMARY KEY,
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
      cpf TEXT,
      telefone TEXT,
      medico_id TEXT,
      FOREIGN KEY (medico_id) REFERENCES medico (crm)
    )
  `);
});

app.post('/login', (req, res) => {
  const { userType, crm, estado, cpf, password } = req.body;

  if (userType === 'medico') {
    db.get('SELECT * FROM medico WHERE crm = ? AND estado = ? AND senha = ?', [crm, estado, password], (err, row) => {
      if (err) {
        console.error('Erro ao realizar o login do médico:', err.message);
        return res.status(500).send({ success: false, message: 'Erro ao realizar o login do médico' });
      }

      if (!row) {
        return res.send({ success: false, message: 'Credenciais inválidas' });
      }

      const { crm, estado, nome } = row;
      res.send({ success: true, crm, estado, nome });
    });
  } else if (userType === 'paciente') {
    db.get('SELECT * FROM pacientes WHERE cpf = ? AND senha = ?', [cpf, password], (err, row) => {
      if (err) {
        console.error('Erro ao realizar o login do paciente:', err.message);
        return res.status(500).send({ success: false, message: 'Erro ao realizar o login do paciente' });
      }

      if (!row) {
        return res.send({ success: false, message: 'Credenciais inválidas' });
      }

      const { cpf, nome } = row;
      res.send({ success: true, cpf, nome });
    });
  } else {
    res.status(400).send({ success: false, message: 'Tipo de usuário inválido' });
  }
});

app.post('/medicos', (req, res) => {
  const novoMedico = req.body;
  db.run(
    'INSERT INTO medico (crm, estado, nome, sobrenome, telefone, especialidade, senha) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [novoMedico.crm, novoMedico.estado, novoMedico.nome, novoMedico.sobrenome, novoMedico.telefone, novoMedico.especialidade, novoMedico.senha],
    function (err) {
      if (err) {
        console.error('Erro ao adicionar o médico:', err.message);
        return res.status(500).send('Erro ao adicionar o médico');
      }
      console.log('Médico adicionado com o ID:', this.lastID);
      res.send({ id: this.lastID });
    }
  );
});

app.get('/pacientes/filtrar', (req, res) => {
  const caracteristica = req.query.caracteristica;
  const valor = req.query.valor;
  const sql = `SELECT * FROM pacientes WHERE ${caracteristica} = ?`;

  db.all(sql, [valor], (err, rows) => {
    if (err) {
      console.error('Erro ao filtrar os pacientes:', err.message);
      return res.status(500).send('Erro ao filtrar os pacientes');
    }
    res.send(rows);
  });
});

app.put('/pacientes/:id', (req, res) => {
  const id = req.params.id;
  const paciente = req.body;

  db.run(
    'UPDATE pacientes SET nome = ?, cpf = ?, telefone = ?, medico_id = ? WHERE id = ?',
    [paciente.nome, paciente.cpf, paciente.telefone, paciente.medico_id, id],
    (err) => {
      if (err) {
        console.error('Erro ao atualizar o paciente:', err.message);
        return res.status(500).send('Erro ao atualizar o paciente');
      }
      console.log('Paciente atualizado com sucesso');
      res.send('Paciente atualizado com sucesso');
    }
  );
});

app.post('/pacientes', (req, res) => {
  const novoPaciente = req.body;
  db.run(
    'INSERT INTO pacientes (nome, cpf, telefone, medico_id) VALUES (?, ?, ?, ?)',
    [novoPaciente.nome, novoPaciente.cpf, novoPaciente.telefone, novoPaciente.medico_id],
    function (err) {
      if (err) {
        console.error('Erro ao adicionar o paciente:', err.message);
        return res.status(500).send('Erro ao adicionar o paciente');
      }
      console.log('Paciente adicionado com o ID:', this.lastID);
      res.send({ id: this.lastID });
    }
  );
});

app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
