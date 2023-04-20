import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage, ref, uploadBytes, listAll, ListResult, deleteObject, uploadString } from "@angular/fire/storage";
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

  uploadPicture(storageName:string, imgFile: any, idImg: string, imgName:string) {
    const imgRef = ref(this.storage, `${storageName}/${idImg}/${imgName}`)

    // uploadString
    return uploadString(imgRef, imgFile, 'data_url')
  }

  getImageId(storageName:string, id:string, imgName: string): Promise<ListResult> {
    const imgRef = ref(this.storage, `/${storageName}/${id}`)

    return listAll(imgRef)
  }

  getImages(storageName:string, idAvaliacao:string): Promise<ListResult> {
    const imgRef = ref(this.storage, `/${storageName}/${idAvaliacao}`)

    return listAll(imgRef)
  }

  deleteAvatar(storageName:string, idImg: string) {
    const imgRef = ref(this.storage, `${storageName}/${idImg}/${idImg}`)

    return deleteObject(imgRef)
  }

  deletePicture(storageName:string, idImg: string, imgName:string) {
    const imgRef = ref(this.storage, `${storageName}/${idImg}/${imgName}`)

    return deleteObject(imgRef)
  }

}
