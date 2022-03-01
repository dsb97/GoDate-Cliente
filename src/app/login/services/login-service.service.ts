import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { UserResponse } from '../model/req-response';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  public static readonly SESSION_STORAGE_KEY: string = "user";
  public baseURL: string = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) { }

  public login(correo: string, pass: string) {
    let url = this.baseURL + 'login';
    let data = {
      "correo": correo,
      "pass": pass
    }
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<UserResponse>(url, data, { headers: headers }).pipe(
      map((resp: UserResponse) => {
        return User.userFromJSON(resp)
      })
    );
  }

  public setLoggedUser(user: User) {
    sessionStorage.setItem(LoginServiceService.SESSION_STORAGE_KEY, JSON.stringify(user));
  }

  public getLoggedUser(): User {
    let user: string | any = sessionStorage.getItem(LoginServiceService.SESSION_STORAGE_KEY);
    return JSON.parse(user);
  }

  public removeLoggedUser() {
    sessionStorage.removeItem(LoginServiceService.SESSION_STORAGE_KEY);
  }
}
