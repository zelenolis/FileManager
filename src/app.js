import readline from 'readline';
import os from 'os';
import { cpusinfo, osinfo, systemUser, homedirectory, architect } from './utils/opsys.js'
import { navup, navdown, navlist } from './utils/navigation.js'

let homeDir = os.homedir();
const userArgs = process.argv;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
rl.setPrompt('> ');
rl.prompt();

let username = '';

userArgs.forEach((val) => {
    if (val.slice(2, 10) === 'username') {
        username = val.split('=')[1];
    }
});

if (username !== '') {
    console.log(`Welcome to the File Manager, ${username}!`);
    console.log(`\x1b[32mYou are currently in ${homeDir}\x1b[0m`);
} else {
    rl.question('\x1b[32mWhat is your name? \x1b[0m', (name) => {
        username = name;
        console.log(`Welcome to the File Manager, ${username}!`);
        console.log(`\x1b[32mYou are currently in ${homeDir}\x1b[0m`);
      });
}

rl.on('line', (input) => {
    switch (input.trim()) {
      case 'os --EOL':
        osinfo();
        break;
      case 'os --cpus':
        cpusinfo();
        break;
      case 'os --username':
        systemUser();
        break;
      case 'os --homedir':
        homedirectory();
        break;
      case 'os --architecture':
        architect();
        break;
      case 'up':
        homeDir = navup(homeDir);
        console.log(`new directory is: ${homeDir}`)
        break;
      case 'ls':
        navlist(homeDir);
        break;
      case '.exit':
        console.log('\x1b[31m%s\x1b[0m', 'Goodbye!');
        rl.close();
        break;

      default:
        if (input.trim().startsWith('cd ')) {
            const folderName = input.trim().substring(3);
            navdown(homeDir, folderName)
              .then((newPath) => {
                homeDir = newPath;
              })
              .catch((err) => {
                console.log(err);
              })
          } else {
            console.log(`Invalid input: ${input.trim()}`);
          }
        break;
    }
  
    rl.prompt();
  }).on('close', () => {
    console.log('Exiting...');
    process.exit(0);
  });
