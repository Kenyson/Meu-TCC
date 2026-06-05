import { AuthService } from 'src/app/services/auth.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TranslateService } from 'src/app/services/translate.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { LoadingService } from 'src/app/services/loading.service';

interface Medico {
  crm: string;
}

@Component({
  selector: 'app-pms-new-paciente',
  templateUrl: './pms-new-paciente.component.html',
  styleUrls: ['./pms-new-paciente.component.css']
})
export class PmsNewPacienteComponent {
  cpf: string = '';
  cpfExists: boolean = false;
  preexiste: boolean = false;
  paciente = {
    id: 0,
    nome: '',
    cpf: '',
    telefone: '',
  };
  invalidFields: { [key: string]: boolean } = {};
  errorMessage: string = '';
  showError: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService,
    private validator: ValidatorService,
    private loading: LoadingService
  ) {}

  applyCPFMask(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    input.value = this.validator.getCPFFormatted(value);
    this.cpf = input.value;
  }

  applyPhoneMask(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 13) value = value.slice(0, 13);
    input.value = this.validator.applyPhoneMask(value);
    this.paciente.telefone = input.value;
  }

  validateFields() {
    this.invalidFields = {};
    if (!this.validator.validateCPF(this.cpf)) {
      this.invalidFields['cpf'] = true;
    }
  }

  validateFormFields() {
    this.invalidFields = {};
    if (!this.paciente.nome) {
      this.invalidFields['nome'] = true;
    }
    if (!this.validator.validateCPF(this.paciente.cpf)) {
      this.invalidFields['paciente_cpf'] = true;
    }
    if (!this.validator.validateTelefone(this.paciente.telefone)) {
      this.invalidFields['telefone'] = true;
    }
  }

  checkExistingCPF() {
    if (!this.validator.validateCPF(this.cpf)) {
      this.invalidFields['cpf'] = true;
      this.showError = true;
      this.errorMessage = this.t('register.invalidCpf');
      return;
    }
    this.loading.show();
    this.http.get<any[]>(`${environment.apiUrl}/pacientes/filtrar?caracteristica=cpf&valor=` + this.cpf.replace(/\D/g, ''))
      .subscribe(
        (response: any[]) => {
          this.loading.hide();
          if (response.length > 0) {
            this.cpfExists = true;
            this.preexiste = true;
            this.paciente = response[0];
          } else {
              this.cpfExists = true;
              // preenche o campo CPF do formulário com o CPF informado anteriormente
              this.paciente.cpf = this.cpf;
          }
        },
        (error) => {
          this.loading.hide();
          console.error('Erro ao verificar o CPF:', error);
        }
      );
  }

  goToMedicoScreen() {
    this.router.navigate(['/medico']);
  }

  submitForm() {
    this.showError = false;
    this.errorMessage = '';
    this.invalidFields = {};

    if (!this.paciente.nome) {
      this.invalidFields['nome'] = true;
    }
    if (!this.validator.validateCPF(this.paciente.cpf)) {
      this.invalidFields['paciente_cpf'] = true;
    }
    if (!this.validator.validateTelefone(this.paciente.telefone)) {
      this.invalidFields['telefone'] = true;
    }

    if (Object.keys(this.invalidFields).length > 0) {
      this.errorMessage = this.t('register.invalidFields');
      this.showError = true;
      return;
    }

    this.loading.show();

    if (this.preexiste) {
      const conexao = {
        medico_id: (this.authService.usuarioLogado as Medico).crm,
        paciente_id: this.paciente.id
      };
      this.http.post(`${environment.apiUrl}/conexao`, conexao)
        .subscribe(
          (response) => {
            this.loading.showSuccess();
            this.goToMedicoScreen();
          },
          (error) => {
            this.loading.showError('Erro ao criar a conexão');
            console.error('Erro ao criar a conexão:', error);
          }
        );
    } else {
      const novoPaciente = {
        nome: this.paciente.nome,
        cpf: this.cpf.replace(/\D/g, ''),
        telefone: this.paciente.telefone.replace(/\D/g, '')
      };

      this.http.post(`${environment.apiUrl}/pacientes`, novoPaciente)
        .subscribe(
          (response: any) => {
            const conexao = {
              medico_id: (this.authService.usuarioLogado as Medico).crm,
              paciente_id: response.id
            };

            this.http.post(`${environment.apiUrl}/conexao`, conexao)
              .subscribe(
                (response) => {
                  this.loading.showSuccess();
                  this.goToMedicoScreen();
                },
                (error) => {
                  this.loading.showError('Erro ao criar a conexão');
                  console.error('Erro ao criar a conexão:', error);
                }
              );
          },
          (error) => {
            this.loading.showError('Erro ao criar o paciente');
            console.error('Erro ao criar o paciente:', error);
          }
        );
    }
  }

  t(key: string): string {
    return this.translate.get(key);
  }
}
