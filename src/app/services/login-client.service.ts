import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginClientService {



  private apiUrl = 'https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod';

  constructor(private http:HttpClient) { }

  loginClient(email: string, password: string) {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/auth/login`, body).pipe(
      tap((response: any) => {
        if(response.access_token && response.role){
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('role', response.role);
          localStorage.setItem('user_id', response.id);

        }
      }));
  }

  getUserRole(): string {
    return localStorage.getItem('role') || '';
  }

  getUserId(): string {
    return localStorage.getItem('user_id') || '';
  }


  isAuthenticated(): boolean {
    return localStorage.getItem('access_token') !== null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
  }


}
