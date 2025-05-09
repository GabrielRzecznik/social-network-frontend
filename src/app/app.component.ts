import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthSessionService } from './core/services/auth-session.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'social-network-frontend';

  constructor(private sessioService: AuthSessionService) {
    this.sessioService.initializeSession();
  }
}
