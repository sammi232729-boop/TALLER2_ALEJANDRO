import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  services = [
    {
      title: 'Computadores y Portátiles',
      description: 'Encuentra equipos para estudiar, trabajar o disfrutar de tus juegos favoritos.',
      tags: ['Portátiles', 'PC Gamer', 'Workstations', 'Todo en Uno']
    },
    {
      title: 'Periféricos y Accesorios',
      description: 'Mejora tu espacio con accesorios que combinan comodidad y rendimiento.',
      tags: ['Teclados mecánicos', 'Mouse gamer', 'Monitores', 'Diademas']
    },
    {
      title: 'Componentes y Taller',
      description: 'Encuentra las piezas que necesitas y recibe soporte para tu computador.',
      tags: ['Tarjetas gráficas', 'Memorias RAM', 'Discos SSD', 'Mantenimiento']
    }
  ];
}