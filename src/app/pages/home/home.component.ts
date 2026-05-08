import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ListingService, ListingItem } from '../../services/listing.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchQuery = '';
  
  categories = [
    { name: 'Electronics', icon: '💻', color: 'blue' },
    { name: 'Furniture', icon: '🛋️', color: 'green' },
    { name: 'Books', icon: '📖', color: 'purple' },
    { name: 'Clothing', icon: '👕', color: 'orange' }
  ];

  filteredListings: ListingItem[] = [];

  steps = [
    {
      title: '1. List',
      text: 'List your items with photos and details.',
      icon: '✎'
    },
    {
      title: '2. Browse',
      text: 'Browse listings and find great deals.',
      icon: '⌕'
    },
    {
      title: '3. Connect',
      text: 'Message buyers or sellers and make a deal.',
      icon: '▢'
    }
  ];

  constructor(
    private router: Router,
    private listingService: ListingService
  ) {}

  ngOnInit(): void {
    this.listingService.refreshListings();
    this.filteredListings = this.listingService.listings;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.filteredListings = this.listingService.searchListings(this.searchQuery);
    } else {
      this.filteredListings = this.listingService.listings;
    }
  }

  onCategoryClick(category: { name: string; icon: string; color: string }): void {
    this.searchQuery = category.name;
    this.filteredListings = this.listingService.getByCategory(category.name);
  }

  viewItem(item: ListingItem): void {
    this.router.navigate(['/item', item.id]);
  }

  clearFilter(): void {
    this.searchQuery = '';
    this.filteredListings = this.listingService.listings;
  }
}
