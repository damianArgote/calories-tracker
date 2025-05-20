import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, DocumentReference, Firestore, getDocs, updateDoc } from '@angular/fire/firestore';
import { from, map, mergeMap, Observable, take, toArray } from 'rxjs';
import { Activity } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private collectionName = 'activities';

  constructor(private firestore: Firestore) { }

  getActivities(): Observable<Activity[]> {
    const activitiesRef = collection(this.firestore, this.collectionName);
    return collectionData(activitiesRef, { idField: 'id' }) as Observable<Activity[]>;
  }

  getActivityById(id: string): Observable<Activity> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(docRef, { idField: 'id' }).pipe(
      take(1),
      map((data) => {
        if (!data) throw new Error('Actividad no encontrada');
        return data as Activity;
      })
    );
  }

  addActivity(activity: Activity): Observable<Activity> {
    const activitiesRef = collection(this.firestore, this.collectionName);
    return from(addDoc(activitiesRef, activity)).pipe(
      map((docRef: DocumentReference) => ({
        ...activity,
        id: docRef.id
      }))
    );
  }

  updateActivity(id: string, activity: Partial<Activity>): Observable<void> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return from(updateDoc(docRef, activity));
  }

  deleteActivity(id: string): Observable<void> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return from(deleteDoc(docRef));
  }

  deleteAllActivities(): Observable<void> {
    const activitiesRef = collection(this.firestore, this.collectionName);

    return from(getDocs(activitiesRef)).pipe(
      mergeMap(snapshot => from(snapshot.docs)), // convierte cada doc en un stream individual
      mergeMap(doc => from(deleteDoc(doc.ref))), // borra cada doc
      toArray(), // espera a que todos terminen
      map(() => void 0) // convierte el resultado a void
    );
  }
}
