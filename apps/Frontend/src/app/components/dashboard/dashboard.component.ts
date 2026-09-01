import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  fechaActual: Date = new Date();
  nombreUsuario: string = '';
  
  menuActivo: string = 'inicio';
  sidebarAbierto: boolean = true;

  ingresoFijo: number = 0;
  ingresoTotal: number = 0;
  gastosTotales: number = 0;

  listaPresupuesto: any[] = [];
  listaPagos: any[] = [];

  totalPresupuestado: number = 0;

  private intervaloFecha: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';

    this.intervaloFecha = setInterval(() => {
      this.fechaActual = new Date();
    }, 60000);

    this.cargarDatosReales();
  }

  ngOnDestroy(): void {
    if (this.intervaloFecha) {
      clearInterval(this.intervaloFecha);
    }
  }

  toggleSidebar(): void {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  seleccionarMenu(opcion: string): void {
    this.menuActivo = opcion;
  }

  cerrarSesion(): void {
    this.verificarExpiracion();
    this.salirAlLogin();
  }

  verificarExpiracion(): void {
    localStorage.clear();
    sessionStorage.clear();
  }

  salirAlLogin(): void {
    this.router.navigate(['/login']);
  }

  calcularTotalPresupuesto(): void {
    if (this.listaPresupuesto && this.listaPresupuesto.length > 0) {
      this.totalPresupuestado = this.listaPresupuesto.reduce((acc, item) => acc + (item.monto || 0), 0);
    } else {
      this.totalPresupuestado = 0;
    }
  }

  cargarDatosReales(): void {
  }
}