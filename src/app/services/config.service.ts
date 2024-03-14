// config.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public config: any;

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<any> {
    return this.http.get('assets/appConfig.json');
  }

  getAuthServiceUrl() {
    return this.config.authServiceUrl;
  }

  getTodoServiceUrl() {
    return this.config.todoServiceUrl;
  }
}
