import { NavigationStart, Router } from '@angular/router';
import { LoginService } from 'src/app/core/login/shared/login.service';
import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AutocloseOverlaysService } from './shared/services/autoclose-overlay.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(private loginService: LoginService, private router: Router, private autocloseOverlaysService:AutocloseOverlaysService) {

    this.loginService.user$.subscribe({
      next: (res) => {
        if (this.loginService.isUserAdmin) {
          this.router.navigate(['admin']);
        } else {
          this.router.navigate(['user']);
        }
      },
    });
  }
}
