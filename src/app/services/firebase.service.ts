import { Injectable } from '@angular/core';

import {
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

import { auth, db } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  async addListing(listingData: any) {
    console.log('1 - Firebase service started');
    console.log('2 - Listing data:', listingData);
    console.log('3 - Database object:', db);

    const currentUser = auth.currentUser;

    const dataToSave = {
      title: listingData.title,
      description: listingData.description,
      category: listingData.category,
      price: Number(listingData.price),
      location: listingData.location,
      imageUrl: listingData.photoUrl || '',
      sellerContact: listingData.sellerContact,
      sellerId: currentUser ? currentUser.uid : 'guest',
      sellerName: currentUser ? currentUser.email : 'Guest Seller',
      status: 'available',
      createdAt: serverTimestamp()
    };

    console.log('4 - Data to save:', dataToSave);

    const docRef = await addDoc(collection(db, 'listings'), dataToSave);

    console.log('5 - Saved successfully with ID:', docRef.id);

    return docRef;
  }
}