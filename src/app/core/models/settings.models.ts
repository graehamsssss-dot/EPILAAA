export interface SettingItem {
  id: number;
  setting_key: string;
  setting_value: any;
  created_at: string;
  updated_at: string;
}

export interface SaveSettingPayload {
  settingKey: string;
  settingValue: any;
}