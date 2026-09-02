import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {

  constructor() {}

  // Llave única y normalizada por usuario para evitar pérdida de datos o mezclas
  private obtenerClaveUsuario(claveBase: string): string {
    const usuarioActual = localStorage.getItem('nombreUsuario') || 'default';
    return `${claveBase}_${usuarioActual.toLowerCase().trim()}`;
  }

  // --- INGRESO FIJO ---
  private getIngresoFijoInicial(): number {
    const clave = this.obtenerClaveUsuario('ingresoFijo');
    return Number(localStorage.getItem(clave)) || 0;
  }

  private ingresoFijoSource = new BehaviorSubject<number>(this.getIngresoFijoInicial());
  ingresoFijo$ = this.ingresoFijoSource.asObservable();

  guardarIngresoFijo(monto: number) {
    const clave = this.obtenerClaveUsuario('ingresoFijo');
    localStorage.setItem(clave, monto.toString());
    this.ingresoFijoSource.next(monto);
  }

  // --- LISTA DE INGRESOS ---
  private getIngresosIniciales(): any[] {
    const clave = this.obtenerClaveUsuario('listaIngresos');
    return JSON.parse(localStorage.getItem(clave) || '[]');
  }

  private listaIngresosSource = new BehaviorSubject<any[]>(this.getIngresosIniciales());
  listaIngresos$ = this.listaIngresosSource.asObservable();

  agregarIngreso(nuevoIngreso: any) {
    const clave = this.obtenerClaveUsuario('listaIngresos');
    const listaActual = this.listaIngresosSource.getValue();
    const listaActualizada = [...listaActual, nuevoIngreso];
    localStorage.setItem(clave, JSON.stringify(listaActualizada));
    this.listaIngresosSource.next(listaActualizada);

    if (nuevoIngreso.categoria === 'Salario Fijo' || nuevoIngreso.frecuencia !== 'Único') {
      this.guardarIngresoFijo(nuevoIngreso.monto);
    }
  }

  // --- LISTA DE GASTOS ---
  private getGastosIniciales(): any[] {
    const clave = this.obtenerClaveUsuario('listaGastos');
    return JSON.parse(localStorage.getItem(clave) || '[]');
  }

  private listaGastosSource = new BehaviorSubject<any[]>(this.getGastosIniciales());
  listaGastos$ = this.listaGastosSource.asObservable();

  agregarGasto(nuevoGasto: any) {
    const clave = this.obtenerClaveUsuario('listaGastos');
    const listaActual = this.listaGastosSource.getValue();
    const listaActualizada = [...listaActual, nuevoGasto];
    localStorage.setItem(clave, JSON.stringify(listaActualizada));
    this.listaGastosSource.next(listaActualizada);
  }

  // Recarga los datos al iniciar sesión o cambiar de usuario
  recargarDatosUsuario() {
    this.ingresoFijoSource.next(this.getIngresoFijoInicial());
    this.listaIngresosSource.next(this.getIngresosIniciales());
    this.listaGastosSource.next(this.getGastosIniciales());
  }
}