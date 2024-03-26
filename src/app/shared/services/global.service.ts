import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private userUpdateMessageSource = new BehaviorSubject("");
  userUpdateInfo = this.userUpdateMessageSource.asObservable();

  constructor() { }

  sendUserInfoToUpdate(message: string) {
    this.userUpdateMessageSource.next(message);
  } 
}
