export interface IOBluetoothDevice {
  name: string;
  address: string;
  isConnected: boolean;
  isPaired: boolean;
  isFavorite: boolean;
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
  getAllPairedDevices(): IOBluetoothDevice[];
}

declare module '@btui/bindings' {
  export const IOBluetoothWrapper: IOBluetoothWrapper;
}