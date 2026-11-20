import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  testimonials = [
    {
      name: 'Laura Martínez',
      role: 'Estudiante universitaria',
      comment: 'Compré mi portátil para la universidad y me ayudaron a elegir uno que se ajustara a mi presupuesto. Hasta ahora ha funcionado excelente.'
    },
    {
      name: 'Andrés Gómez',
      role: 'Jugador de PC',
      comment: 'Me asesoraron para armar mi PC gamer. Me gustó que explicaran cada componente y buscaran opciones con buena relación calidad-precio.'
    },
    {
      name: 'Camilo Rodríguez',
      role: 'Cliente de soporte técnico',
      comment: 'Llevé mi computador porque se calentaba demasiado. El mantenimiento quedó muy bien y me explicaron qué problema tenía.'
    }
  ];
}