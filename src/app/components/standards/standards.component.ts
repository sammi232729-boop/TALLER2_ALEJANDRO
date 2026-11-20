
import { Component } from '@angular/core';

@Component({
  selector: 'app-standards',
  standalone: true,
  imports: [],
  templateUrl: './standards.component.html',
  styleUrl: './standards.component.css'
})
export class StandardsComponent {

  standards = [
    {
      number: '01',
      title: 'Equipos originales',
      description: 'Todos nuestros equipos son nuevos, sellados y cuentan con garantía real.'
    },
    {
      number: '02',
      title: 'Armado a medida',
      description: 'Te ayudamos a elegir componentes compatibles según tus necesidades y presupuesto.'
    },
    {
      number: '03',
      title: 'Soporte técnico',
      description: 'Realizamos limpieza, cambio de pasta térmica y mantenimiento preventivo.'
    },
    {
      number: '04',
      title: 'Envíos seguros',
      description: 'Realizamos despachos rápidos y protegidos a cualquier ciudad de Colombia.'
    }
  ];

}
