import { Component, OnInit } from '@angular/core';
import { NotesService, Note } from '../../services/notes.service';
import { AuthService } from '../../services/auth.service';
import { AlertController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ItemReorderEventDetail } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage {
  notes: Note[] = [];
  isDeleteMode = false;
  userEmail: string = '';

  constructor(
    private notesService: NotesService,
    private authService: AuthService,
    private alertController: AlertController,
    private menuController: MenuController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadNotes();
    this.loadUserEmail();
  }

  loadUserEmail() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userEmail = user.email;
    }
  }
  
  ionViewWillEnter() {
    this.loadNotes();
  }
  
  loadNotes() {
    this.notesService.getNotes().subscribe(notes => {
      this.notes = notes;
      console.log('Notes loaded:', notes);
    });
  }
  

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    const itemMove = this.notes.splice(ev.detail.from, 1)[0];
    this.notes.splice(ev.detail.to, 0, itemMove);
    ev.detail.complete();
  }

  openNote(noteId: number | undefined) {
    if (!this.isDeleteMode && noteId) {
      this.router.navigate(['/note-detail', noteId]);
    }
  }

  toggleDeleteMode() {
    this.isDeleteMode = !this.isDeleteMode;
    if (!this.isDeleteMode) {
      this.notes.forEach(note => note.selected = false);
    }
  }

  /* async addNote() {
    const alert = await this.alertController.create({
      header: 'Nova Nota',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salvar',
          handler: (data) => {
            if (this.notes.some(note => note.title === data.title)) {
              this.presentDuplicateAlert();
              return false; 
            }
            
            this.notesService.addNote(data).subscribe(
              (newNote) => {
                this.notes.unshift(newNote);
              }
            );
            return true; 
          }
        }
      ]
    });
    await alert.present();
  } */

async addNote() {
  const alert = await this.alertController.create({
    cssClass: 'custom-alert',
    header: 'Nova Nota',
    inputs: [
      {
        name: 'title',
        type: 'text',
        placeholder: 'Título da nota',
        cssClass: 'custom-input'
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary-button'
      },
      {
        text: 'Criar',
        cssClass: 'primary-button',
        handler: (data) => {
          if (data.title) {
            this.notesService.createNote(data.title).subscribe(() => {
              this.loadNotes();
            });
          }
        }
      }
    ]
  });

  await alert.present();
}

  async presentDuplicateAlert() {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Já existe uma nota com este nome.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async deleteSelectedNotes() {
    const selectedIds = this.notes
      .filter(note => note.selected && note.id)
      .map(note => note.id as number);
  
    if (selectedIds.length > 0) {
      const alert = await this.alertController.create({
        header: 'Confirmar Exclusão',
        message: 'Deseja excluir as notas selecionadas?',
        buttons: [
          {
            text: 'Não',
            role: 'cancel'
          },
          {
            text: 'Sim',
            handler: () => {
              this.notesService.deleteNotes(selectedIds).subscribe(() => {
                this.loadNotes();
                this.isDeleteMode = false;
              });
            }
          }
        ]
      });
      await alert.present();
    }
  }
  

  openProfile() {
    this.menuController.open('start');
  }

  async changePassword() {
    const alert = await this.alertController.create({
      header: 'Trocar Senha',
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'currentPassword',
          type: 'password',
          placeholder: 'Senha Atual',
          cssClass: 'custom-input'
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'Nova Senha',
          cssClass: 'custom-input'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button'
        },
        {
          text: 'Confirmar',
          cssClass: 'confirm-button',
          handler: (data) => { {
            this.authService.verifyAndUpdatePassword(data.currentPassword, data.newPassword).subscribe({
              next: () => {
                this.showSuccessAlert('Senha atualizada com sucesso');
              },
              error: (error: Error) => {
                this.showErrorAlert('Senha atual incorreta');
              }
            });
          }
        } 
      }
    ]
    });
    await alert.present();
  }

  async showSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Erro',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}