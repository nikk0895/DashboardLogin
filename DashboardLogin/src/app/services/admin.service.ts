import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getStudents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/students`);
  }

  getBatches(): Observable<any> {
    return this.http.get(`${this.baseUrl}/batches`);
  }

  getPayments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/payments`);
  }

  getBills(): Observable<any> {
    return this.http.get(`${this.baseUrl}/bills`);
  }
}
