import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { NotesService, Note } from '../../services/notes.service';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.page.html',
  styleUrls: ['./note-detail.page.scss'],
})
export class NoteDetailPage implements OnInit {
  note: Note = {
    id: 0,
    title: '',
    content: '',
    user_id: 1,
    images: []
  };
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notesService: NotesService,
    private menuController: MenuController,
  ) {}

  ngOnInit() {
    this.loadNoteData();
  }

  ionViewWillEnter() {
    this.loadNoteData();
  }

  loadNoteData() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      console.log('Loading note ID:', id);
      this.notesService.getNote(parseInt(id)).subscribe(
        (note) => {
          console.log('Note loaded:', note);
          this.note = note;
        }
      );
    }
  }

  deleteNote(): void {
    if (this.note && this.note.id) {
      this.notesService.deleteNote(this.note.id).subscribe(() => {
        this.router.navigate(['/home']);
      });
    }
  }
  
  openProfile() {
    this.menuController.open('start');
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.saveChanges();
    }
  }
  
  saveChanges() {
    this.notesService.updateNote(this.note).subscribe(() => {
      this.isEditing = false;
    });
  }
}
