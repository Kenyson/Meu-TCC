import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { SyncService } from './sync.service';
import { environment } from '../../environments/environment';

@Injectable()
export class SyncInterceptor implements HttpInterceptor {
  constructor(private syncService: SyncService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        // Verificar se é uma resposta bem-sucedida
        if (event instanceof HttpResponse) {
          const url = req.url.toLowerCase();

          // Se for um registro de novo médico
          if (req.method === 'POST' && url.includes('/medicos') && event.status === 201) {
            const medicoData = req.body;
            console.log('[SyncInterceptor] Novo médico registrado:', medicoData);
            this.syncService.addStoredAccount({
              type: 'medico',
              crm: medicoData.crm,
              nome: medicoData.nome,
              sobrenome: medicoData.sobrenome,
              estado: medicoData.estado,
              especialidade: medicoData.especialidade,
              telefone: medicoData.telefone,
              senha: medicoData.senha
            });
            // Fazer sync manual para garantir que a conta está no banco
            this.syncService.manualSync().catch(err => console.error('Erro ao sincronizar após registro de médico:', err));
          }

// Se for um registro de novo paciente
          if (req.method === 'POST' && url.includes('/pacientes') && (event.status === 201 || event.status === 200)) {
            const pacienteData = req.body;
            console.log('[SyncInterceptor] Novo paciente registrado:', pacienteData);
            // Extract id from response body
            const responseBody = event.body as { id?: number };
            this.syncService.addStoredAccount({
              type: 'paciente',
              id: responseBody?.id || Date.now(),
              nome: pacienteData.nome,
              sobrenome: pacienteData.sobrenome,
              cpf: pacienteData.cpf,
              telefone: pacienteData.telefone,
              dataNascimento: pacienteData.dataNascimento,
              data_nascimento: pacienteData.dataNascimento,
              senha: pacienteData.senha
            });
          }
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}
