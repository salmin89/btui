import { IOBluetoothDevice, IOBluetoothWrapper } from "@btui/bindings";
import { IAdapter } from "../types/bt-adapter.js";
import { Option } from "../types/clack-option.js";
// import { execAsync } from "./node-utils.js";
import * as p from '@clack/prompts';

export class State {

  // private adapter: IAdapter;

  paired: any[] = []
  connected: any[] = []
  constructor() {
    // this.adapter = _adapter;
    this.connected = [];
    this.paired = [];
  }

  // addConnected(device) {
  //   this.connected.push(device);
  // }

  // addPaired(device) {
  //   this.paired.push(device);
  // }

  // getConnected() {
  //   return this.connected;
  // }

  getPaired() {
    // const paired = await execAsync('blueutil --paired --format json') as any;
    const paired = IOBluetoothWrapper.getAllPairedDevices();
    console.log(paired)
    this.paired = paired
    return this.paired
  }

  async getConnected(): Promise<IOBluetoothDevice[]> {
    // const connected = await execAsync('blueutil --connected --format json') as any;
    const connected = IOBluetoothWrapper.getAllPairedDevices();
    this.connected = connected
    return this.connected
  }

 

  // setConnected(devices) {
  //   this.connected = devices;
  // }

  // setPaired(devices) {
  //   this.paired = devices;
  // }

  // clear() {
  //   this.connected = [];
  //   this.paired = [];
  // }
}

export class BTHelper {
  static async noDevices() {
    await p.select<any, any>({
      message: "No Devices",
      initialValue: null,
      options: [{value: null, label: "return"}]
    });
  }

  static async selectDevice(devices: IOBluetoothDevice[]) {
    const selectedDevice = await p.select<Option<IOBluetoothDevice>, IOBluetoothDevice>({
      message: "Select Device",
      options: devices.map((device) => ({
        value: device,
        label: `${device.name}`
      }))
    });

    return selectedDevice as IOBluetoothDevice;
  }
}