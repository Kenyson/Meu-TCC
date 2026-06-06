# GUIA DE USO - SISTEMA DE SINCRONIZAÇÃO AUTOMÁTICA

## O que foi implementado

Seu sistema agora popula automaticamente o banco de dados quando necessário, sem precisar clicar no botão do seed.html.

### Fluxo automático:
1. Pessoa acessa o site pela primeira vez
2. O banco é populado **automaticamente** com dados de demo + contas que ela criou
3. Volta a acessar em até 1 hora = banco presume estar intacto
4. Volta a acessar após 1 hora = banco é populado novamente (presumindo que foi apagado pelo Render)

### Contas criadas são preservadas
Se alguém criar uma conta (médico ou paciente) no seu site, essa conta fica armazenada no localStorage do navegador. Sempre que o banco for re-populado, essa conta volta automaticamente.

---

## Como testar

### Teste 1: Sincronização na primeira vez

**Preparação:**
1. Abra DevTools (F12)
2. Vá para Application → LocalStorage
3. Procure por `pms_sync_state` (pode não existir ainda)

**Procedimento:**
1. Acesse o site de demo
2. Veja o loading screen aparecer (sincronização automática)
3. Após completar, abra DevTools novamente
4. Em Application → LocalStorage, encontre `pms_sync_state`
5. Verá algo como: `{"lastSync": 1717598400000, "customAccounts": []}`

**Resultado esperado:**
✅ Banco populado com dados de demo  
✅ Consegue fazer login com:
   - Médico CRM: 99999, Senha: doctor123
   - Paciente CPF: 12345678901, Senha: patient123

---

### Teste 2: Sem sincronizar dentro de 1 hora

**Procedimento:**
1. Feche o navegador/aba
2. Reabra o site em até 1 hora
3. Observe que NÃO há loading screen

**Resultado esperado:**
✅ Nenhuma sincronização (presume que banco está intacto)  
✅ Dados do teste anterior continuam acessíveis

---

### Teste 3: Sincronizar após 1 hora

**Procedimento:**
1. (Espere 1 hora, ou simule):
   - DevTools → Application → LocalStorage → `pms_sync_state`
   - Modifique o `lastSync` para um valor bem anterior (ex: 1717594000000)
   - Recarregue a página

2. Observe o loading screen aparecer novamente

**Resultado esperado:**
✅ Sincronização automática ocorre  
✅ Banco re-populado com dados de demo

---

### Teste 4: Criar uma nova conta

**Procedimento:**
1. Clique em "Cadastro" no site
2. Registre um novo paciente ou médico:
   ```
   Paciente:
   - Nome: João
   - Sobrenome: Silva  
   - CPF: 11144477755
   - Telefone: 11999887766
   - Data Nascimento: 15-03-1990
   - Endereço: Rua Teste
   - Senha: teste123
   ```

3. Veja o loading (sync manual é disparado)
4. Após sucesso, abra DevTools
5. Em Application → LocalStorage → `pms_sync_state`
6. Procure pelo CPF 11144477755 em `customAccounts`

**Resultado esperado:**
✅ Nova conta aparece no localStorage  
✅ Conta é armazenada permanentemente  
✅ Próximas sincronizações trarão essa conta de volta

---

### Teste 5: Simular perda de dados do Render

**Procedimento:**
1. Crie uma conta nova (Teste 4)
2. Faça login com essa conta
3. Abra DevTools → Application → LocalStorage
4. Modifique `pms_sync_state` para `lastSync` antigo (simular 1+ hora)
5. Recarregue a página
6. Veja loading e sincronização ocorrer
7. Saia da conta (logout)
8. Tente fazer login com a conta que criou

**Resultado esperado:**
✅ Conta criada volta após sincronização  
✅ Consegue fazer login com a conta antiga que criou  
✅ Dados de demo também voltam

---

## Monitorar sincronizações via Console

Para ver os logs de sincronização:

1. Abra DevTools (F12)
2. Vá para Console
3. Procure por linhas com `[SyncService]` ou `[SyncInterceptor]`

Exemplos de logs:
```
[SyncService] Iniciando sincronização automática...
[SyncService] Adicionando 1 contas armazenadas
[SyncService] Resposta do seeding: {success: true, message: "...", inserted: {...}}
[SyncService] Sincronização concluída com sucesso

[SyncInterceptor] Novo paciente registrado: {nome: "João", ...}
```

---

## URLs utilizadas

- **Frontend (Demo)**: `https://seu-github-pages-url`
- **Backend API**: `https://pms-backend-2-f6uy.onrender.com`
- **Rota de Seed**: `POST /api/seed` (com Bearer token)

---

## O que está armazenado no localStorage

**Chave**: `pms_sync_state`

**Estrutura**:
```javascript
{
  "lastSync": 1717598400000,  // timestamp do último sync
  "customAccounts": [
    {
      "type": "paciente",
      "id": 1717598400123,
      "nome": "João",
      "sobrenome": "Silva",
      "cpf": "11144477755",
      "telefone": "11999887766",
      "data_nascimento": "15-03-1990",
      "dataNascimento": "15-03-1990",
      "senha": "teste123"
    }
  ]
}
```

---

## Perguntas Frequentes

### P: E se o usuário limpar o localStorage?
**R**: Suas contas customizadas são perdidas. Se o banco ainda estiver populado (menos de 1 hora), tudo fica ok. Se o banco for apagado, as contas são perdidas também.

### P: E se o usuário desabilitar localStorage?
**R**: Sistema ainda funciona, mas não armazena contas customizadas. Sincronização "manual" via contador de horas não funciona (faria sync toda vez).

### P: Posso testar localmente?
**R**: Sim! Se estiver rodando o backend em http://localhost:3000, o SyncService detecta e usa essa URL em vez da do Render.

### P: Como faço um sync manual do UI?
**R**: Atualmente não há botão. Você pode:
1. Limpar localStorage e recarregar (força sync)
2. Criar uma nova conta (dispara sync automático)
3. Usar console: `ng.getComponent(document.body).syncService.manualSync()`

---

## Próximas melhorias sugeridas

- [ ] Botão "Sincronizar Agora" na UI
- [ ] Modal com feedback de sincronização
- [ ] Histórico de sincronizações
- [ ] Opção de sincronizar receitas também
- [ ] Dashboard de status
