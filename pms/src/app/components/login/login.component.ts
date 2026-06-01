import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from 'src/app/services/translate.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  selectedOption: string;
  estados: string[];
  selectedEstado: string;
  crm: string;
  cpf: string;
  password: string;
  errorMessage: string;
  invalidFields: { [key: string]: boolean } = {};

  constructor(
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService,
    private validator: ValidatorService,
    private loading: LoadingService
  ) {
    this.selectedOption = 'paciente';
    this.estados = ['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'];
    this.selectedEstado = '';
    this.crm = '';
    this.cpf = '';
    this.password = '';
    this.errorMessage = '';

    if (this.authService.isMedicoLoggedIn()) {
      this.router.navigate(['/medico']);
    } else if (this.authService.isPacienteLoggedIn()) {
      this.router.navigate(['/paciente']);
    }
  }

  changeOption(option: string) {
    this.selectedOption = option;
  }

  fillDemoLogin(type: string) {
    if (type === 'medico') {
      this.selectedOption = 'medico';
      this.crm = '99999';
      this.selectedEstado = 'São Paulo';
      this.password = 'doctor123';
    } else if (type === 'paciente1') {
      this.selectedOption = 'paciente';
      this.cpf = '123.456.789-01';
      this.password = 'patient123';
    } else if (type === 'paciente2') {
      this.selectedOption = 'paciente';
      this.cpf = '987.654.321-00';
      this.password = 'patient123';
    } else if (type === 'paciente3') {
      this.selectedOption = 'paciente';
      this.cpf = '111.222.333-44';
      this.password = 'patient123';
    }
  }

  validateCRMs() {
    this.invalidFields = {};
    if (this.selectedOption === 'medico') {
      this.invalidFields['crm'] = !this.validator.validateCRM(this.crm);
      this.invalidFields['estado'] = !this.selectedEstado;
    } else {
      this.invalidFields['cpf'] = !this.validator.validateCPF(this.cpf);
    }
  }

  applyCPFMask(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    input.value = this.validator.getCPFFormatted(value);
    this.cpf = input.value;
  }

  applyCRMMask(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    input.value = value;
    this.crm = value;
  }

  submitForm() {
    this.errorMessage = '';
    this.invalidFields = {};

    if (this.selectedOption === 'medico') {
      if (!this.validator.validateCRM(this.crm)) {
        this.invalidFields['crm'] = true;
      }
      if (!this.selectedEstado) {
        this.invalidFields['estado'] = true;
      }
    } else if (this.selectedOption === 'paciente') {
      if (!this.validator.validateCPF(this.cpf)) {
        this.invalidFields['cpf'] = true;
      }
    }

    if (Object.keys(this.invalidFields).length > 0) {
      this.errorMessage = this.t('register.invalidFields');
      return;
    }

    this.loading.show();

    if (this.selectedOption === 'medico') {
      this.authService.loginMedico(this.crm, this.selectedEstado, this.password)
        .then(() => {
          this.loading.showSuccess();
          this.router.navigate(['/medico']);
        })
        .catch((error) => {
          this.loading.showError(error);
        });
    } else if (this.selectedOption === 'paciente') {
      this.authService.loginPaciente(this.cpf.replace(/\D/g, ''), this.password)
        .then(() => {
          this.loading.showSuccess();
          this.router.navigate(['/paciente']);
        })
        .catch((error) => {
          this.loading.showError(error);
        });
    }
  }

  criarCadastro() {
    this.router.navigate(['/cadastro']);
  }

  t(key: string): string {
    return this.translate.get(key);
  }
}