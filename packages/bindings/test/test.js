import bind from 'bindings';
import prompt from 'prompt';

const addon = bind('addon');
console.log(addon.getAllPairedDevices())


const arctis = '28-9a-4b-fa-49-c7'
const nerm = 'd0-65-44-2a-f1-b4'
let selectedDevice = nerm;

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
        console.log(addon.connect(selectedDevice))
      } else if (answer === '2') {
        addon.disconnect(selectedDevice)
      } else if (answer === '3') {
        console.log(addon.addToFavorites(selectedDevice))
      } else if (answer === '4') {
        console.log(addon.getAllPairedDevices())
      } else {
        console.log('please select 1, 2 or 0')
      }
    }
  }
  
run();