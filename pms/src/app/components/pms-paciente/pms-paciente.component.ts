import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ItemsService } from 'src/app/services/items.service';
import { TranslateService } from 'src/app/services/translate.service';

interface Receita {
   id: number;
   nome_comercial: string;
   principio_ativo: string;
   posologia: string;
   indicacao: string;
   data_prescricao: Date;
   data_validade: string;
   nomeMedico: string;
 }

 interface Paciente {
   id: string;
   cpf: string;
   nome: string;
 }

 let paciente_id: string;

 @Component({
   selector: 'app-pms-paciente',
   templateUrl: './pms-paciente.component.html',
   styleUrls: ['./pms-paciente.component.css']
 })
 export class PmsPacienteComponent implements OnInit {
   colunas = [
     { nome: 'paciente.columns.commercialName', propriedade: 'nome_comercial' },
     { nome: 'paciente.columns.activeIngredient', propriedade: 'principio_ativo' },
     { nome: 'paciente.columns.posology', propriedade: 'posologia' },
     { nome: 'paciente.columns.indication', propriedade: 'indicacao' },
     { nome: 'paciente.columns.prescriptionDate', propriedade: 'data_prescricao' },
     { nome: 'paciente.columns.expirationDate', propriedade: 'data_validade' },
     { nome: 'paciente.columns.doctor', propriedade: 'nomeMedico' },
   ];

   items: Receita[] = [];
   mostrarBotao: boolean = false;
   nomeDoPaciente: string = '';

   get tituloTabela(): string {
     return `${this.t('paciente.title')} ${this.nomeDoPaciente}`;
   }

   get novoItemNomeValue(): string {
     return this.t('paciente.newPrescription');
   }

   constructor(private authService: AuthService, private http: HttpClient, private itemsService: ItemsService, private router: Router, private translate: TranslateService) {}

   ngOnInit() {
     const storedPacienteId = localStorage.getItem('paciente_id');
     const storedPacienteNome = localStorage.getItem('paciente_nome');
     const pacienteSelecionadoLS = JSON.parse(localStorage.getItem('pacienteSelecionado') || 'null');
     
     if (this.authService.isPacienteLoggedIn()) {
       paciente_id = (this.authService.usuarioLogado as Paciente).id;
       this.mostrarBotao = false;
       this.nomeDoPaciente = (this.authService.usuarioLogado as Paciente).nome;
       this.itemsService.setItemPaciente(this.authService.usuarioLogado as Paciente);
       localStorage.setItem('paciente_id', paciente_id);
       localStorage.setItem('paciente_nome', this.nomeDoPaciente);
     } else if (this.authService.isMedicoLoggedIn()) {
       let pacienteContexto: any = null;
       if (pacienteSelecionadoLS && pacienteSelecionadoLS['nome']) {
         pacienteContexto = pacienteSelecionadoLS;
       } else if (storedPacienteId && storedPacienteNome) {
         pacienteContexto = { id: storedPacienteId, nome: storedPacienteNome };
       }
       
       if (pacienteContexto) {
         this.nomeDoPaciente = pacienteContexto['nome'];
         paciente_id = pacienteContexto['id'] || storedPacienteId || '';
         this.itemsService.setItemPaciente(pacienteContexto);
       } else {
         paciente_id = '';
       }
       this.mostrarBotao = true;
     }
     this.obterReceitas();
   }

   redirecionarParaReceita() {
     this.router.navigate(['/receita']);
   }

   verReceita(item: any) {
     this.itemsService.setItemReceita(item);
     const pacienteContexto = this.itemsService.getItemPaciente();
     if (pacienteContexto) {
       localStorage.setItem('pacienteSelecionado', JSON.stringify(pacienteContexto));
     }
     this.router.navigate(['/ver-receita']);
   }

   onRemoveButton(item: any) {
     if (item.expirada) {
       return;
     }
     if (confirm(this.t('paciente.confirmRemove'))) {
       this.http.delete(`http://localhost:3000/receitas/${item.id}`).subscribe({
         next: () => {
           this.items = this.items.filter((i) => i.id !== item.id);
         },
         error: (err) => {
           console.error('Erro ao remover receita:', err);
         }
       });
     }
   }

   obterReceitas() {
     const url = `http://localhost:3000/receitas?paciente_id=${paciente_id}`;

     this.http.get<Receita[]>(url).subscribe(
       (receitas: Receita[]) => {
         this.items = receitas.map(receita => ({
           ...receita,
           expirada: this.isReceitaExpirada(receita.data_validade)
         }));
       },
       (error: any) => {
         console.error('Ocorreu um erro ao obter as receitas:', error);
       }
     );
   }

   isReceitaExpirada(dataValidade: string): boolean {
     if (!dataValidade) return false;
     const partes = dataValidade.split('-');
     if (partes.length !== 3) return false;
     const [dia, mes, ano] = partes.map(Number);
     const validade = new Date(ano, mes - 1, dia);
     const hoje = new Date();
     hoje.setHours(0, 0, 0, 0);
     validade.setHours(0, 0, 0, 0);
     return validade < hoje;
   }

   t(key: string): string {
     return this.translate.get(key);
   }
 }