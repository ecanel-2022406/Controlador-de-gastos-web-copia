import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
  private router = inject(Router);
  private intervalo: any;

  fechaActual: Date = new Date();
  nombreUsuario: string = '';

  ingresoFijo: number = 0;
  tendenciaIngresoFijo: string = 'Sin registros';

  ingresoTotal: number = 0;
  tendenciaIngresoTotal: string = 'Sin registros';

  gastosTotales: number = 0;
  tendenciaGastos: string = 'Sin registros';

  totalPresupuestado: number = 0;
  listaPresupuesto: any[] = [];
  listaPagos: any[] = [];

  ngOnInit() {

    this.intervalo = setInterval(() => {
      this.verificarExpiracion();
    }, 1000);

    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const datos = JSON.parse(usuarioGuardado);
        this.nombreUsuario = datos.nombre || '';
      } catch (e) {
        this.nombreUsuario = '';
      }
    }
  }

  ngOnDestroy() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  cerrarSesion() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  verificarExpiracion() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.salirAlLogin();
      return;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = JSON.parse(atob(payloadBase64));
      const expiracionMs = payloadDecoded.exp * 1000;
      
      if (Date.now() >= expiracionMs) {
        this.salirAlLogin();
      }
    } catch (error) {
      this.salirAlLogin();
    }
  }

  salirAlLogin() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}