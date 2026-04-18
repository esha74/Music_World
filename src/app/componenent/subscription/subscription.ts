import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Musicservices } from '../../services/musicservices';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Userservices } from '../../services/userservices';


declare var paypal: any;

@Component({
  selector: 'app-subscription',
  imports: [],
  templateUrl: './subscription.html',
  styleUrl: './subscription.css'
})
export class Subscription implements OnInit {
  @ViewChild('paypalSubscriptionBtn', { static: true }) paypalSubscriptionBtn!: ElementRef;

  isLoading = false;

  constructor(private userservices: Userservices, private router: Router) {}

  ngOnInit() {
    this.loadPayPalButton();
  }

  loadPayPalButton() {
    // Replace with your actual PayPal Plan ID
    const planId = "P-5ML4271244454362WXNWU5NQ";

    // Make sure PayPal JS SDK loaded
    if (typeof paypal === 'undefined') {
      Swal.fire('Error', 'PayPal SDK not loaded. Please refresh and try again.', 'error');
      return;
    }

    paypal.Buttons({
      createSubscription: (data: any, actions: any) => {
        return actions.subscription.create({
          plan_id: planId
        });
      },
      onApprove: (data: any) => {
        this.isLoading = true;
        // Call backend confirm-subscription API with subscription ID
        this.userservices.confirmPayPalSubscription(data.subscriptionID).subscribe({
          next: () => {
            this.isLoading = false;
            localStorage.setItem('isSubscribed', 'true');
            Swal.fire('Subscribed!', 'Thank you for subscribing.', 'success').then(() => {
              this.router.navigate(['/home']);
            });
          },
          error: () => {
            this.isLoading = false;
            Swal.fire('Error', 'Subscription confirmation failed.', 'error');
          }
        });
      },
      onCancel: () => {
        Swal.fire('Cancelled', 'Subscription cancelled.', 'info');
      },
      onError: (err: any) => {
        Swal.fire('Error', 'An error occurred during subscription.', 'error');
        console.error(err);
      }
    }).render(this.paypalSubscriptionBtn.nativeElement);
  }
}
  