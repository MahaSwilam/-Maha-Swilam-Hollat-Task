import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  registerUser(userDetails: User) {
    return this.http.post(`${this.baseUrl}/beneficiaries`, userDetails);
  }

  getUserByEmail(fullName: string): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.baseUrl}/beneficiaries?fullName=${fullName}`
    );
  }

  getAllBeneficiaries(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/beneficiaries`);
  }

  acceptedBeneficiaries(beneficiaries: any) {
    return this.http.post(
      `${this.baseUrl}/acceptedBeneficiaries`,
      beneficiaries
    );
  }

  getAcceptedBeneficiaries(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/acceptedBeneficiaries`);
  }
}
