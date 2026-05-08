import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface Message {
  id?: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  itemId: number;
  itemName: string;
  messageText: string;
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messagesKey = 'marketplace_messages';
  private messagesSubject = new Subject<Message[]>();

  constructor() {
    // Initialize messages from localStorage
    this.loadMessages();
  }

  private loadMessages(): void {
    const stored = localStorage.getItem(this.messagesKey);
    if (stored) {
      try {
        const messages = JSON.parse(stored);
        this.messagesSubject.next(messages);
      } catch (e) {
        console.error('[v0] Error loading messages:', e);
        localStorage.setItem(this.messagesKey, JSON.stringify([]));
      }
    } else {
      localStorage.setItem(this.messagesKey, JSON.stringify([]));
    }
  }

  private getAllMessages(): Message[] {
    const stored = localStorage.getItem(this.messagesKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveMessages(messages: Message[]): void {
    localStorage.setItem(this.messagesKey, JSON.stringify(messages));
    this.messagesSubject.next(messages);
  }

  // Send a message from buyer to seller
  async sendMessage(
    buyerId: string,
    buyerName: string,
    sellerId: string,
    sellerName: string,
    itemId: number,
    itemName: string,
    messageText: string
  ): Promise<void> {
    try {
      console.log('[v0] Sending message from', buyerName, 'to', sellerName);
      
      const messages = this.getAllMessages();
      const newMessage: Message = {
        id: Date.now().toString(),
        buyerId,
        buyerName,
        sellerId,
        sellerName,
        itemId,
        itemName,
        messageText,
        timestamp: new Date(),
        read: false
      };

      messages.push(newMessage);
      this.saveMessages(messages);
      console.log('[v0] Message saved successfully');
    } catch (error) {
      console.error('[v0] Error sending message:', error);
      throw error;
    }
  }

  // Get all messages for a seller (received messages)
  async getSellerMessages(sellerId: string): Promise<Message[]> {
    try {
      const messages = this.getAllMessages();
      return messages
        .filter(m => m.sellerId === sellerId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('[v0] Error fetching seller messages:', error);
      throw error;
    }
  }

  // Get all messages sent by a buyer
  async getBuyerMessages(buyerId: string): Promise<Message[]> {
    try {
      const messages = this.getAllMessages();
      return messages
        .filter(m => m.buyerId === buyerId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('[v0] Error fetching buyer messages:', error);
      throw error;
    }
  }

  // Listen to real-time messages for a seller
  listenToSellerMessages(sellerId: string): Observable<Message[]> {
    const messages = this.getAllMessages()
      .filter(m => m.sellerId === sellerId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    this.messagesSubject.next(messages);
    return this.messagesSubject.asObservable();
  }
}

