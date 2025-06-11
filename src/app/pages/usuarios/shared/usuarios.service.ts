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
    QueryDocumentSnapshot,
    QueryConstraint,
    getDocs,
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

    getAlunos(filtro = '', startAfterDoc: any = null): Observable<AlunosInterface[]> {
      const usuariosRef = collection(this.firestore, this.dbName);
      const constraints: QueryConstraint[] = [];

      if (filtro) {
        constraints.push(
          orderBy('nome'),
          where('nome', '>=', filtro),
          where('nome', '<=', filtro + '\uf8ff'),
          limit(10)
        );
      } else {
        constraints.push(orderBy('nome'), limit(10));
      }

      if (startAfterDoc) {
        constraints.push(startAfter(startAfterDoc));
      }

      const q = query(usuariosRef, ...constraints);

      return new Observable((observer) => {
        getDocs(q).then(snapshot => {
          const result = snapshot.docs.map(doc => {
            const data = doc.data() as AlunosInterface;
            return { ...data, id: doc.id, __snapshot: doc };
          });
          observer.next(result);
          observer.complete();
        }).catch(error => observer.error(error));
      });
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
