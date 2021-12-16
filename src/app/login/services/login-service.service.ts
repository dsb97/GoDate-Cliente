import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { UserResponse } from '../model/req-response';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  public baseURL: string = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) { }

  public login (correo: string, pass: string)
  {
    let url = this.baseURL + 'login';
    let data = {
      "correo":correo,
      "pass":pass
    }
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<UserResponse>(url, data, {headers: headers}).pipe(
      map((resp:UserResponse) => {
        return User.userFromJSON(resp)
      })
    );
  }
}
