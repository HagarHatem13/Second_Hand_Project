import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Contact {
  id: number;
  name: string;
  message: string;
  time: string;
  active: boolean;
}

interface Message {
  text: string;
  time: string;
  type: 'sent' | 'received';
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent {
  newMessage = '';
  searchText = '';

  contacts: Contact[] = [
    {
      id: 1,
      name: 'Sara Mohamed',
      message: "Yes, it's still available.",
      time: '10:24 AM',
      active: true,
    },
    {
      id: 2,
      name: 'Omar Ali',
      message: 'Can you lower the price?',
      time: 'Yesterday',
      active: false,
    },
    {
      id: 3,
      name: 'Mona Hassan',
      message: 'When can we meet?',
      time: 'Yesterday',
      active: false,
    },
    {
      id: 4,
      name: 'Youssef Adel',
      message: "Thanks! I'll take it.",
      time: 'May 4',
      active: false,
    },
  ];

  messages: Message[] = [
    {
      text: 'Hi! Is the laptop still available?',
      time: '10:20 AM',
      type: 'received',
    },
    {
      text: "Hi Sara! Yes, it's still available.",
      time: '10:21 AM',
      type: 'sent',
    },
    {
      text: 'Great! Can you tell me more about its condition?',
      time: '10:22 AM',
      type: 'received',
    },
    {
      text: "Sure, it's in very good condition. No scratches and works perfectly.",
      time: '10:23 AM',
      type: 'sent',
    },
    {
      text: 'That sounds good. Where can we meet?',
      time: '10:24 AM',
      type: 'received',
    },
    {
      text: 'We can meet at City Stars Mall. Does 5 PM work for you?',
      time: '10:25 AM',
      type: 'sent',
    },
  ];

  activeContact = this.contacts[0];

  selectContact(contact: Contact): void {
    this.contacts.forEach(c => c.active = false);
    contact.active = true;
    this.activeContact = contact;
  }

  sendMessage(): void {
    if (this.newMessage.trim() === '') return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    this.messages.push({
      text: this.newMessage,
      time: timeStr,
      type: 'sent',
    });

    this.newMessage = '';
  }

  get filteredContacts(): Contact[] {
    return this.contacts.filter(c => 
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
