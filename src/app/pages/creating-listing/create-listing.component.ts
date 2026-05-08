import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { ListingService } from '../../services/listing.service';


function contactValidator() {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[\d\s\-+()]{10,}$/;
    
    if (emailPattern.test(value) || phonePattern.test(value)) {
      return null;
    }
    return { invalidContact: true };
  };
}

@Component({
  selector: 'app-create-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.css']
})
export class CreateListingComponent {
  listingForm: FormGroup;
  isSubmitting = false;
  previewImage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private listingService: ListingService
  ) {
    this.listingForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      price: ['', [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      photoUrl: [''],
      condition: ['Good'],
      sellerContact: ['', [Validators.required, contactValidator()]]
    });

    // Watch for photo URL changes to update preview
    this.listingForm.get('photoUrl')?.valueChanges.subscribe(url => {
      this.previewImage = url || '';
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.listingForm.get(controlName);
    return !!(control?.invalid && control?.touched);
  }

  getFormValue(controlName: string): string {
    return this.listingForm.get(controlName)?.value || '';
  }

  async onSubmit(): Promise<void> {
    if (this.listingForm.invalid) {
      this.listingForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Add listing via service
    const formValue = this.listingForm.value;
    this.listingService.addListing({
      title: formValue.title,
      name: formValue.title,
      price: formValue.price,
      photoUrl: formValue.photoUrl,
      image: formValue.photoUrl,
      condition: formValue.condition || 'Good',
      location: formValue.location,
      category: formValue.category,
      sellerContact: formValue.sellerContact,
      description: formValue.description
    });

    this.isSubmitting = false;
    alert('Listing created successfully!');
    this.router.navigate(['/home']);
  }

  onCancel(): void {
    this.router.navigate(['/home']);
  }
}
