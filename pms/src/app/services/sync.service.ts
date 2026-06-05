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
    : 'http://localhost:3001/api/seed';
  private readonly SEED_SECRET = 'pharma-seed-secret-2026';
  private isSyncing = false;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  /**
   * Obter o estado atual de sincronização
   */
  private getSyncState(): SyncState {
    const stored = localStorage.getItem(this.SYNC_KEY);
    return stored ? JSON.parse(stored) : { lastSync: 0, customAccounts: [] };
  }

  /**
   * Salvar o estado de sincronização
   */
  private saveSyncState(state: SyncState): void {
    localStorage.setItem(this.SYNC_KEY, JSON.stringify(state));
  }

  /**
   * Verificar se é necessário fazer o seeding
   */
  private shouldSync(): boolean {
    const state = this.getSyncState();
    const now = Date.now();

    // Se nunca sincronizou, precisa sincronizar
    if (state.lastSync === 0) {
      return true;
    }

    // Se passou de 1 hora, precisa sincronizar
    const timeSinceLastSync = now - state.lastSync;
    return timeSinceLastSync > this.SYNC_INTERVAL;
  }

  /**
   * Obter as contas armazenadas localmente
   */
  getStoredAccounts(): StoredAccount[] {
    const state = this.getSyncState();
    return state.customAccounts;
  }

  /**
   * Adicionar uma conta armazenada (usada quando um paciente/médico se registra)
   */
  addStoredAccount(account: StoredAccount): void {
    const state = this.getSyncState();

    // Evitar duplicatas
    const exists = state.customAccounts.some(
      acc => acc.type === account.type && (acc.crm === account.crm || acc.cpf === account.cpf || acc.id === account.id)
    );

    if (!exists) {
      state.customAccounts.push(account);
      this.saveSyncState(state);
    }
  }

  /**
   * Limpar contas armazenadas (opcional - chamar após sucesso do seeding)
   */
  clearStoredAccounts(): void {
    const state = this.getSyncState();
    state.customAccounts = [];
    this.saveSyncState(state);
  }

  /**
   * Fazer o seeding automático se necessário
   */
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

  /**
   * Fazer o seeding sob demanda (útil para quando o usuário cria uma conta)
   */
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

  /**
   * Executar o seeding com os dados padrão + contas armazenadas
   */
  private async performSync(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Importar dados padrão do seed
      const seedData = this.getDefaultSeedData();

      // Adicionar contas armazenadas
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

  /**
   * Obter dados padrão do seeding (equivalente ao seed.html)
   */
  private getDefaultSeedData(): any {
    return {
      medicos: [
        {
          crm: 99999,
          estado: 'São Paulo',
          nome: 'Demo',
          sobrenome: 'Silva',
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
        },
        {
          id: 12,
          nome: 'teste',
          sobrenome: 'teste',
          cpf: '11122233344',
          data_nascimento: '03-06-2026',
          telefone: '(11) 1611-11561',
          senha: '0000'
        },
        {
          id: 13,
          nome: 'teste',
          sobrenome: 'teste',
          cpf: '99999999999',
          data_nascimento: '2026-06-18',
          telefone: '999999999999',
          senha: '0000'
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
          nomeMedico: 'Demo Silva'
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
          nomeMedico: 'Demo Silva'
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
          nomeMedico: 'Demo Silva'
        }
      ],
      conexoes: [
        { medico_id: 99999, paciente_id: 8 },
        { medico_id: 99999, paciente_id: 9 },
        { medico_id: 99999, paciente_id: 10 },
        { medico_id: 99999, paciente_id: 11 },
        { medico_id: 99999, paciente_id: 12 },
        { medico_id: 99999, paciente_id: 13 }
      ]
    };
  }
}
