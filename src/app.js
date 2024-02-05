import readline from 'readline';
import { dirname } from 'path';
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
rl.setPrompt(`\x1b[32m${homeDir}> \x1b[0m`);

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
  console.log('\x1b[31m%s\x1b[0m', `start the program in following way: npm run start -- --username=your_username`);
  process.exit(0);
  /*
    rl.question('\x1b[32mWhat is your name? \x1b[0m', (name) => {
        username = name;
        console.log(`Welcome to the File Manager, ${username}!`);
        console.log(`\x1b[32mYou are currently in ${homeDir}\x1b[0m`);
      });
      */
}

rl.on('line', (input) => {
    switch (input.trim()) {
      case 'os --EOL':
        osinfo();
        newPrompt();
        break;
      case 'os --cpus':
        cpusinfo();
        newPrompt();
        break;
      case 'os --username':
        systemUser();
        newPrompt();
        break;
      case 'os --homedir':
        homedirectory();
        newPrompt();
        break;
      case 'os --architecture':
        architect();
        newPrompt();
        break;
      case 'up':
        homeDir = dirname(homeDir);
        newPrompt();
        break;
      case 'ls':
        navlist(homeDir);
        newPrompt();
        break;
      case '.exit':
        newPrompt();
        break;

      default:
        if (input.trim().startsWith('cd ')) {
            const folderName = input.trim().substring(3);
            console.log('\x1b[32mWhat is your name? \x1b[0m', `${homeDir}, ${folderName}`)
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
        newPrompt();
        break;
    }
  
    
  }).on('close', () => {
    console.log('\x1b[31m%s\x1b[0m', `Thank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
  });


  function newPrompt() {
    rl.setPrompt(`\x1b[32m${homeDir}> \x1b[0m`);
    rl.prompt();
    return;
  }