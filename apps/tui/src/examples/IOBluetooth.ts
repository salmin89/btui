import {execSync, exec} from 'child_process'


exec("./myProgram", (error, stdout, stderr) => console.log(stdout));
