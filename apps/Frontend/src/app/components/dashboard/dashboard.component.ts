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
    this.nombreUsuario =
      localStorage.getItem('nombreUsuario') || 'Usuario';

    this.verificarToken();

    this.intervaloFecha = setInterval(() => {
      this.fechaActual = new Date();
      this.verificarToken();
    }, 1000);

    this.cargarDatosReales();
  }

  ngOnDestroy(): void {
    if (this.intervaloFecha) {
      clearInterval(this.intervaloFecha);
    }
  }

  verificarToken(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const partes = token.split('.');

      if (partes.length !== 3) {
        throw new Error('Token inválido');
      }

      const payload: any = JSON.parse(
        atob(partes[1])
      );

      const expiracion = payload.exp * 1000;

      if (Date.now() >= expiracion) {
        alert('La sesión ha expirado');

        localStorage.clear();
        sessionStorage.clear();

        this.router.navigate(['/login']);
      }
    } catch (error) {
      localStorage.clear();
      sessionStorage.clear();

      this.router.navigate(['/login']);
    }
  }

  toggleSidebar(): void {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  seleccionarMenu(opcion: string): void {
    this.menuActivo = opcion;
  }

  cerrarSesion(): void {
    localStorage.clear();
    sessionStorage.clear();

    this.router.navigate(['/login']);
  }

  calcularTotalPresupuesto(): void {
    if (this.listaPresupuesto?.length > 0) {
      this.totalPresupuestado = this.listaPresupuesto.reduce(
        (acc, item) => acc + (item.monto || 0),
        0
      );
    } else {
      this.totalPresupuestado = 0;
    }
  }

  cargarDatosReales(): void {}
}
``