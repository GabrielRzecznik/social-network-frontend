import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { AuthSessionService } from '../../core/services/auth-session.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  public userAvatarUrl = 'https://jornada.us-sea-1.linodeobjects.com/imagenes/2024/6/24/372280_1_102812_raw.jpg';
  public showNavbar = false;
  private routerSub!: Subscription;

  constructor(
    private sessionService: AuthSessionService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showNavbar = !['/login', '/register'].includes(event.urlAfterRedirects);
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

  public navChats(){
      this.router.navigate(['/chats']);
  }

  public navHome(){
      this.router.navigate(['/home']);
  }

  public navNotifications(){
      this.router.navigate(['/notifications']);
  }

  public navProfile(){
      this.router.navigate(['/profile']);
  }

  public navLogout(){
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }
}
