#!/usr/bin/env node

import * as p from '@clack/prompts';
import color from 'picocolors';
import {execAsync} from './utils/node-utils.js'
import { BTCommand, DeviceCommand } from './types/commands.js';
import { State, BTHelper } from './utils/State.js';
import { BlueutilsAdapter } from './adapters/blueutils-adapter.js';
import { IOBluetoothDevice, IOBluetoothWrapper } from '@btui/bindings';


const spinner = p.spinner();

const btState = new State();


async function main() {
  console.clear();
  
	p.intro(`${color.bgMagenta(color.black('BT CLI'))}`);
  
  const state = await p.select<any, any>({
		message: "Select command",
		options: [
			{value: BTCommand.listConnected, label: "1. list connected devices"},
			{value: BTCommand.listPaired, label: "2. list paired devices"},
    ]
	})

  resolveState(state)


  // p.outro(`${color.bgMagenta(color.black(`The command line is a tool that is ripe for change. `))}`);
}

async function resolveState(state: BTCommand) {
  switch (state) {
    case BTCommand.listConnected: {
      const devices = await btState.getConnected();
      if (!devices.length) {
        await BTHelper.noDevices();
        main()
        break;
      }

      const selectedDevice = await BTHelper.selectDevice(devices);
      const answer = await showDeviceCommands(selectedDevice)
      return await resolveState(state)
      break;
    }

    case BTCommand.listPaired: {
      const devices = btState.getPaired();
      if (!devices.length) {
        await BTHelper.noDevices();
        await main()
        break;
      }
      console.clear();
      const selectedDevice = await BTHelper.selectDevice(devices);

      const answer = await showDeviceCommands(selectedDevice)
      return await resolveState(state)
      break;
    }
      
  
    default:
      break;
  }
}


async function showDeviceCommands(device: IOBluetoothDevice) {
  const selectedAction = await p.select<any, DeviceCommand>({
    message: "Select Action",
    options: [DeviceCommand.connect, DeviceCommand.disconnect, DeviceCommand.reconnect, DeviceCommand.unpair, DeviceCommand.info, DeviceCommand.return].map((command) => ({
      value: command,
      label: command
    }))
  });

  switch (selectedAction) {
    case DeviceCommand.connect: {
      spinner.start(`connecting to ${device.name}`);
      // await execAsync(`blueutil --connect ${device.address}`);
      IOBluetoothWrapper.connect(device.address);
      spinner.stop(`connected!`);
      break;
    }
     
    case DeviceCommand.disconnect: {
      spinner.start(`disconnecting ${device.name}`);
      // await execAsync(`blueutil --disconnect ${device.address}`);
      IOBluetoothWrapper.disconnect(device.address);
      spinner.stop(`disconnected!`);
      break;
    }

    case DeviceCommand.reconnect: {
      break;
    }

    case DeviceCommand.info: {
      // const result = await execAsync(`blueutil --info ${device.address} --format json`);
      // console.log(result)
      return await showDeviceCommands(device)
      break;
    }

    case DeviceCommand.unpair: {
      break;
    }

    case DeviceCommand.return: {
      return selectedAction
      break
    }
  
    default:
      break;
  }

  main().catch(console.error);

}





main().catch(console.error);



