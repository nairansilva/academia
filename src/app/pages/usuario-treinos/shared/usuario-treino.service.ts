import { UsuarioTreinoInterface } from './usuario-treinos.model';
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

@Injectable({
  providedIn: 'root',
})
export class UsuarioTreinosService {
  constructor(
    private firestore: Firestore,
    private storageService: StorageService
  ) {}

  private dbName = 'usuario-treinos'

  getAlunoTreinos(filtro = '', page = 1, teste:string = ''): Observable<UsuarioTreinoInterface[]> {
    const usuarioTreinos = collection(this.firestore, this.dbName);
    const pageSize = 10;
    let organizationsQuery:any;

      organizationsQuery = query(
        usuarioTreinos,
        where('idUsuario',"==",filtro),
        limit(pageSize),
      );
    // this.firestore.colle
    return collectionData(organizationsQuery, { idField: 'id' }) as Observable<
    UsuarioTreinoInterface[]
    >;
  }

  getById(id: string): Promise<any> {
    const usuarioTreinos = collection(this.firestore, this.dbName);
    const placeRef = doc(this.firestore, this.dbName, id);
    return getDoc(placeRef);
  }

  postAlunoTreinos(aluno: UsuarioTreinoInterface): Promise<any> {
    // [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10].forEach(async (element,index) => {
    //   const usuarioTreinos = collection(this.firestore, 'usuarioTreinos');
    //   aluno= {
    //     id:'',
    //     nome: 'nairan'+index,
    //     password:'123456',
    //     email: 'teste@teste.com',
    //     telefone: 11,
    //     idade:11,
    //     objetivos:'string',
    //     perfil:1
    //   }
    //   await addDoc(usuarioTreinos, aluno);
    // });
    const usuarioTreinos = collection(this.firestore, this.dbName);
    return addDoc(usuarioTreinos, aluno);
  }

  getPictures(userId: string): Promise<any> {
    return this.storageService.getImages(this.dbName, userId);
  }

  putAlunoTreinos(objectInput: { [x: string]: any }, id: string) {
    const placeRef = doc(this.firestore, `${this.dbName}/${id}`);
    return updateDoc(placeRef, objectInput);
  }

  deleteAlunoTreinos(id: string) {
    const placeRef = doc(this.firestore, `${this.dbName}/${id}`);
    return deleteDoc(placeRef);
  }
}
