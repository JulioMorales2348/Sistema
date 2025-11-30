import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FacadeService } from './facade.service';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(
    private http: HttpClient,
    private facadeService: FacadeService
  ) { }

  // Estructura base del formulario
  public esquemaEvento(){
    return {
      'nombre_evento': '',
      'tipo_evento': '',
      'fecha_realizacion': '',
      'hora_inicio': '',
      'hora_fin': '',
      'lugar': '',
      'publico_objetivo': '',
      'programa_educativo': '', 
      'responsable': '',
      'descripcion': '',
      'cupo_maximo': 0
    }
  }

  // Servicio para registrar (POST)
  public registrarEvento(data: any): Observable<any>{
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    
    return this.http.post<any>(`${environment.url_api}/eventos/`, data, { headers });
  }
}