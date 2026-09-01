import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <form class="login-card" (ngSubmit)="enviarFormulario()">
        <div class="login-header">
          <!-- Imagen y texto colorido de Novatech lado a lado -->
          <div class="logo-wrapper">
            <img src="images/logo.png" alt="Novatech Logo" class="logo-img" />
            <h1>NOVATECH</h1>
          </div>
          <h2>{{ esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión' }}</h2>
          <p>{{ esRegistro ? 'Regístrate para comenzar' : 'Ingresa tus credenciales para acceder' }}</p>
        </div>

        <!-- Campo Nombre (Solo aparece si es registro) -->
        <div class="form-group" *ngIf="esRegistro">
          <label>Nombre</label>
          <input type="text" [(ngModel)]="usuario.nombre" name="nombre" placeholder="Tu nombre" [required]="esRegistro" />
        </div>

        <div class="form-group">
          <label>Correo Electrónico</label>
          <input type="email" [(ngModel)]="usuario.email" name="email" placeholder="nombre@ejemplo.com" required />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" [(ngModel)]="usuario.password" name="password" placeholder="••••••••" required />
        </div>

        <button type="submit">{{ esRegistro ? 'Registrarse' : 'Entrar' }}</button>
        
        <p class="toggle-mode" (click)="esRegistro = !esRegistro">
          {{ esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate' }}
        </p>
      </form>
    </div>
  `,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  esRegistro = false;
  
  usuario = {
    nombre: '',
    email: '',
    password: ''
  };

  private authService = inject(AuthService);
  private router = inject(Router);

  enviarFormulario() {
    if (this.esRegistro) {
      this.authService.register(this.usuario).subscribe({
        next: (res: any) => {
          alert('¡Usuario registrado con éxito! Ahora inicia sesión.');
          this.esRegistro = false;
          this.usuario.password = '';
        },
        error: (err) => {
          alert(err.error?.mensaje || 'Error al registrarse');
        }
      });
    } else {
      this.authService.login({ email: this.usuario.email, password: this.usuario.password }).subscribe({
        next: (res: any) => {

          localStorage.setItem('token', res.token);
          
          const nombreEncontrado = res.nombre || res.usuario?.nombre || this.usuario.email.split('@')[0];
          localStorage.setItem('nombreUsuario', nombreEncontrado);

          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          alert(err.error?.mensaje || 'Credenciales incorrectas');
        }
      });
    }
  }
}