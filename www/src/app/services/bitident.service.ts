import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface CheckRequestResponse {
  success: boolean;
  avatar?: string;
}

export interface CreateRequestResponse {
  token: string;
  signature: string;
}

@Injectable({
  providedIn: 'root'
})
export class BitidentService {

  constructor(
    private http: HttpClient,
  ) { }

  createRequest(avatar: string) {
    return this.http.post<CreateRequestResponse>(environment.bitidentUrl + 'create', {avatar});
  }

  checkRequest(id: string) {
    return this.http.get<CheckRequestResponse>(environment.bitidentUrl + 'check/' + id);
  }
}
