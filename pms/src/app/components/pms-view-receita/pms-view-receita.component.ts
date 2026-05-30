import { Component, OnInit } from '@angular/core';
import { ItemsService } from 'src/app/services/items.service';
import { TranslateService } from 'src/app/services/translate.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

interface Receita {
  id: number;
  nomeComercial: string;
  principioAtivo: string;
  posologia: string;
  indicacao: string;
  dataPrescricao: Date;
  dataValidade: string;
  nomeMedico: string;
}

@Component({
  selector: 'app-pms-view-receita',
  templateUrl: './pms-view-receita.component.html',
  styleUrls: ['./pms-view-receita.component.css']
})
export class PmsViewReceitaComponent implements OnInit {
  receita: Receita | null = null;
  isMedicoView: boolean = false;

  constructor(
    private itemsService: ItemsService,
    private translate: TranslateService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isMedicoView = this.authService.isMedicoLoggedIn();
    
    const receitaLS = JSON.parse(localStorage.getItem('receitaSelecionada') || 'null');
    const pacienteLS = JSON.parse(localStorage.getItem('pacienteSelecionado') || 'null');
    
    if (pacienteLS) {
      this.itemsService.setItemPaciente(pacienteLS);
    }
    
    const item = receitaLS || this.itemsService.getItemReceita();
    if (item) {
      let dataPrescricaoValue = item['data_prescricao'] || item['dataPrescricao'] || '';
      
      if (typeof dataPrescricaoValue === 'string' && /^\d{2}-\d{2}-\d{2}$/.test(dataPrescricaoValue)) {
        const [d, m, y] = dataPrescricaoValue.split('-');
        dataPrescricaoValue = new Date(`${y}-${m}-${d}`);
      } else {
        dataPrescricaoValue = dataPrescricaoValue ? new Date(dataPrescricaoValue) : new Date();
      }
      
      this.receita = {
        id: item.id,
        nomeComercial: item['nome_comercial'] || item['nomeComercial'] || '',
        principioAtivo: item['principio_ativo'] || item['principioAtivo'] || '',
        posologia: item['posologia'] || '',
        indicacao: item['indicacao'] || '',
        dataPrescricao: dataPrescricaoValue instanceof Date && !isNaN(dataPrescricaoValue.getTime()) ? dataPrescricaoValue : new Date(),
        dataValidade: item['data_validade'] || '',
        nomeMedico: item['nomeMedico'] || ''
      };
    }
  }

  voltarParaListaPacientes() {
    this.router.navigate(['/medico']);
  }

  voltar() {
    this.router.navigate(['/paciente']);
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    if (typeof date === 'string' && date.match(/^\d{2}-\d{2}-\d{2}$/)) {
      return date;
    }
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  t(key: string): string {
    return this.translate.get(key);
  }
}