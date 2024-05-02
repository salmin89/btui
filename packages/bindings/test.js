var bind = require('bindings');
var addon = bind('IOBluetooth-wrapper');
var prompt = require('prompt');


// GET DEVICES (copy ID)
console.log(addon.getDevices())

// My devices
const arctis = '28-9a-4b-fa-49-c7'
const nerm = 'd0-65-44-2a-f1-b4'
let selectedDevice = arctis;

// This works
// addon.connect(nerm)


// This works because we first connect, then disconnect
// console.log(addon.connect(nerm))
// setTimeout(() => {
//   console.log(addon.disconnect(nerm))
// }, 500)

// This doesn't work by itself. Maybe because it's not Node that connected to the device in the first place?
// addon.disconnect(nerm)


async function run() {
  prompt.start();
  let answer;
  while (answer !== '0') {
    const choice = await prompt.get(['Enter 1 to connect, 2 to disconnect, 0 to exit'])
    answer = choice['Enter 1 to connect, 2 to disconnect, 0 to exit'];

    if (answer === '0') {
      break;
    }

    if (answer === '1') {
      addon.connect(selectedDevice)
    } else if (answer === '2') {
      addon.disconnect(selectedDevice)
    } else {
      console.log('please select 1, 2 or 0')
    }
  }
}

run();