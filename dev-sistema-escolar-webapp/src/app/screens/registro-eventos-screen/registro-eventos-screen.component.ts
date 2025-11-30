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

  constructor(
    private location: Location,
    private router: Router,
    private eventosService: EventosService
  ) { }

  ngOnInit(): void {
    this.evento = this.eventosService.esquemaEvento();
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

  public registrar() {
    // Validación básica para depuración
    console.log("Datos a registrar:", this.evento);

    this.eventosService.registrarEvento(this.evento).subscribe(
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