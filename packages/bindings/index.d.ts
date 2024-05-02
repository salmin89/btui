export interface IOBluetoothDevice {
  name: string;
  nameOrAddress: string;
  servicesCount: number;
  isHandsFreeAudioGateway: boolean;
  services: {serviceName: string}[];
}

export interface IOBluetoothWrapper {
  // listConnected(): Promise<any>;
  // listPaired(): Promise<any>;
  // pair(device: string): Promise<any>;
  // unpair(device: string): Promise<any>;
  // getConnected(): Promise<any>;
  // getPaired(): Promise<any>;
  // getDevice(device: string): Promise<any>;
  connect(device: string): void;
  disconnect(device: string): void;
  getDevices(): string;
}

declare module '@btui/bindings' {
  export const IOBluetoothWrapper: IOBluetoothWrapper;
}