import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Note {
  id?: number;
  title: string;
  content: string;
  user_id: number;
  selected?: boolean;
  images?: Array<{ url: string }>;
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private apiUrl = `${environment.apiUrl}/notes`;

  constructor(private http: HttpClient) {}

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  getNote(id: number): Observable<Note> {
    console.log('Requesting note:', id);
    return this.http.get<Note>(`${environment.apiUrl}/notes/${id}`);
  }

  addNote(note: Partial<Note>): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note);
  }

  updateNote(note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${note.id}`, note);
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteNotes(ids: number[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ids.join(',')}`);
  }

  uploadImage(noteId: number, imageData: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/notes/${noteId}/images`, { image: imageData });
  }

  createNote(title: string): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, { title });
  }
}
