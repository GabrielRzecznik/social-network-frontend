import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthSessionService } from './core/services/auth-session.service';
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent
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
