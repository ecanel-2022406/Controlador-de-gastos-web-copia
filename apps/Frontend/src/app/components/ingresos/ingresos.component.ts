import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IngresosService } from '../../services/ingresos.service';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent implements OnInit {
  montoFijoInput: number | null = null;
  frecuenciaFijoInput: string = 'Quincenal';
  ingresoFijoGuardado: number = 0;

  conceptoExtraInput: string = '';
  montoExtraInput: number | null = null;
  fechaExtraInput: string = '';

  listaPresupuesto: any[] = [];
  totalPresupuestado: number = 0;
  totalGeneralAcumulado: number = 0;

  constructor(private ingresosService: IngresosService) {}

  ngOnInit(): void {
    this.ingresosService.listaIngresos$.subscribe(lista => {
      this.listaPresupuesto = lista;
      this.calcularTotales();
    });

    this.ingresosService.ingresoFijo$.subscribe(monto => {
      this.ingresoFijoGuardado = monto;
    });
  }

  guardarIngresoFijo(): void {
    if (!this.montoFijoInput || this.montoFijoInput <= 0) return;
    
    const nuevoRegistro = {
      categoria: 'Salario Fijo',
      monto: this.montoFijoInput,
      frecuencia: this.frecuenciaFijoInput,
      fecha: new Date().toLocaleDateString()
    };

    // Guardamos en la lista y actualizamos el ingreso fijo global usando la variable correcta
    this.ingresosService.agregarIngreso(nuevoRegistro);
    this.ingresosService.guardarIngresoFijo(this.montoFijoInput);
    
    this.montoFijoInput = null;
  }

  guardarIngresoExtra(): void {
    if (!this.conceptoExtraInput || !this.montoExtraInput) return;
    const nuevoRegistro = {
      categoria: this.conceptoExtraInput,
      monto: this.montoExtraInput,
      frecuencia: 'Único',
      fecha: this.fechaExtraInput || new Date().toLocaleDateString()
    };
    this.ingresosService.agregarIngreso(nuevoRegistro);
    
    this.conceptoExtraInput = '';
    this.montoExtraInput = null;
    this.fechaExtraInput = '';
  }

  calcularTotales() {
    this.totalPresupuestado = this.listaPresupuesto.reduce((acc, curr) => acc + Number(curr.monto), 0);
    this.totalGeneralAcumulado = this.totalPresupuestado;
  }
}