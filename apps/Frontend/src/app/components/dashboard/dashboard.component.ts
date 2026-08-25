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

  ngOnInit() {
    // Valida la expiración del token cada segundo
    this.intervalo = setInterval(() => {
      this.verificarExpiracion();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  // Método de prueba para peticiones si lo requieres
  probarPeticion() {
    console.log('Haciendo petición de prueba al servidor...');
    // Aquí puedes agregar tu lógica con HttpClient si lo deseas
  }

  cerrarSesion() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
    localStorage.removeItem('token');
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
    this.router.navigate(['/login']);
  }
}