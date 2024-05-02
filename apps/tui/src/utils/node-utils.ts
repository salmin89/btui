import {execSync, exec} from 'child_process'

export async function execAsync(command: string, parseJson = true) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error || stderr) {
        if (stderr.includes('command not found')) {
          console.error('blueutil not found. Please install blueutil (brew install blueutil)');
        }

        reject(error || stderr);
      }
      
      if (parseJson) {
        stdout = jsonParse(stdout);
      }
      resolve(stdout)
    })
  });
}

export function jsonParse(data: string) {
  try {
    return JSON.parse(data)
  } catch (e) {
    return null;
  }
}