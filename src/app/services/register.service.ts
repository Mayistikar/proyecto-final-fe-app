import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod';

  constructor(private http:HttpClient) { }
  registerClient(full_name: string, email: string, phone: string,password: string, confirm_password: string, address: string): Observable<any> {
    const body = { email,password,confirm_password,full_name, phone, address };
    return this.http.post(`${this.apiUrl}/api/create_client`, body);
  }
}
