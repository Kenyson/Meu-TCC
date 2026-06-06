import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoadingService } from './loading.service';

export interface StoredAccount {
  type: 'medico' | 'paciente';
  crm?: number;
  id?: number;
  nome: string;
  sobrenome: string;
  cpf?: string;
  estado?: string;
  especialidade?: string;
  telefone?: string;
  dataNascimento?: string;
  data_nascimento?: string;
  senha: string;
}

export interface SyncState {
  lastSync: number;
  customAccounts: StoredAccount[];
}

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private readonly SYNC_KEY = 'pms_sync_state';
  private readonly SYNC_INTERVAL = 60 * 60 * 1000;
  private readonly SEED_URL = environment.production
    ? 'https://pms-backend-2-f6uy.onrender.com/api/seed'
    : 'http://localhost:3000/api/seed';
  private readonly SEED_SECRET = 'pharma-seed-secret-2026';
  private isSyncing = false;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) { }

  private getSyncState(): SyncState {
    const stored = localStorage.getItem(this.SYNC_KEY);
    return stored ? JSON.parse(stored) : { lastSync: 0, customAccounts: [] };
  }

  private saveSyncState(state: SyncState): void {
    localStorage.setItem(this.SYNC_KEY, JSON.stringify(state));
  }

  private shouldSync(): boolean {
    const state = this.getSyncState();
    const now = Date.now();

    if (state.lastSync === 0) {
      return true;
    }

    const timeSinceLastSync = now - state.lastSync;
    return timeSinceLastSync > this.SYNC_INTERVAL;
  }

  getStoredAccounts(): StoredAccount[] {
    const state = this.getSyncState();
    return state.customAccounts;
  }


  addStoredAccount(account: StoredAccount): void {
    const state = this.getSyncState();

    const exists = state.customAccounts.some(
      acc => acc.type === account.type && (acc.crm === account.crm || acc.cpf === account.cpf || acc.id === account.id)
    );

    if (!exists) {
      state.customAccounts.push(account);
      this.saveSyncState(state);
    }
  }

  clearStoredAccounts(): void {
    const state = this.getSyncState();
    state.customAccounts = [];
    this.saveSyncState(state);
  }

  async autoSync(): Promise<boolean> {
    if (this.isSyncing) {
      console.log('[SyncService] Sync já em progresso, ignorando');
      return true;
    }

    if (!this.shouldSync()) {
      console.log('[SyncService] Não é necessário sincronizar');
      return true;
    }

    try {
      this.isSyncing = true;
      console.log('[SyncService] Iniciando sincronização automática...');
      this.loadingService.show();

      await this.performSync();

      const state = this.getSyncState();
      state.lastSync = Date.now();
      this.saveSyncState(state);

      console.log('[SyncService] Sincronização concluída com sucesso');
      return true;
    } catch (error) {
      console.error('[SyncService] Erro ao sincronizar:', error);
      this.loadingService.hide();
      return false;
    } finally {
      this.isSyncing = false;
      this.loadingService.hide();
    }
  }

  async manualSync(): Promise<boolean> {
    if (this.isSyncing) {
      console.log('[SyncService] Sync já em progresso, ignorando');
      return true;
    }

    try {
      this.isSyncing = true;
      console.log('[SyncService] Iniciando sincronização manual...');
      this.loadingService.show();

      await this.performSync();

      const state = this.getSyncState();
      state.lastSync = Date.now();
      this.saveSyncState(state);

      console.log('[SyncService] Sincronização manual concluída com sucesso');
      return true;
    } catch (error) {
      console.error('[SyncService] Erro ao sincronizar:', error);
      this.loadingService.hide();
      return false;
    } finally {
      this.isSyncing = false;
      this.loadingService.hide();
    }
  }

  private async performSync(): Promise<void> {
    return new Promise((resolve, reject) => {
      const seedData = this.getDefaultSeedData();

      const state = this.getSyncState();
      if (state.customAccounts && state.customAccounts.length > 0) {
        console.log(`[SyncService] Adicionando ${state.customAccounts.length} contas armazenadas`);

        for (const account of state.customAccounts) {
          if (account.type === 'medico') {
            seedData.medicos.push({
              crm: account.crm || 0,
              estado: account.estado || '',
              nome: account.nome,
              sobrenome: account.sobrenome,
              telefone: account.telefone || '',
              especialidade: account.especialidade || '',
              senha: account.senha
            });
          } else if (account.type === 'paciente') {
            seedData.pacientes.push({
              id: account.id || Date.now(),
              nome: account.nome,
              sobrenome: account.sobrenome,
              cpf: account.cpf || '',
              data_nascimento: account.data_nascimento || account.dataNascimento || null,
              telefone: account.telefone || '',
              senha: account.senha
            });
          }
        }
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.SEED_SECRET}`,
        'Content-Type': 'application/json'
      });

      this.http.post<any>(this.SEED_URL, seedData, { headers }).subscribe(
        (response) => {
          console.log('[SyncService] Resposta do seeding:', response);
          resolve();
        },
        (error) => {
          console.error('[SyncService] Erro na requisição de seeding:', error);
          reject(error);
        }
      );
    });
  }


  private getDefaultSeedData(): any {
    return {
      medicos: [
        {
          crm: 99999,
          estado: 'São Paulo',
          nome: 'Marco',
          sobrenome: 'Medici',
          telefone: '11999999999',
          especialidade: 'Clínico Geral',
          senha: 'doctor123'
        }
      ],
      pacientes: [
        {
          id: 8,
          nome: 'Mario',
          sobrenome: 'Rossi',
          cpf: '12345678901',
          data_nascimento: '15-05-1990',
          telefone: '11988888888',
          senha: 'patient123'
        },
        {
          id: 9,
          nome: 'Luigi',
          sobrenome: 'Verdi',
          cpf: '98765432100',
          data_nascimento: '20-03-1985',
          telefone: '21999999999',
          senha: 'patient123'
        },
        {
          id: 10,
          nome: 'Antonio',
          sobrenome: 'Neri',
          cpf: '11122233344',
          data_nascimento: '12-11-1978',
          telefone: '31999999999',
          senha: 'patient123'
        },
        {
          id: 11,
          nome: 'Giuseppe',
          sobrenome: 'Bianchi',
          cpf: '14575673773',
          data_nascimento: null,
          telefone: '27997363811',
          senha: 'null'
        }
      ],
      receitas: [
        {
          id: 26,
          nome_comercial: 'Paracetamol',
          principio_ativo: 'Acetaminofen',
          indicacao: 'Dor e febre',
          medico_id: 99999,
          paciente_id: 8,
          data_prescricao: '15-05-2026',
          data_validade: '29-05-2026',
          posologia: '1 comprimido a cada 8 horas',
          nomeMedico: 'Marco Medici'
        },
        {
          id: 27,
          nome_comercial: 'Ibuprofeno',
          principio_ativo: 'Brufen',
          indicacao: 'Inflamação',
          medico_id: 99999,
          paciente_id: 8,
          data_prescricao: '10-05-2026',
          data_validade: '28-05-2026',
          posologia: '1 comprimido a cada 12 horas',
          nomeMedico: 'Marco Medici'
        },
        {
          id: 28,
          nome_comercial: 'Paracetamol',
          principio_ativo: 'Acetaminofen',
          indicacao: 'Dor e febre',
          medico_id: 99999,
          paciente_id: 8,
          data_prescricao: '15-05-2026',
          data_validade: '29-05-2026',
          posologia: '1 comprimido a cada 8 horas',
          nomeMedico: 'Marco Medici'
        },
        {
          id: 29,
          nome_comercial: 'Ibuprofeno',
          principio_ativo: 'Brufen',
          indicacao: 'Inflamação',
          medico_id: 99999,
          paciente_id: 8,
          data_prescricao: '10-05-2026',
          data_validade: '28-05-2026',
          posologia: '1 comprimido a cada 12 horas',
          nomeMedico: 'Marco Medici'
        },
        {
          id: 30,
          nome_comercial: 'Paracetamol Expired',
          principio_ativo: 'Acetaminofen',
          indicacao: 'Dor e febre',
          medico_id: 99999,
          paciente_id: 8,
          data_prescricao: '15-05-2026',
          data_validade: '28-05-2026',
          posologia: '1 comprimido a cada 8 horas',
          nomeMedico: 'Marco Medici'
        },
        {
          id: 31,
          nome_comercial: 'Ibuprofeno Expired',
          principio_ativo: 'Brufen',
          indicacao: 'Inflamação',
          medico_id: 99999,
          paciente_id: 8,
          data_prescricao: '10-05-2026',
          data_validade: '29-05-2026',
          posologia: '1 comprimido a cada 12 horas',
          nomeMedico: 'Marco Medici'
        },

        {
          id: 32,
          nome_comercial: 'Aulin',
          principio_ativo: 'Lansoprazolo',
          indicacao: 'Gastrite e reflusso',
          medico_id: 99999,
          paciente_id: 11,
          data_prescricao: '01-05-2026',
          data_validade: '10-05-2026',
          posologia: '1 compressa al mattino',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 33,
          nome_comercial: 'Augmentin',
          principio_ativo: 'Amoxicillina',
          indicacao: 'Infezioni batteriche',
          medico_id: 99999,
          paciente_id: 11,
          data_prescricao: '01-05-2026',
          data_validade: '15-05-2026',
          posologia: '1 compressa ogni 12 ore',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 34,
          nome_comercial: 'Tachipirina',
          principio_ativo: 'Paracetamolo',
          indicacao: 'Dolore e febbre',
          medico_id: 99999,
          paciente_id: 10,
          data_prescricao: '01-04-2026',
          data_validade: '05-05-2026',
          posologia: '1 compressa ogni 8 ore',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 35,
          nome_comercial: 'Augmentin',
          principio_ativo: 'Amoxicillina',
          indicacao: 'Infezioni batteriche',
          medico_id: 99999,
          paciente_id: 10,
          data_prescricao: '01-04-2026',
          data_validade: '09-05-2026',
          posologia: '1 compressa ogni 12 ore',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 36,
          nome_comercial: 'Ciproxin',
          principio_ativo: 'Ciprofloxacina',
          indicacao: 'Infezioni urinarie',
          medico_id: 99999,
          paciente_id: 10,
          data_prescricao: '01-04-2026',
          data_validade: '10-05-2026',
          posologia: '1 compressa al giorno',
          nomeMedico: 'Dr. Marco Medici'
        },

        {
          id: 39,
          nome_comercial: 'NiQuitin',
          principio_ativo: 'Nicotina',
          indicacao: 'Aiuto per smettere di fumare',
          medico_id: 99999,
          paciente_id: 9,
          data_prescricao: '01-04-2026',
          data_validade: '07-05-2026',
          posologia: '1 compressa al giorno',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 40,
          nome_comercial: 'Aulin',
          principio_ativo: 'Lansoprazolo',
          indicacao: 'Gastrite e reflusso',
          medico_id: 99999,
          paciente_id: 9,
          data_prescricao: '01-04-2026',
          data_validade: '08-05-2026',
          posologia: '1 compressa al mattino',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 41,
          nome_comercial: 'Moment',
          principio_ativo: 'Lattosio',
          indicacao: 'Digestivo',
          medico_id: 99999,
          paciente_id: 8,
          data_prescricao: '01-04-2026',
          data_validade: '06-05-2026',
          posologia: '1 compressa dopo pasti',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 42,
          nome_comercial: 'Tachipirina',
          principio_ativo: 'Paracetamolo',
          indicacao: 'Dolore e febbre',
          medico_id: 99999,
          paciente_id: 8,
          data_prescricao: '01-05-2026',
          data_validade: '15-06-2028',
          posologia: '1 compressa ogni 8 ore',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 43,
          nome_comercial: 'Augmentin',
          principio_ativo: 'Amoxicillina',
          indicacao: 'Infezioni batteriche',
          medico_id: 99999,
          paciente_id: 9,
          data_prescricao: '01-05-2026',
          data_validade: '05-07-2028',
          posologia: '1 compressa ogni 12 ore',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 44,
          nome_comercial: 'NiQuitin',
          principio_ativo: 'Nicotina',
          indicacao: 'Aiuto per smettere di fumare',
          medico_id: 99999,
          paciente_id: 8,
          data_prescricao: '01-05-2026',
          data_validade: '25-06-2028',
          posologia: '1 compressa al giorno',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 45,
          nome_comercial: 'Aulin',
          principio_ativo: 'Lansoprazolo',
          indicacao: 'Gastrite e reflusso',
          medico_id: 99999,
          paciente_id: 9,
          data_prescricao: '01-05-2026',
          data_validade: '30-06-2028',
          posologia: '1 compressa al mattino',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 46,
          nome_comercial: 'Litalong',
          principio_ativo: 'Litalong',
          indicacao: 'Dolore artroso',
          medico_id: 99999,
          paciente_id: 10,
          data_prescricao: '01-05-2026',
          data_validade: '20-07-2028',
          posologia: '1 compressa al pomeriggio',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 47,
          nome_comercial: 'Polase',
          principio_ativo: 'Ferro',
          indicacao: 'Anemia',
          medico_id: 99999,
          paciente_id: 10,
          data_prescricao: '01-05-2026',
          data_validade: '25-07-2028',
          posologia: '1 compressa al giorno',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 48,
          nome_comercial: 'Rifampicina',
          principio_ativo: 'Rifampicina',
          indicacao: 'Tubercolosi',
          medico_id: 99999,
          paciente_id: 10,
          data_prescricao: '01-05-2026',
          data_validade: '15-07-2028',
          posologia: '1 compressa al mattino',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 49,
          nome_comercial: 'Tachipirina',
          principio_ativo: 'Paracetamolo',
          indicacao: 'Dolore e febbre',
          medico_id: 99999,
          paciente_id: 11,
          data_prescricao: '01-05-2026',
          data_validade: '15-06-2028',
          posologia: '1 compressa ogni 8 ore',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 52,
          nome_comercial: 'Moment',
          principio_ativo: 'Lattosio',
          indicacao: 'Digestivo',
          medico_id: 99999,
          paciente_id: 8,
          data_prescricao: '01-05-2026',
          data_validade: '20-06-2028',
          posologia: '1 compressa dopo pasti',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 53,
          nome_comercial: 'Ciproxin',
          principio_ativo: 'Ciprofloxacina',
          indicacao: 'Infezioni urinarie',
          medico_id: 99999,
          paciente_id: 9,
          data_prescricao: '01-05-2026',
          data_validade: '10-07-2028',
          posologia: '1 compressa al giorno',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 54,
          nome_comercial: 'Polase',
          principio_ativo: 'Ferro',
          indicacao: 'Anemia',
          medico_id: 99999,
          paciente_id: 11,
          data_prescricao: '01-05-2026',
          data_validade: '30-06-2028',
          posologia: '1 compressa al giorno',
          nomeMedico: 'Dr. Marco Medici'
        },
        {
          id: 55,
          nome_comercial: 'Linctus',
          principio_ativo: 'Derivato codeina',
          indicacao: 'Tosse secca',
          medico_id: 99999,
          paciente_id: 11,
          data_prescricao: '01-05-2026',
          data_validade: '30-07-2028',
          posologia: '1 compressa al bisogno',
          nomeMedico: 'Dr. Marco Medici'
        }
      ],
      conexoes: [
        { medico_id: 99999, paciente_id: 8 },
        { medico_id: 99999, paciente_id: 9 },
        { medico_id: 99999, paciente_id: 10 }
      ]
    };
  }
}

