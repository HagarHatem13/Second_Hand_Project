import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Listing {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  condition: string;
}

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent {

  // ======================
  // FILTER STATE
  // ======================
  searchText = '';
  selectedCategory = 'All Categories';
  minPrice = '';
  maxPrice = '';
  selectedConditions: string[] = ['All Conditions'];

  // ======================
  // PAGINATION STATE
  // ======================
  currentPage = 1;
  pageSize = 4;

  // ======================
  // DATA
  // ======================
  allListings: Listing[] = [
    { id: 1, name: 'Laptop', price: '$250', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', category: 'Electronics', condition: 'Good' },
    { id: 2, name: 'Sofa', price: '$150', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', category: 'Furniture', condition: 'Like New' },
    { id: 3, name: 'Camera', price: '$200', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600', category: 'Electronics', condition: 'Good' },
    { id: 4, name: 'Books', price: '$30', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600', category: 'Books', condition: 'Fair' },
    { id: 5, name: 'Bicycle', price: '$180', image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600', category: 'Sports', condition: 'Used' },
    { id: 6, name: 'Headphones', price: '$120', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', category: 'Electronics', condition: 'Like New' },
    { id: 7, name: 'Jacket', price: '$25', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', category: 'Clothing', condition: 'Good' },
    { id: 8, name: 'Phone', price: '$260', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600', category: 'Electronics', condition: 'Like New' },
  ];

  categories = ['All Categories', 'Electronics', 'Furniture', 'Books', 'Clothing', 'Sports'];
  conditions = ['All Conditions', 'Like New', 'Good', 'Fair', 'Used'];

  constructor(private router: Router) {}

  // ======================
  // FILTERED DATA
  // ======================
  get filteredListings(): Listing[] {
    return this.allListings.filter(item => {

      const matchesSearch =
        item.name.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'All Categories' ||
        item.category === this.selectedCategory;

      const price = parseInt(item.price.replace('$', ''));

      const minOk =
        !this.minPrice || price >= parseInt(this.minPrice);

      const maxOk =
        !this.maxPrice || price <= parseInt(this.maxPrice);

      const matchesCondition =
        this.selectedConditions.includes('All Conditions') ||
        this.selectedConditions.includes(item.condition);

      return matchesSearch && matchesCategory && minOk && maxOk && matchesCondition;
    });
  }

  // ======================
  // PAGINATED DATA
  // ======================
  get paginatedListings(): Listing[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredListings.slice(start, start + this.pageSize);
  }

  // ======================
  // TOTAL PAGES
  // ======================
  get totalPages(): number[] {
    const count = Math.ceil(this.filteredListings.length / this.pageSize);
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  // ======================
  // CONDITION TOGGLE
  // ======================
  toggleCondition(condition: string): void {
    if (condition === 'All Conditions') {
      this.selectedConditions = ['All Conditions'];
    } else {
      this.selectedConditions = this.selectedConditions.filter(c => c !== 'All Conditions');

      if (this.selectedConditions.includes(condition)) {
        this.selectedConditions = this.selectedConditions.filter(c => c !== condition);
      } else {
        this.selectedConditions.push(condition);
      }

      if (this.selectedConditions.length === 0) {
        this.selectedConditions = ['All Conditions'];
      }
    }
    this.currentPage = 1;
  }

  isConditionSelected(condition: string): boolean {
    return this.selectedConditions.includes(condition);
  }

  // ======================
  // FILTER ACTION
  // ======================
  applyFilters(): void {
    this.currentPage = 1;
  }

  // ======================
  // GETTER FOR PAGINATION DISPLAY
  // ======================
  get pages(): number[] {
    return this.totalPages;
  }

  // ======================
  // NAVIGATION
  // ======================
  viewItem(item: Listing): void {
    this.router.navigate(['/item', item.id]);
  }

  goToPage(page: number): void {
    const maxPage = this.totalPages.length;
    if (page >= 1 && page <= maxPage) {
      this.currentPage = page;
    }
  }
}
