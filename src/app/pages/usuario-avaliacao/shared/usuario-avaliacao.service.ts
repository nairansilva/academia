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
  getDoc,
  where,
  limit,
  orderBy,
  startAfter,
  endAt,
  query,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { UsuarioAvaliacaoInterface } from './usuario-avaliacao.model';
@Injectable({
  providedIn: 'root'
})
export class UsuarioAvaliacaoService {

  constructor(
    private firestore: Firestore,
    private storageService: StorageService
  ) {}

  private dbName = 'usuariosavalicao';

  getUsuarioAvaliacao(
    filtro = '',
    page = 1,
    teste: string = ''
  ): Observable<UsuarioAvaliacaoInterface[]> {
    const usuarios = collection(this.firestore, this.dbName);
    const pageSize = 10;
    let organizationsQuery: any;

    if (teste.length > 0) {
      organizationsQuery = query(
        usuarios,
        where('nome', '>=', filtro),
        limit(pageSize),
        orderBy('nome', 'asc'),
        startAfter(teste)
      );
    } else {
      organizationsQuery = query(
        usuarios,
        where('nome', '>=', filtro),
        limit(pageSize),
        orderBy('nome', 'asc')
      );
    }
    // this.firestore.colle
    return collectionData(organizationsQuery, { idField: 'id' }) as Observable<
    UsuarioAvaliacaoInterface[]
    >;
  }

  getByIdUsuario(filtro = ''): Observable<UsuarioAvaliacaoInterface[]> {
    const usuarios = collection(this.firestore, this.dbName);
    const pageSize = 10;
    let organizationsQuery: any;

    organizationsQuery = query(
      usuarios,
      where('idUsuario', '==', filtro),
    );
    return collectionData(organizationsQuery, { idField: 'id' }) as Observable<
    UsuarioAvaliacaoInterface[]
    >;
  }

  getById(id: string): Promise<any> {
    const usuarios = collection(this.firestore, this.dbName);
    const placeRef = doc(this.firestore, this.dbName, id);
    return getDoc(placeRef);
  }

  postUsuarioAvaliacao(aluno: UsuarioAvaliacaoInterface): Promise<any> {
    const usuarios = collection(this.firestore, this.dbName);
    return addDoc(usuarios, aluno);
  }

  putUsuarioAvaliacoa(objectInput: { [x: string]: any }, id: string) {
    const placeRef = doc(this.firestore, `${this.dbName}/${id}`);
    return updateDoc(placeRef, objectInput);
  }

  deleteUsuarioAvalicao(id: string) {
    const placeRef = doc(this.firestore, `${this.dbName}/${id}`);
    return deleteDoc(placeRef);
  }
}
