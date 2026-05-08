import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isEditMode = false;

  user = {
    fullName: 'Ahmed Mohamed',
    email: 'ahmed@example.com',
    phone: '01012345678',
    location: 'Cairo, Egypt',
    bio: 'I like buying and selling second-hand items.'
  };

  listings = [
    {
      id: 1,
      title: 'Used Laptop',
      price: '$250',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
    },
    {
      id: 2,
      title: 'Office Chair',
      price: '$150',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'
    }
  ];

  stats = {
    listings: 6,
    sold: 2,
    wishlist: 10
  };

  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      fullName: [this.user.fullName, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [this.user.phone, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      location: [this.user.location],
      bio: [this.user.bio]
    });
  }

  ngOnInit(): void {
  
    const currentUser = this.authService.user();
    if (currentUser) {
      this.user.email = currentUser.email;
      this.user.fullName = currentUser.name || this.user.fullName;
      this.profileForm.patchValue({
        email: currentUser.email,
        fullName: currentUser.name || this.user.fullName
      });
    }

   
    const wishlist = localStorage.getItem('wishlist');
    if (wishlist) {
      this.stats.wishlist = JSON.parse(wishlist).length;
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.profileForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  editProfile(): void {
    this.isEditMode = true;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.user = {
      ...this.user,
      ...this.profileForm.value
    };

    this.isEditMode = false;
  }

  onCancel(): void {
    this.profileForm.patchValue(this.user);
    this.isEditMode = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  viewListing(item: { id: number }): void {
    this.router.navigate(['/item', item.id]);
  }
}
