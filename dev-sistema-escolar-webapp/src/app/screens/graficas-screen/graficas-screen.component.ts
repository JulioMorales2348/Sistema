import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js'; // Importaciones útiles para tipado

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit {

  // Variables
  public total_user: any = {};

  // Etiquetas compartidas para todas las gráficas 
  public labels_usuarios: string[] = ["Administradores", "Maestros", "Alumnos"];
  // Colores para Pie y Doughnut
  public colores_usuarios: string[] = ['#FCFF44', '#F1C8F2', '#31E731']; 

  //Histograma 
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: this.labels_usuarios,
    datasets: [
      {// Se llenará dinámicamente
        data: [], 
        label: 'Registro de usuarios (Línea)',
        backgroundColor: '#F88406',
        pointBackgroundColor: '#F88406',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#F88406',
        fill: 'origin',
      }
    ]
  };
  lineChartOption: ChartConfiguration['options'] = {
    responsive: false
  };
  lineChartPlugins = [ DatalabelsPlugin ];


  // Barras 
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.labels_usuarios,
    datasets: [
      {// Se llenará dinámicamente
        data: [], 
        label: 'Registro de usuarios (Barras)',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB'
        ]
      }
    ]
  };
  barChartOption: ChartConfiguration['options'] = {
    responsive: false
  };
  barChartPlugins = [ DatalabelsPlugin ];


  // Circular 
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: this.labels_usuarios,
    datasets: [
      {// Se llenará dinámicamente
        data: [], 
        label: 'Registro de usuarios',
        backgroundColor: this.colores_usuarios
      }
    ]
  };
  pieChartOption: ChartConfiguration['options'] = {
    responsive: false
  };
  pieChartPlugins = [ DatalabelsPlugin ];


  // Doughnut Chart
  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: this.labels_usuarios,
    datasets: [
      {// Se llenará dinámicamente
        data: [], 
        label: 'Registro de usuarios',
        backgroundColor: this.colores_usuarios
      }
    ]
  };
  doughnutChartOption: ChartConfiguration['options'] = {
    responsive: false
  };
  doughnutChartPlugins = [ DatalabelsPlugin ];


  constructor(
    private administradoresServices: AdministradoresService
  ) { }

  ngOnInit(): void {
    this.obtenerTotalUsers();
  }

  // Función para obtener el total de usuarios registrados
  public obtenerTotalUsers(){
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response) => {
        this.total_user = response;
        console.log("Total usuarios: ", this.total_user);

        // Saca los datos del JSON
        const lista_datos = [response.admins, response.maestros, response.alumnos]; 

        // Actualizar datos de Line Chart
        this.lineChartData = {
          labels: this.labels_usuarios,
          datasets: [{
            data: lista_datos,
            label: 'Registro de usuarios (Línea)',
            backgroundColor: '#F88406',
            fill: true,
            tension: 0.5
          }]
        };

        // Actualizar datos de Bar Chart
        this.barChartData = {
          labels: this.labels_usuarios,
          datasets: [{
            data: lista_datos,
            label: 'Usuarios por Rol',
            backgroundColor: ['#F88406', '#FCFF44', '#82D3FB']
          }]
        };

        // Actualizar datos de Pie Chart
        this.pieChartData = {
          labels: this.labels_usuarios,
          datasets: [{
            data: lista_datos,
            backgroundColor: this.colores_usuarios
          }]
        };

        // Actualizar datos de Doughnut Chart
        this.doughnutChartData = {
          labels: this.labels_usuarios,
          datasets: [{
            data: lista_datos,
            backgroundColor: this.colores_usuarios
          }]
        };

      }, (error) => {
        console.log("Error al obtener total de usuarios ", error);
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }
}