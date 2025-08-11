import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FullDateTime'
})
export class FullDateTime implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const dateValue = new Date(value);
    if (isNaN(dateValue.getTime())) return '';

    const now = new Date();
    const diffMs = now.getTime() - dateValue.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // - 24 hours → show "X hours/minutes ago"
    if (diffHours < 24) {
      if (diffHours < 1) {
        const diffMinutes = diffMs / (1000 * 60);
        if (diffMinutes < 1) {
          const secondsAgo = Math.floor(diffMs / 1000);
          return `Hace ${secondsAgo} segundo${secondsAgo !== 1 ? 's' : ''}`;
        } else {
          const minutesAgo = Math.floor(diffMinutes);
          return `Hace ${minutesAgo} minuto${minutesAgo !== 1 ? 's' : ''}`;
        }
      } else {
        const hoursAgo = Math.floor(diffHours);
        return `Hace ${hoursAgo} hora${hoursAgo !== 1 ? 's' : ''}`;
      }
    }

    // + 24 hours → show "3 de agosto del 2025"
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const day = dateValue.getDate();
    const month = months[dateValue.getMonth()];
    const year = dateValue.getFullYear();

    return `${day} de ${month} de ${year}`;
  }
}
