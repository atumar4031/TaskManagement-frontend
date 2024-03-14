import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private config: ConfigService, private http: HttpClient) {}

  register(payload: any) {
    const path = environment.baseUrl + environment.registerUrl;
    return this.http.post(path, payload);
  }

  login(payload: any) {
    const path = environment.baseUrl + environment.loginUrl;
    return this.http.post(path, payload);
  }

  logOut() {
    const path = environment.baseUrl + environment.logout;
    return this.http.get(path);
  }
}
