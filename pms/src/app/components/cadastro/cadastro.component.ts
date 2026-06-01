import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from 'src/app/services/translate.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  selectedOption: string;
  medicoData: any = {};
  pacienteData: any = {};
  errorMessage: string = '';
  showError: boolean = false;
  invalidFields: { [key: string]: boolean } = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService,
    private validator: ValidatorService,
    private loading: LoadingService
  ) {
    this.selectedOption = 'medico';
  }

  validateFields() {
    this.invalidFields = {};

    if (this.selectedOption === 'medico') {
      if (!this.validator.validateCRM(this.medicoData.crm)) {
        this.invalidFields['medico_crm'] = true;
      }
      if (!this.validator.validateEmail(this.medicoData.email)) {
        this.invalidFields['medico_email'] = true;
      }
      if (this.medicoData.telefone && !this.validator.validateTelefone(this.medicoData.telefone)) {
        this.invalidFields['medico_telefone'] = true;
      }
    } else if (this.selectedOption === 'paciente') {
      if (!this.validator.validateCPF(this.pacienteData.cpf)) {
        this.invalidFields['paciente_cpf'] = true;
      }
      if (!this.validator.validateEmail(this.pacienteData.email)) {
        this.invalidFields['paciente_email'] = true;
      }
      if (!this.validator.validateTelefone(this.pacienteData.telefone)) {
        this.invalidFields['paciente_telefone'] = true;
      }
    }
  }

  applyCPFMask(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    input.value = this.validator.getCPFFormatted(value);
    this.pacienteData.cpf = input.value;
  }

  applyPhoneMask(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 13) value = value.slice(0, 13);
    input.value = this.validator.applyPhoneMask(value);
    this.pacienteData.telefone = input.value;
  }

  applyCRMMask(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    input.value = value;
    this.medicoData.crm = value;
  }

  applyPhoneMaskMedico(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 13) value = value.slice(0, 13);
    input.value = this.validator.applyPhoneMask(value);
    this.medicoData.telefone = input.value;
  }

  submitForm() {
    this.showError = false;
    this.errorMessage = '';
    this.invalidFields = {};

    this.validateFields();

    if (this.selectedOption === 'medico') {
      if (this.medicoData.senha !== this.medicoData.Confirmsenha) {
        this.errorMessage = this.t('register.passwordMismatch');
        this.showError = true;
        return;
      }

      if (
        !this.medicoData.crm ||
        !this.medicoData.estado ||
        !this.medicoData.nome ||
        !this.medicoData.sobrenome ||
        !this.medicoData.especialidade ||
        !this.medicoData.email ||
        !this.medicoData.senha ||
        !this.medicoData.Confirmsenha
      ) {
        this.errorMessage = this.t('register.requiredFields');
        this.showError = true;
        return;
      }

      if (Object.keys(this.invalidFields).length > 0) {
        this.errorMessage = this.t('register.invalidFields');
        this.showError = true;
        return;
      }

      this.loading.show();
      this.http.post(`${environment.apiUrl}/medicos`, this.medicoData).subscribe(
        response => {
          this.loading.showSuccess();
          this.router.navigate(['/login']);
        },
        error => {
          const errorMsg = error.message && error.status === 400 ? error.error : this.t('register.doctorError');
          this.loading.showError(errorMsg);
        }
      );
    } else if (this.selectedOption === 'paciente') {
      if (this.pacienteData.senha !== this.pacienteData.Confirmsenha) {
        this.errorMessage = this.t('register.passwordMismatch');
        this.showError = true;
        return;
      }

      if (
        !this.pacienteData.cpf ||
        !this.pacienteData.nome ||
        !this.pacienteData.sobrenome ||
        !this.pacienteData.email ||
        !this.pacienteData.telefone ||
        !this.pacienteData.dataNascimento ||
        !this.pacienteData.endereco ||
        !this.pacienteData.senha ||
        !this.pacienteData.Confirmsenha
      ) {
        this.errorMessage = this.t('register.requiredFields');
        this.showError = true;
        return;
      }

      if (Object.keys(this.invalidFields).length > 0) {
        this.errorMessage = this.t('register.invalidFields');
        this.showError = true;
        return;
      }

      this.loading.show();
      this.http.post(`${environment.apiUrl}/pacientes`, this.pacienteData).subscribe(
        response => {
          this.loading.showSuccess();
          this.router.navigate(['/login']);
        },
        error => {
          const errorMsg = error.error && error.error.message ? error.error.message : this.t('register.patientError');
          this.loading.showError(errorMsg);
        }
      );
    }
  }

  t(key: string): string {
    return this.translate.get(key);
  }
}