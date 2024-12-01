import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userEmail: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userEmail = user.email;
    }
  }

  async changePassword() {
    const alert = await this.alertController.create({
      header: 'Alterar Senha',
      inputs: [
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'Nova senha'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Alterar',
          handler: async (data) => {
            try {
              await this.authService.updatePassword(data.newPassword).toPromise();
              this.showSuccess('Senha atualizada com sucesso');
            } catch (error) {
              this.showError('Erro ao atualizar senha');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private async showSuccess(message: string) {
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showError(message: string) {
    const alert = await this.alertController.create({
      header: 'Erro',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
