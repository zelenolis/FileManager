import readline from 'readline';
import os from 'os';
import { cpusinfo, osinfo, systemUser, homedirectory, architect } from './utils/opsys.js';
import { navup, navdown, navlist } from './utils/navigation.js';
import { hashCalc } from './utils/hash.js';
import { compress, decompress } from './utils/compres.js';
import { printFile, createNewFile, renameFile, copyThatFile, moveThatFile, deleteThis } from './utils/basic.js'

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
          } else if (input.trim().startsWith('hash ')) {
            const hashName = input.trim().substring(5);
            hashCalc(homeDir, hashName);
          } else if (input.trim().startsWith('compress ')) {
            const filename = input.trim().substring(9);
            compress(homeDir, filename);
          } else if (input.trim().startsWith('decompress ')) {
            const filename = input.trim().substring(11);
            decompress(homeDir, filename);
          } else if (input.trim().startsWith('cat ')) {
            const toRead = input.trim().substring(4);
            printFile(homeDir, toRead);
          } else if (input.trim().startsWith('add ')) {
            const newFile = input.trim().substring(4);
            createNewFile(homeDir, newFile);
          } else if (input.trim().startsWith('rename ')) {
            const renameInput = input.trim().split(' ');
            const oldName = renameInput[1];
            const newName = renameInput[2];
            renameFile(homeDir, oldName, newName);
          } else if (input.trim().startsWith('cp ')) {
            const renameInput = input.trim().split(' ');
            const copyFileName = renameInput[1];
            const CopyPath = renameInput[2];
            copyThatFile(homeDir, copyFileName, CopyPath);
          } else if (input.trim().startsWith('mv ')) {
            const renameInput = input.trim().split(' ');
            const moveFileName = renameInput[1];
            const movePath = renameInput[2];
            moveThatFile(homeDir, moveFileName, movePath);
          } else if (input.trim().startsWith('rm ')) {
            const delFile = input.trim().substring(3);
            deleteThis(homeDir, delFile);
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
