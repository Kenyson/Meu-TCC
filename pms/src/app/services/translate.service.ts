import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private translations: any = {};
  private currentLang: string = 'pt';

  constructor(private http: HttpClient) {
    this.translations = this.getDefaultTranslations();
    const savedLang = localStorage.getItem('language') || 'pt';
    this.currentLang = savedLang;
    this.http.get(`/assets/i18n/${savedLang}.json`).subscribe({
      next: (data) => {
        this.translations = data;
      }
    });
  }

  private getDefaultTranslations(): any {
    return {
      "login": {
        "title": "Login",
        "loginType": "Tipo de Login:",
        "doctor": "Médico",
        "patient": "Paciente",
        "crm": "CRM:",
        "state": "Estado:",
        "selectState": "Selecione",
        "cpf": "CPF:",
        "patientCpf": "CPF do Paciente:",
        "password": "Senha:",
        "enter": "Entrar",
        "createAccount": "Criar novo cadastro",
        "welcome": "Bem-vindo,",
        "logout": "Logout",
        "info": {
          "title": "PMS - Sistema de Gestão de Prescrições",
          "developed": "Desenvolvido em 2023",
          "university": "como TCC (Trabalho de Conclusão de Curso) na universidade Unicesumar em Maringá, Brasil.",
          "system": "Este sistema é baseado no <strong>sistema médico brasileiro</strong> onde cada médico possui um número único (CRM) válido apenas em um estado específico.",
          "crm": "CRM:",
          "crmDesc": "número de licença médica - único dentro de cada estado brasileiro (ex: CRM 12345 em São Paulo).",
          "cpf": "CPF:",
          "cpfDesc": "Cadastro de Pessoas Físicas - número de registro fiscal individual brasileiro, similar ao número de seguro social, usado como identificador do paciente.",
          "purpose": "O sistema permite que médicos gerenciem seus pacientes, prescrevam medicamentos e visualizem prontuários. Pacientes podem visualizar suas receitas e histórico médico.",
          "demoTitle": "Logins Demo:",
          "doctorDemo": "Médico Demo",
          "patientDemo1": "Paciente Demo 1",
          "patientDemo2": "Paciente Demo 2",
          "patientDemo3": "Paciente Demo 3"
        }
      },
      "register": {
        "title": "Cadastro",
        "userType": "Tipo de Usuário:",
        "doctor": "Médico",
        "patient": "Paciente",
        "crm": "CRM:",
        "state": "Estado:",
        "selectState": "Selecione o estado",
        "firstName": "Nome:",
        "lastName": "Sobrenome:",
        "specialty": "Especialidade:",
        "phone": "Telefone:",
        "email": "Email:",
        "password": "Senha:",
        "confirmPassword": "Confirmação da Senha:",
        "cpf": "CPF:",
        "patientCpf": "CPF do Paciente:",
        "birthDate": "Data de Nascimento:",
        "address": "Endereço:",
        "register": "Cadastrar",
        "addPatient": "Adicionar Paciente",
        "passwordMismatch": "A senha e a confirmação da senha não coincidem.",
        "requiredFields": "Por favor, preencha todos os campos obrigatórios."
      },
      "header": {
        "home": "Home",
        "welcome": "Bem-vindo,",
        "logout": "Logout"
      },
      "medico": {
        "title": "Tabela de Pacientes do Dr.",
        "backToPatients": "Voltar para Lista de Pacientes",
        "addPatient": "Adicionar Paciente",
        "confirmRemove": "Tem certeza que deseja remover este paciente?",
        "columns": {
          "name": "Nome",
          "age": "Idade",
          "cpf": "CPF",
          "birthDate": "Data de Nascimento",
          "phone": "Telefone"
        },
        "registerPrescription": "Cadastrar Receita",
        "selectPatient": "Selecionar paciente:",
        "commercialName": "Nome Comercial:",
        "activeIngredient": "Princípio Ativo:",
        "indication": "Indicação:",
        "prescriptionDate": "Data da Prescrição:",
        "posology": "Posologia:",
        "save": "Salvar",
        "cancel": "Cancelar"
      },
      "paciente": {
        "title": "Receitas de",
        "viewPrescription": "Visualizar Receita",
        "newPrescription": "Nova Receita",
        "confirmRemove": "Tem certeza que deseja remover esta receita?",
        "columns": {
          "commercialName": "Nome Comercial",
          "activeIngredient": "Princípio Ativo",
          "indication": "Indicação",
          "prescriptionDate": "Data da Prescrição",
          "posology": "Posologia",
          "doctor": "Médico"
        }
      },
      "footer": {
        "text": "PMS - Sistema de Gestão de Prescrições"
      },
      "search": {
        "placeholder": "Pesquisar"
      },
"grid": {
         "actions": "Ações",
         "view": "Ver",
         "remove": "Remover"
       }
    };
  }

  loadTranslations(lang: string): Promise<void> {
    return new Promise((resolve) => {
      this.http.get(`/assets/i18n/${lang}.json`).subscribe({
        next: (data) => {
          this.translations = data;
          this.currentLang = lang;
          resolve();
        },
        error: () => {
          resolve();
        }
      });
    });
  }

  use(lang: string): Promise<void> {
    return this.loadTranslations(lang);
  }

  get(key: string): string {
    const keys = key.split('.');
    let result: any = this.translations;

    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        return key;
      }
    }

    return result;
  }

  getCurrentLang(): string {
    return this.currentLang;
  }
}