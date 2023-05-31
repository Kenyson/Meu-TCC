const express = require('express');
const app = express();
const cors = require('cors');

const porta = 3000;

const pacientes = [
  {
     id: 1,
    nome: 'João',
    idade: 30,
    cpf: '1234567890',
    telefone: '999999999'
  },
  {
     id: 2,
    nome: 'Maria',
    idade: 25,
    cpf: '0987654321',
    telefone: '888888888'
  },
  {
     id: 3,
    nome: 'Pedro',
    idade: 35,
    cpf: '5678901234',
    telefone: '777777777'
  },
];

const receitas = [
  {
    id: 1,
    nomePaciente: 'João',
    nomeComercial: 'Paracetamol',
    principioAtivo: 'Paracetamol',
    posologia: '1 comprimido a cada 6 horas',
    indicacao: 'Febre',
    dataPrescricao: '2023-05-29',
    medico: 'Dr. Médico'
  },
  {
    id: 2,
    nomePaciente: 'Maria',
    nomeComercial: 'Dipirona',
    principioAtivo: 'Dipirona',
    posologia: '1 comprimido a cada 8 horas',
    indicacao: 'Dor de cabeça',
    dataPrescricao: '2023-05-29',
    medico: 'Dr. Médico'
  },
  {
    id: 3,
    nomePaciente: 'Pedro',
    nomeComercial: 'Amoxicilina',
    principioAtivo: 'Amoxicilina',
    posologia: '1 comprimido a cada 12 horas',
    indicacao: 'Infecção',
    dataPrescricao: '2023-05-29',
    medico: 'Dr. Médico'
  }
];

app.use(express.json());
app.use(cors());

app.get('/pacientes', (req, res) => {
  res.json(pacientes);
});

app.post('/pacientes', (req, res) => {
  const novoPaciente = req.body;
  pacientes.push(novoPaciente);
  res.status(201).json(novoPaciente);
});

app.get('/receitas', (req, res) => {
  res.json(receitas);
});

app.post('/receitas', (req, res) => {
  const novaReceita = req.body;
  receitas.push(novaReceita);
  res.status(201).json(novaReceita);
});

app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
