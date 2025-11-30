import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-registro-eventos-screen',
  templateUrl: './registro-eventos-screen.component.html',
  styleUrls: ['./registro-eventos-screen.component.scss']
})
export class RegistroEventosScreenComponent implements OnInit {

  public evento: any = {};
  public errors: any = {};
  public minDate: Date = new Date();  //para la fecha del dia de hoy
   public lista_responsables: any[] = []; //para los responsables

  constructor(
    private location: Location,
    private router: Router,
    private eventosService: EventosService
  ) { }

  ngOnInit(): void {
    this.evento = this.eventosService.esquemaEvento();
    this.obtenerResponsables();
  }

  public obtenerResponsables() {
    this.eventosService.obtenerResponsables().subscribe(
      (response) => {
        this.lista_responsables = response;
        console.log("Responsables cargados:", this.lista_responsables);
      },
      (error) => {
        console.error("Error al obtener responsables:", error);
      }
    );
  }

  public goBack() {
    this.location.back();
  }

  // Formatear la fecha al formato que Django acepta (YYYY-MM-DD)
  public changeFecha(event: any) {
    if (event.value) {
      this.evento.fecha_realizacion = event.value.toISOString().split('T')[0];
    }
  }

  // Lógica para Checkboxes 
  public checkboxChange(event: any){
    if(event.checked){
      // Si se selecciona, se agrega al array
      this.evento.publico_objetivo.push(event.source.value);
    }else{
      // Si se desmarca se busca y se elimina del array
      this.evento.publico_objetivo.forEach((item: any, i: any) => {
        if(item == event.source.value){
          this.evento.publico_objetivo.splice(i,1);
        }
      });
    }
    console.log("Público objetivo:", this.evento.publico_objetivo);
  }

  public isEstudianteSelected(): boolean {
    // Verifica si 'Estudiantes' está en el arreglo
    return this.evento.publico_objetivo.includes('Estudiantes');
  }

  public registrar() {
    // Limpiamos errores previos
    this.errors = {};
    // Validamos el formulario con el servicio
    this.errors = this.eventosService.validarEvento(this.evento);
    
    // Si hay errores, construimos un mensaje detallado
    if (Object.keys(this.errors).length > 0) {
      
      let listaErrores = "";
      // Recorremos cada error para agregarlo a la lista del alert
      Object.values(this.errors).forEach(err => {
        listaErrores += `• ${err}\n`;
      });
      
      alert("No se pudo registrar el evento debido a:\n" + listaErrores);
      return false;
    }

    // Preparar datos para enviar 
    const eventoAEnviar = { ...this.evento };
    eventoAEnviar.publico_objetivo = this.evento.publico_objetivo.join(', '); 

    this.eventosService.registrarEvento(eventoAEnviar).subscribe(
      (response) => {
        alert("Evento registrado exitosamente");
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error(error);
        alert("Error al registrar el evento");
      }
    );
  }
}