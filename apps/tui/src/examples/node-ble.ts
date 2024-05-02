    
import EventEmitter from 'node:events'
const myEmitter = new EventEmitter()
    
// add this handler before emitting any events
process.on('uncaughtException', function (err) {
  console.error('UNCAUGHT EXCEPTION - keeping process alive:', err)
})
    

import { createBluetooth } from 'node-ble';
const { bluetooth, destroy } = createBluetooth();

'use strict';

async function main() {

  var myAdapter = await bluetooth.defaultAdapter();


	console.log(myAdapter);

	if (! await myAdapter.isDiscovering()) {
		console.log ("startDiscovery");
		myAdapter.startDiscovery();
	}

	await myAdapter.isDiscovering();
	console.log ('isDiscovering');

	showDevices();

	async function showDevices () {
		console.log ('------------------------------');
		var myDevices = await myAdapter.devices();
		console.log (myDevices);
		setTimeout (showDevices, 2000);
	}
}

main();