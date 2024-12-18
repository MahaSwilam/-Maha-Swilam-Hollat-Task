import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Card } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { User } from '../../interfaces/auth';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterModule,
    Card,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private msgService: MessageService
  ) {}

  loginForm = this.fb.group({
    fullName: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)],
    ],
    password: ['', Validators.required],
  });

  get fullName() {
    return this.loginForm.controls['fullName'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  loginUser() {
    const { fullName, password } = this.loginForm.value;
    this.authService.getUserByEmail(fullName as string).subscribe(
      (response) => {
        if (
          response.length > 0 &&
          response.find((pass) => pass.password === password)
        ) {
          debugger;
          localStorage.setItem('fullName', fullName as string);
          this.router.navigate(['/home']);
        } else {
          debugger;
          this.msgService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'fullName or password is wrong',
          });
        }
      },
      (error) => {
        this.msgService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong',
        });
      }
    );
  }
}
