import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api'; 

  constructor(private http:HttpClient) { }
  registerClient(name: string, email: string, phone: string,): Observable<any> {
    const body = { name, email, phone };
    return this.http.post(`${this.apiUrl}/create_client`, body);
  }
}
