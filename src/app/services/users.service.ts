import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, updateDoc, docData, collection, query, collectionData } from '@angular/fire/firestore';
import { ProfileUser } from '../models/user-profile';
import { Observable, from, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  get currentUserProfile$(): Observable<ProfileUser | null>{
    return this.authService.currentUser$.pipe(
      switchMap(user =>{
        if (!user?.uid){
          return of(null)
        }

        const ref = doc(this.firestore, 'users', user?.uid)
        return docData(ref) as Observable<ProfileUser>
      })
    )
  }

  get allUsers$(): Observable<ProfileUser[]>{
    const ref = collection(this.firestore, 'users');
    const queryAll = query(ref);

    return collectionData(queryAll) as Observable<ProfileUser[]>
  }

  constructor(private firestore: Firestore, private authService: AuthenticationService) { }

  addUser(user: ProfileUser): Observable<any>{
    const ref = doc(this.firestore, 'users', user?.uid)

    return from(setDoc(ref, user))
  }

  updadteUser(user: ProfileUser): Observable<any>{
    const ref = doc(this.firestore, 'users', user?.uid)

    return from(updateDoc(ref, {...user}))
  }
}
