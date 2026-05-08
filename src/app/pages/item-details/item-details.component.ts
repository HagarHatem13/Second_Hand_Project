import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService, ListingItem } from '../../services/listing.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  item: ListingItem | null = null;
  isInWishlist = false;
  showMessageModal = false;
  messageText = '';
  messageSent = false;
  relatedItems: ListingItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listingService: ListingService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadItem(id);
    });
  }

  loadItem(id: number): void {
    const found = this.listingService.getItemById(id);
    this.item = found || this.listingService.listings[0];
    
    if (this.item) {
      this.relatedItems = this.listingService.listings
        .filter(item => item.id !== this.item?.id)
        .slice(0, 3);
      
      this.isInWishlist = this.listingService.isInWishlist(this.item.id);
    }
  }

  toggleWishlist(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.item) return;
    
    if (this.isInWishlist) {
      this.listingService.removeFromWishlist(this.item.id);
      this.isInWishlist = false;
    } else {
      this.listingService.addToWishlist(this.item.id);
      this.isInWishlist = true;
    }
  }

openMessageModal(): void {

  if (!this.authService.isAuthenticated()) {
    this.router.navigate(['/login']);
    return;
  }

  this.showMessageModal = true;
}

  closeMessageModal(): void {
    this.showMessageModal = false;
  }

  sendMessage(): void {
    if (!this.messageText.trim() || !this.item) {
      console.log('[v0] Empty message or no item');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('[v0] User not authenticated');
      alert('Please log in to send a message');
      return;
    }

    console.log('[v0] Sending message from:', currentUser.name, 'to:', this.item.seller);

    this.messageService.sendMessage(
      currentUser.id,
      currentUser.name,
      this.item.seller,
      this.item.seller,
      this.item.id,
      this.item.name,
      this.messageText
    ).then(() => {
      console.log('[v0] Message saved successfully');
      this.messageSent = true;
      this.messageText = '';

      setTimeout(() => {
        this.messageSent = false;
        this.closeMessageModal();
      }, 2000);
    }).catch(error => {
      console.error('[v0] Error sending message:', error);
      alert('Failed to send message. Please try again.');
    });
  }

  viewRelatedItem(item: ListingItem): void {
    this.router.navigate(['/item', item.id]);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  viewMyMessages(): void {
    this.router.navigate(['/seller-inbox']);
  }
}

