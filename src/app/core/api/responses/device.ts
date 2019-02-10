export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  volume_percent: number | null;
}

export enum DeviceType {
  Computer = 'Computer',
  Tablet = 'Tablet',
  Smartphone = 'Smartphone',
  Speaker = 'Speaker',
  TV = 'TV',
  AVR = 'AVR',
  STB = 'STB',
  AudioDongle = 'AudioDongle',
  GameConsole = 'GameConsole',
  CastVideo = 'CastVideo',
  CastAudio = 'CastAudio',
  Automobile = 'Automobile',
  Unknown = 'Unknown',
}
