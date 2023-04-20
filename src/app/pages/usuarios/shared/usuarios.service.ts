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

  private dbName = 'usuarios';

  getAlunos(
    filtro = '',
    page = 1,
    teste: string = ''
  ): Observable<AlunosInterface[]> {
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
      AlunosInterface[]
    >;
  }

  getByEmail(filtro = ''): Observable<AlunosInterface[]> {
    const usuarios = collection(this.firestore, this.dbName);
    const pageSize = 10;
    let organizationsQuery: any;

    organizationsQuery = query(
      usuarios,
      where('email', '==', filtro),
    );
    return collectionData(organizationsQuery, { idField: 'id' }) as Observable<
      AlunosInterface[]
    >;
  }

  getById(id: string): Promise<any> {
    const usuarios = collection(this.firestore, this.dbName);
    const placeRef = doc(this.firestore, this.dbName, id);
    return getDoc(placeRef);
  }

  postAluno(aluno: AlunosInterface): Promise<any> {
    // [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10].forEach(async (element,index) => {
    //   const usuarios = collection(this.firestore, 'usuarios');
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
    //   await addDoc(usuarios, aluno);
    // });
    const usuarios = collection(this.firestore, this.dbName);
    return addDoc(usuarios, aluno);
  }

  getPictures(userId: string): Promise<any> {
    return this.storageService.getImages(this.dbName, userId);
  }

  putAluno(objectInput: { [x: string]: any }, id: string) {
    const placeRef = doc(this.firestore, `${this.dbName}/${id}`);
    return updateDoc(placeRef, objectInput);
  }

  deleteAluno(id: string) {
    const placeRef = doc(this.firestore, `${this.dbName}/${id}`);
    return deleteDoc(placeRef);
  }
}
