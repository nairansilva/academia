import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage, ref, uploadBytes, listAll, ListResult, deleteObject } from "@angular/fire/storage";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class StorageService {
  protected http: HttpClient;

  constructor(private storage: Storage) { }

  uploadAvatar(storageName:string, imgFile: any, idImg: string) {
    const imgRef = ref(this.storage, `${storageName}/${idImg}/${idImg}`)

    return uploadBytes(imgRef, imgFile)
  }

  getImage(storageName:string, id:string, imgName: string): Promise<ListResult> {
    const imgRef = ref(this.storage, `/${storageName}/${id}`)

    return listAll(imgRef)
  }

  deleteAvatar(storageName:string, idImg: string) {
    const imgRef = ref(this.storage, `${storageName}/${idImg}/${idImg}`)

    return deleteObject(imgRef)
  }

}
