const express = require('express');
const app = express();
const cors = require('cors');

const porta = 3000;

const pacientes = [
  { id: 1, nome: 'João', medicamento: 'Paracetamol', indicacao: 'Febre', posologia: '1 comprimido a cada 6 horas' },
  { id: 2, nome: 'Maria', medicamento: 'Dipirona', indicacao: 'Dor de cabeça', posologia: '1 comprimido a cada 8 horas' },
  { id: 3, nome: 'Pedro', medicamento: 'Amoxicilina', indicacao: 'Infecção', posologia: '1 comprimido a cada 12 horas' },
];

const receitas = [
  { id: 1, nomePaciente: 'João', medicamento: 'Paracetamol', indicacao: 'Febre', posologia: '1 comprimido a cada 6 horas' },
  { id: 2, nomePaciente: 'Maria', medicamento: 'Dipirona', indicacao: 'Dor de cabeça', posologia: '1 comprimido a cada 8 horas' },
  { id: 3, nomePaciente: 'Pedro', medicamento: 'Amoxicilina', indicacao: 'Infecção', posologia: '1 comprimido a cada 12 horas' },
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