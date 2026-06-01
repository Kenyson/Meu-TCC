import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  validateCPF(cpf: string): boolean {
    if (!cpf) return false;
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    return /^\d{11}$/.test(cleanCPF);
  }

  validateCRM(crm: string): boolean {
    if (!crm) return false;
    const cleanCRM = crm.replace(/\D/g, '');
    return /^\d+$/.test(cleanCRM) && cleanCRM.length > 0;
  }

  validateEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  validateTelefone(telefone: string): boolean {
    if (!telefone) return true;
    const cleanTel = telefone.replace(/\D/g, '');
    const digits = cleanTel.length;
    return (digits >= 9 && digits <= 11) || digits === 12;
  }

  getPhoneFormatted(phone: string): string {
    if (phone.length <= 2) return phone;
    if (phone.length <= 6) return '(' + phone.slice(0, 2) + ') ' + phone.slice(2);
    if (phone.length <= 10) return '(' + phone.slice(0, 2) + ') ' + phone.slice(2, 6) + '-' + phone.slice(6);
    return '(' + phone.slice(0, 2) + ') ' + phone.slice(2, 7) + '-' + phone.slice(7);
  }

  getPhoneFormattedInternational(phone: string): string {
    if (phone.length <= 2) return phone;
    if (phone.length <= 5) return phone.slice(0, 2) + ' ' + phone.slice(2);
    if (phone.length <= 9) return phone.slice(0, 2) + ' ' + phone.slice(2, 5) + ' ' + phone.slice(5);
    if (phone.length <= 13) return '+' + phone.slice(0, 2) + ' ' + phone.slice(2, 4) + ' ' + phone.slice(4, 7) + ' ' + phone.slice(7);
    return phone;
  }

  validateDataNascimento(data: string): boolean {
    if (!data) return false;
    return !!(new Date(data));
  }

  getCPFFormatted(cpf: string): string {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length <= 3) return cleanCPF;
    if (cleanCPF.length <= 6) return cleanCPF.slice(0, 3) + '.' + cleanCPF.slice(3);
    if (cleanCPF.length <= 9) return cleanCPF.slice(0, 3) + '.' + cleanCPF.slice(3, 6) + '.' + cleanCPF.slice(6);
    return cleanCPF.slice(0, 3) + '.' + cleanCPF.slice(3, 6) + '.' + cleanCPF.slice(6, 9) + '-' + cleanCPF.slice(9, 11);
  }

  applyCPFMask(event: any): string {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    return this.getCPFFormatted(value);
  }

  applyPhoneMask(eventOrValue: any): string {
    let value: string;
    if (typeof eventOrValue === 'string') {
      value = eventOrValue.replace(/\D/g, '');
    } else {
      value = eventOrValue.target.value.replace(/\D/g, '');
    }
    if (value.length > 13) value = value.slice(0, 13);
    
    if (value.length >= 12 && value.startsWith('39')) {
      return '+' + value.slice(0, 2) + ' ' + value.slice(2, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7);
    }
    
    if (value.length >= 9 && value.length <= 11) {
      return '(' + value.slice(0, 2) + ') ' + value.slice(2, 6) + '-' + value.slice(6);
    }
    return value;
  }

  applyCRMMask(event: any): string {
    return event.target.value.replace(/\D/g, '');
  }
}