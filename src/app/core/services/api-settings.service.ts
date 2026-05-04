import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { ApiResponse } from '../models/auth.models';
import { SaveSettingPayload, SettingItem } from '../models/settings.models';

@Injectable({
  providedIn: 'root'
})
export class ApiSettingsService {
  constructor(private http: HttpClient) {}

  getSettings(): Observable<ApiResponse<SettingItem[]>> {
    return this.http.get<ApiResponse<SettingItem[]>>(
      `${API_BASE_URL}/settings`
    );
  }

  saveSetting(payload: SaveSettingPayload): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${API_BASE_URL}/settings`,
      payload
    );
  }
}