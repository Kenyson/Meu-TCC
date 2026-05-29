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
      this.receita = {
        id: item.id,
        nomeComercial: item['nome_comercial'] || item['nomeComercial'] || '',
        principioAtivo: item['principio_ativo'] || item['principioAtivo'] || '',
        posologia: item['posologia'] || '',
        indicacao: item['indicacao'] || '',
        dataPrescricao: item['data_prescricao'] ? new Date(item['data_prescricao']) : (item['dataPrescricao'] ? new Date(item['dataPrescricao']) : new Date()),
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
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR');
  }

  t(key: string): string {
    return this.translate.get(key);
  }
}