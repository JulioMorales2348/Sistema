import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { EventosService } from 'src/app/services/eventos.service';
// Imports para el Modal
import { MatDialog } from '@angular/material/dialog';
import { EditarEventoModalComponent } from 'src/app/modals/editar-evento-modal/editar-evento-modal.component';

@Component({
  selector: 'app-eventos-academicos-screen',
  templateUrl: './eventos-academicos-screen.component.html',
  styleUrls: ['./eventos-academicos-screen.component.scss']
})
export class EventosAcademicosScreenComponent implements OnInit, AfterViewInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_eventos: any[] = [];

  displayedColumns: string[] = ['nombre_evento', 'tipo_evento', 'fecha', 'horario', 'lugar', 'responsable', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosEvento>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private facadeService: FacadeService,
    private eventosService: EventosService,
    private router: Router,
    public dialog: MatDialog // Inyectamos Dialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();
    if(this.token == ""){
      this.router.navigate(["/"]);
    }
    this.obtenerEventos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public obtenerEventos() {
    this.eventosService.obtenerListaEventos().subscribe(
      (response) => {
        this.lista_eventos = response;
        if (this.lista_eventos.length > 0) {
          this.dataSource = new MatTableDataSource<DatosEvento>(this.lista_eventos as DatosEvento[]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (error) => {
        alert("No se pudo obtener la lista de eventos");
      }
    );
  }

  // ✏️ AQUÍ ESTÁ LA LÓGICA QUE PEDISTE
  public goEditar(id: number) {
    // 1. Abrimos el modal de confirmación
    const dialogRef = this.dialog.open(EditarEventoModalComponent, {
      data: { id: id }, // Pasamos el ID por si acaso, aunque no se usa visualmente
      height: '288px',
      width: '328px',
    });

    // 2. Esperamos a que se cierre
    dialogRef.afterClosed().subscribe(result => {
      // 3. Si confirmó (isConfirmed == true), navegamos al formulario
      if(result && result.isConfirmed){
        console.log("Usuario confirmó edición. Navegando...");
        this.router.navigate(["registro-eventos/"+id]); 
      } else {
        console.log("Edición cancelada");
      }
    });
  }

  public delete(id: number) {
    // (Tu lógica de eliminar existente...)
  }
}

export interface DatosEvento {
  id: number;
  nombre_evento: string;
  tipo_evento: string;
  fecha_realizacion: string;
  hora_inicio: string;
  hora_fin: string;
  lugar: string;
  responsable: string;
}