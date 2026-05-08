import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Stat {
  title: string;
  value: number;
  icon: string;
}

interface MonthData {
  name: string;
  views: number;
}

interface Listing {
  item: string;
  views: number;
  saves: number;
  status: 'Sold' | 'Active';
}

type SortKey = 'item' | 'views' | 'saves' | 'status';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent {
  // Month filter
  selectedMonth = signal<string>('This Month');
  isMonthDropdownOpen = signal<boolean>(false);
  months = ['This Month', 'Last Month', 'Last 3 Months', 'Last 6 Months', 'This Year'];

  // User menu
  isUserMenuOpen = signal<boolean>(false);

  // Table sorting
  sortKey = signal<SortKey>('views');
  sortDirection = signal<SortDirection>('desc');

  // Raw data by time period
  private dataByPeriod: Record<string, {
    stats: Stat[];
    chartMonths: MonthData[];
    listings: Listing[];
  }> = {
    'This Month': {
      stats: [
        { title: 'Total Listings', value: 6, icon: 'grid' },
        { title: 'Sold Items', value: 2, icon: 'bag' },
        { title: 'Wishlist Saves', value: 10, icon: 'heart' },
        { title: 'Messages', value: 24, icon: 'message' }
      ],
      chartMonths: [
        { name: 'Jan', views: 120 },
        { name: 'Feb', views: 175 },
        { name: 'Mar', views: 255 },
        { name: 'Apr', views: 315 },
        { name: 'May', views: 210 },
        { name: 'Jun', views: 160 }
      ],
      listings: [
        { item: 'Laptop', views: 320, saves: 8, status: 'Sold' },
        { item: 'Sofa', views: 210, saves: 5, status: 'Active' },
        { item: 'Camera', views: 180, saves: 4, status: 'Active' },
        { item: 'Books', views: 95, saves: 3, status: 'Sold' }
      ]
    },
    'Last Month': {
      stats: [
        { title: 'Total Listings', value: 5, icon: 'grid' },
        { title: 'Sold Items', value: 3, icon: 'bag' },
        { title: 'Wishlist Saves', value: 15, icon: 'heart' },
        { title: 'Messages', value: 18, icon: 'message' }
      ],
      chartMonths: [
        { name: 'Dec', views: 90 },
        { name: 'Jan', views: 145 },
        { name: 'Feb', views: 200 },
        { name: 'Mar', views: 280 },
        { name: 'Apr', views: 190 },
        { name: 'May', views: 130 }
      ],
      listings: [
        { item: 'Phone', views: 280, saves: 12, status: 'Sold' },
        { item: 'Desk', views: 190, saves: 6, status: 'Sold' },
        { item: 'Monitor', views: 150, saves: 3, status: 'Active' },
        { item: 'Chair', views: 120, saves: 5, status: 'Sold' }
      ]
    },
    'Last 3 Months': {
      stats: [
        { title: 'Total Listings', value: 12, icon: 'grid' },
        { title: 'Sold Items', value: 5, icon: 'bag' },
        { title: 'Wishlist Saves', value: 28, icon: 'heart' },
        { title: 'Messages', value: 52, icon: 'message' }
      ],
      chartMonths: [
        { name: 'Jan', views: 220 },
        { name: 'Feb', views: 285 },
        { name: 'Mar', views: 340 },
        { name: 'Apr', views: 410 },
        { name: 'May', views: 380 },
        { name: 'Jun', views: 290 }
      ],
      listings: [
        { item: 'Laptop', views: 520, saves: 15, status: 'Sold' },
        { item: 'Phone', views: 380, saves: 12, status: 'Sold' },
        { item: 'Sofa', views: 310, saves: 8, status: 'Active' },
        { item: 'Camera', views: 250, saves: 6, status: 'Active' },
        { item: 'Books', views: 180, saves: 4, status: 'Sold' }
      ]
    },
    'Last 6 Months': {
      stats: [
        { title: 'Total Listings', value: 18, icon: 'grid' },
        { title: 'Sold Items', value: 9, icon: 'bag' },
        { title: 'Wishlist Saves', value: 45, icon: 'heart' },
        { title: 'Messages', value: 89, icon: 'message' }
      ],
      chartMonths: [
        { name: 'Jan', views: 350 },
        { name: 'Feb', views: 420 },
        { name: 'Mar', views: 480 },
        { name: 'Apr', views: 520 },
        { name: 'May', views: 490 },
        { name: 'Jun', views: 410 }
      ],
      listings: [
        { item: 'Laptop', views: 720, saves: 22, status: 'Sold' },
        { item: 'Phone', views: 580, saves: 18, status: 'Sold' },
        { item: 'Sofa', views: 450, saves: 12, status: 'Sold' },
        { item: 'Camera', views: 380, saves: 9, status: 'Active' },
        { item: 'Monitor', views: 320, saves: 7, status: 'Active' },
        { item: 'Books', views: 220, saves: 5, status: 'Sold' }
      ]
    },
    'This Year': {
      stats: [
        { title: 'Total Listings', value: 32, icon: 'grid' },
        { title: 'Sold Items', value: 18, icon: 'bag' },
        { title: 'Wishlist Saves', value: 85, icon: 'heart' },
        { title: 'Messages', value: 156, icon: 'message' }
      ],
      chartMonths: [
        { name: 'Jan', views: 580 },
        { name: 'Feb', views: 620 },
        { name: 'Mar', views: 710 },
        { name: 'Apr', views: 780 },
        { name: 'May', views: 720 },
        { name: 'Jun', views: 650 }
      ],
      listings: [
        { item: 'Laptop', views: 1200, saves: 38, status: 'Sold' },
        { item: 'Phone', views: 950, saves: 28, status: 'Sold' },
        { item: 'Sofa', views: 780, saves: 22, status: 'Sold' },
        { item: 'Camera', views: 620, saves: 15, status: 'Sold' },
        { item: 'Monitor', views: 540, saves: 12, status: 'Active' },
        { item: 'Desk', views: 480, saves: 10, status: 'Sold' },
        { item: 'Books', views: 350, saves: 8, status: 'Sold' }
      ]
    }
  };

  // Computed data based on selected month
  stats = computed(() => this.dataByPeriod[this.selectedMonth()].stats);
  chartMonths = computed(() => this.dataByPeriod[this.selectedMonth()].chartMonths);
  
  // Computed max value for chart scaling
  maxChartValue = computed(() => {
    const values = this.chartMonths().map(m => m.views);
    return Math.max(...values);
  });

  // Sorted listings
  sortedListings = computed(() => {
    const listings = [...this.dataByPeriod[this.selectedMonth()].listings];
    const key = this.sortKey();
    const direction = this.sortDirection();

    listings.sort((a, b) => {
      let comparison = 0;
      if (key === 'item' || key === 'status') {
        comparison = a[key].localeCompare(b[key]);
      } else {
        comparison = a[key] - b[key];
      }
      return direction === 'asc' ? comparison : -comparison;
    });

    return listings;
  });

  // Best performing item
  bestPerformingItem = computed(() => {
    const listings = this.dataByPeriod[this.selectedMonth()].listings;
    return listings.reduce((prev, current) => 
      prev.views > current.views ? prev : current
    ).item;
  });

  // Categories data
  categories = [
    { name: 'Electronics', percentage: 40, color: '#0065ff' },
    { name: 'Furniture', percentage: 30, color: '#8fc3ff' },
    { name: 'Books', percentage: 20, color: '#7ee2a2' },
    { name: 'Clothing', percentage: 10, color: '#ffd17d' }
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  // Get bar height as percentage
  getBarHeight(views: number): number {
    const maxHeight = 190; // max height in pixels
    const scale = maxHeight / this.maxChartValue();
    return views * scale;
  }

  // Toggle month dropdown
  toggleMonthDropdown(): void {
    this.isMonthDropdownOpen.update(v => !v);
    if (this.isUserMenuOpen()) {
      this.isUserMenuOpen.set(false);
    }
  }

  // Select month
  selectMonth(month: string): void {
    this.selectedMonth.set(month);
    this.isMonthDropdownOpen.set(false);
  }

  // Toggle user menu
  toggleUserMenu(): void {
    this.isUserMenuOpen.update(v => !v);
    if (this.isMonthDropdownOpen()) {
      this.isMonthDropdownOpen.set(false);
    }
  }

  // Sort table
  sortTable(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDirection.set('desc');
    }
  }

  // Get sort indicator
  getSortIndicator(key: SortKey): string {
    if (this.sortKey() !== key) return '';
    return this.sortDirection() === 'asc' ? ' ↑' : ' ↓';
  }

  // Navigate to home
  goHome(): void {
    this.router.navigate(['/analytics']);
  }

  // Logout
  logout(): void {
    this.authService.logout();
  }

  // Close dropdowns when clicking outside
  closeDropdowns(): void {
    this.isMonthDropdownOpen.set(false);
    this.isUserMenuOpen.set(false);
  }
}
