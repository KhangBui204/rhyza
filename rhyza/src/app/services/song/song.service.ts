import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SongModel } from '../../models/song.model';
import { BehaviorSubject } from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  constructor(private http: HttpClient) {}

  getSongDetail(songId: string) {
    return this.http.get<SongModel>(
      `${environment.apiUrl}songs/${songId}/hls-url`,
    );
  }

  getSongList() {
    return this.http.get<SongModel[]>(`${environment.apiUrl}songs/all`);
  }

  createSong(song: SongModel, idToken: string) {
    //with header Authorization
    const headers = {
      Authorization: idToken,
    };

    console.log('song services create song', song);
    const formData = new FormData();
    formData.append('title', song.title);
    formData.append('composer', song.composer);
    formData.append('performer_ref', '1873450c-b348-4f4e-8586-a070220e6878');
    formData.append('files', song.file_path);
    formData.append('files', song.image_url);
    formData.append('uuid', song.uuid);
    formData.append('views', song.views.toString());
    formData.append('category_id', '01f44bca-93da-4b41-8cec-d70707a6d878');
    return this.http.post<SongModel>('http://localhost:3000/songs', formData, {
      headers,
    });
  }

  updateSongViews(songId: string) {
    return this.http.put(
      `http://localhost:3000/songs/update-views?id=${songId}`,
      {},
    );
  }

  getSongQueue(uid: string, idToken: string) {
    const headers = {
      Authorization: idToken,
    };
    return this.http.get<SongModel[]>(
      `http://localhost:3000/queue/get-song-queues-user?uid=${uid}`,
      { headers },
    );
  }

  getSongCategoryId(categoryId: string){
    return this.http.get<SongModel[]>(`${environment.apiUrl}songs/category-song?id=${categoryId}`);

  }

  private currentSongSubject = new BehaviorSubject<SongModel | null>(null);
  currentSong$ = this.currentSongSubject.asObservable();

  setCurrentSong(song: SongModel) {
    this.currentSongSubject.next(song);
  }

}
