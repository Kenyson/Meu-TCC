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
      medico_id TEXT,
      paciente_id INTEGER,
      data_prescricao TEXT,
      posologia TEXT,
      nomeMedico TEXT,
      FOREIGN KEY (medico_id) REFERENCES medico (crm),
      FOREIGN KEY (paciente_id) REFERENCES pacientes (id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS medico_paciente (
      id INTEGER PRIMARY KEY,
      medico_id INTEGER,
      paciente_id INTEGER,
      FOREIGN KEY (medico_id) REFERENCES medico (crm),
      FOREIGN KEY (paciente_id) REFERENCES pacientes (id)
    )
  `);
});

app.post('/medicos', (req, res) => {
  const novoMedico = req.body;


  db.get('SELECT crm, estado FROM medico WHERE crm = ? AND estado = ?', [novoMedico.crm, novoMedico.estado], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao verificar o CRM e estado no banco de dados.');
    } else {
      if (row) {
        res.status(400).send('Já existe um médico com o mesmo CRM e estado.');
      } else {

        db.run(
          'INSERT INTO medico (crm, estado, nome, sobrenome, telefone, especialidade, senha) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            novoMedico.crm,
            novoMedico.estado,
            novoMedico.nome,
            novoMedico.sobrenome,
            novoMedico.telefone,
            novoMedico.especialidade,
            novoMedico.senha
          ],
          function (err) {
            if (err) {
              console.error(err);
              res.status(500).send('Erro ao adicionar médico ao banco de dados.');
            } else {
              novoMedico.crm = this.lastID;
              res.status(201).json(novoMedico);
            }
          }
        );
      }
    }
  });
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

app.get('/pacientes/filtrar', (req, res) => {
  const { caracteristica, valor } = req.query;
  const query = `SELECT id, nome, sobrenome, cpf, data_nascimento, telefone FROM pacientes WHERE ${caracteristica} = ?`;
  db.all(query, [valor], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao obter pacientes filtrados do banco de dados.');
    } else {
      res.json(rows);
    }
  });
});

app.post('/pacientes', (req, res) => {
  const novoPaciente = req.body;

  db.get('SELECT id, senha FROM pacientes WHERE cpf = ?', [novoPaciente.cpf], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao verificar o CPF no banco de dados.');
    } else {
      if (row) {
        if (!row.senha) {
          db.run(
            'UPDATE pacientes SET nome = ?, sobrenome = ?, data_nascimento = ?, telefone = ?, senha = ? WHERE cpf = ?',
            [
              novoPaciente.nome,
              novoPaciente.sobrenome,
              novoPaciente.dataNascimento,
              novoPaciente.telefone,
              novoPaciente.senha,
              novoPaciente.cpf
            ],
            function (err) {
              if (err) {
                console.error(err);
                res.status(500).send('Erro ao atualizar paciente no banco de dados.');
              } else {
                novoPaciente.id = row.id;
                res.status(200).json(novoPaciente);
              }
            }
          );
        } else {
          res.status(400).send('CPF já cadastrado.');
        }
      } else {
        db.run(
          'INSERT INTO pacientes (nome, sobrenome, cpf, data_nascimento, telefone, senha) VALUES (?, ?, ?, ?, ?, ?)',
          [
            novoPaciente.nome,
            novoPaciente.sobrenome,
            novoPaciente.cpf,
            novoPaciente.dataNascimento,
            novoPaciente.telefone,
            novoPaciente.senha
          ],
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
      }
    }
  });
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
  const paciente_id = req.query.paciente_id;

  if (paciente_id) {
    const query = `
      SELECT *
      FROM receitas
      WHERE paciente_id = ?`;
    db.all(query, [paciente_id], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao obter receitas do banco de dados.');
      } else {
        res.json(rows);
      }
    });
  } else {
    res.status(400).send('ID do paciente não encontrado.');
  }
});

app.post('/receitas', (req, res) => {
  const novaReceita = req.body;
  db.run(
    'INSERT INTO receitas (nome_comercial, principio_ativo, indicacao, medico_id, paciente_id, data_prescricao, posologia, nomeMedico) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [novaReceita.nome_comercial, novaReceita.principio_ativo, novaReceita.indicacao, novaReceita.medico_id, novaReceita.paciente_id, novaReceita.data_prescricao, novaReceita.posologia, novaReceita.nomeMedico],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send('Erro ao adicionar receita ao banco de dados.');
      } else {
        res.status(201).json({ message: 'Receita adicionada com sucesso!' });
      }
    }
  );
});


app.get('/medico/:crm/pacientes', (req, res) => {
  const { crm } = req.params;
  const query = `
    SELECT p.id, p.nome, p.sobrenome, p.cpf, p.data_nascimento, p.telefone
    FROM pacientes p
    INNER JOIN medico_paciente mp ON p.id = mp.paciente_id
    WHERE mp.medico_id = ?`;
  db.all(query, [crm], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao obter pacientes do médico.');
    } else {
      res.json(rows);
    }
  });
});

app.get('/paciente/:id/receitas', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT r.id, r.nome_comercial, r.principio_ativo, r.indicacao, r.data_prescricao, r.posologia, m.nome AS nome_medico, m.sobrenome AS sobrenome_medico
    FROM receitas r
    INNER JOIN medico m ON r.medico_id = m.crm
    WHERE r.paciente_id = ?`;
  db.all(query, [id], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao obter receitas do paciente.');
    } else {
      res.json(rows);
    }
  });
});

app.post('/conexao', (req, res) => {
  const novaConexao = req.body;

  db.get(
    'SELECT id FROM medico_paciente WHERE medico_id = ? AND paciente_id = ?',
    [novaConexao.medico_id, novaConexao.paciente_id],
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao verificar a conexão no banco de dados.');
      } else {
        if (row) {
          res.status(400).send('Já existe uma conexão entre o médico e o paciente informados.');
        } else {
          db.run(
            'INSERT INTO medico_paciente (medico_id, paciente_id) VALUES (?, ?)',
            [novaConexao.medico_id, novaConexao.paciente_id],
            function (err) {
              if (err) {
                console.error(err);
                res.status(500).send('Erro ao adicionar conexão ao banco de dados.');
              } else {
                novaConexao.id = this.lastID;
                res.status(201).json(novaConexao);
              }
            }
          );
        }
      }
    }
  );
});


app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
