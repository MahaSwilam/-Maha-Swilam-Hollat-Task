import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { User } from '../../interfaces/auth';
import { TableModule } from 'primeng/table';
import { SearchPipe } from '../../pipes/search.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, CommonModule, TableModule, SearchPipe, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  beneficiariesArray: User[] = [];
  beneficiaryObject: any;
  acceptBtnVisible: boolean | undefined;
  searchText: any;
  isDesc: any;
  allAcceptedBeneficiaries: User[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.listAllBeneficiariesFn();
    // Accept is allowed for admin only
    if (localStorage.getItem('fullName') === 'admin') {
      this.acceptBtnVisible = true;
    } else {
      this.acceptBtnVisible = false;
    }
  }

  // Logout Fn
  logOut() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  // list all beneficiaries Fn
  listAllBeneficiariesFn() {
    this.authService.getAllBeneficiaries().subscribe(
      (response) => {
        this.beneficiariesArray = response;
      },
      (error) => {}
    );
  }

  // accept beneficiaries Fn
  acceptBeneficiariesFn($event: any, beneficiary: any) {
    debugger;
    this.authService.getAcceptedBeneficiaries().subscribe(
      (response) => {
        this.allAcceptedBeneficiaries = response;
        debugger;
        // if beneficiary is not accepted before, then post the beneficiary in acceptedBeneficiaries API
        if (
          response.length === 0 ||
          this.allAcceptedBeneficiaries.find(
            (bene) => bene.email !== beneficiary.email
          )
        ) {
          this.authService.acceptedBeneficiaries(beneficiary as any).subscribe(
            (response) => {
              debugger;
              console.log(response);
              this.messageService.add({
                severity: 'success',
                summary: 'success',
                detail: 'beneficiary Successfully added',
                life: 3000,
              });
              $event.target.attributes.class.ownerElement.innerHTML =
                'Accepted';
              $event.target.attributes.class.ownerElement.disabled = true;
            },
            (error) => {
              debugger;
              console.log(error);
              this.messageService.add({
                severity: 'error',
                summary: 'error',
                detail: 'Something went wrong',
                life: 3000,
              });
            }
          );
        }
        // if beneficiary is accepted before
        else {
          this.messageService.add({
            severity: 'error',
            summary: 'error',
            detail: 'beneficiary already accepted before',
            life: 3000,
          });
        }
      },
      (error) => {}
    );
  }

  sortName(property: any) {
    this.beneficiariesArray.sort((a: any, b: any) => {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      } else {
        return 0;
      }
    });
    return this.beneficiariesArray;
  }
}
