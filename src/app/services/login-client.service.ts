import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginClientService {

  private apiUrl = 'https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod';

  constructor(private http:HttpClient) { }

  loginClient(email: string, password: string) {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/auth/login`, body);
  }
}
