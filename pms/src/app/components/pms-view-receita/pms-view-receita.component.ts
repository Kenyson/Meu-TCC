import { Component, OnInit } from '@angular/core';
import { ItemsService } from 'src/app/services/items.service';
import { TranslateService } from 'src/app/services/translate.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import jsPDF from 'jspdf';

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
  pacienteNome: string = '';
  pacienteSobrenome: string = '';

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
      this.pacienteNome = pacienteLS.nome || '';
      this.pacienteSobrenome = pacienteLS.sobrenome || '';
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
      return date.replace(/-/g, '/');
    }
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  downloadPDF() {
    if (!this.receita) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const lang = this.translate.getCurrentLang();
    
    const trans = {
      patient: this.t('pdf.patient'),
      medicine: this.t('pdf.medicine'),
      prescriptionDate: this.t('pdf.prescriptionDate'),
      doctor: this.t('pdf.doctor'),
      signature: this.t('pdf.signature')
    };
    
    // Add logo centered at top
    doc.setFontSize(18);
    doc.text('PMS', (pageWidth - 10) / 2, 15);
    
    let currentY = 30;
    
    // Patient name
    doc.setFontSize(14);
    doc.text(`${trans.patient}: ${this.pacienteNome} ${this.pacienteSobrenome}`, 20, currentY);
    
    // Medication info
    doc.setFontSize(16);
    doc.text(`${trans.medicine}:`, 20, currentY + 15);
    doc.setFontSize(14);
    const medText = `${this.receita.nomeComercial} (${this.receita.principioAtivo}):`;
    doc.text(medText, 20, currentY + 25);
    
    // Posology
    doc.setFontSize(14);
    doc.text(this.receita.posologia, 25, currentY + 35);
    
    // Footer - aligned right at bottom
    const footerY = pageHeight - 45;
    const dateText = `${trans.prescriptionDate}: ${this.formatDate(this.receita.dataPrescricao)}`;
    const doctorText = `${trans.doctor}: ${this.receita.nomeMedico}`;
    
    doc.setFontSize(12);
    doc.text(dateText, pageWidth - 20, footerY, { align: 'right' });
    doc.text(doctorText, pageWidth - 20, footerY + 10, { align: 'right' });
    
    // Signature line on right
    doc.setLineWidth(0.5);
    doc.line(pageWidth - 70, footerY + 20, pageWidth - 20, footerY + 20);
    doc.text(trans.signature, pageWidth - 20, footerY + 27, { align: 'right' });
    
    doc.save(`prescricao_${this.receita.nomeComercial.replace(/\s+/g, '_')}.pdf`);
  }

  t(key: string): string {
    return this.translate.get(key);
  }
}