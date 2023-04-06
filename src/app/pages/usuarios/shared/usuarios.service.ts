import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AlunosInterface } from './alunos.model';
import { StorageService } from 'src/app/shared/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(
    private firestore: Firestore,
    private storageService: StorageService
  ) {}

  getAlunos(): Observable<AlunosInterface[]> {
    const usuarios = collection(this.firestore, 'usuarios');
    return collectionData(usuarios, { idField: 'id' }) as Observable<
      AlunosInterface[]
    >;
  }

  postAlunos(aluno: AlunosInterface): Promise<any>{
    const usuarios = collection(this.firestore, 'usuarios');
    return addDoc(usuarios, aluno);
  }

  getPictures(userId: string): Promise<any> {
    return this.storageService.getImage('usuarios', userId, userId);
  }
}
