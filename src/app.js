import readline from 'readline';
import { fileURLToPath } from 'url';
import { join } from 'path';
import { dirname } from 'path';
import os from 'os';
import { cpusinfo, osinfo, systemUser, homedirectory, architect } from './utils/opsys.js';
import { navdown, navlist } from './utils/navigation.js';
import { hashCalc } from './utils/hash.js';
import { compress, decompress } from './utils/compres.js';
import { printFile, createNewFile, renameFile, copyThatFile, moveThatFile, deleteThis } from './utils/basic.js'

let homeDir = os.homedir();
const userArgs = process.argv;

const appPath = fileURLToPath(import.meta.url);
const appDir = dirname(appPath);

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
    console.log(`\x1b[36mWelcome to the File Manager, \x1b[32m${username}!\x1b[0m`);
    console.log('\x1b[33mUse the "help" to see full command\'s list\x1b[0m');
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

rl.on('line', async (input) => {
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
        await navlist(homeDir);
        newPrompt();
        break;
      case 'help':
        await printFile(appDir, 'help.txt');
        newPrompt();
        break;
      case '.exit':
        rl.close();
        break;

      default:
        if (input.trim().startsWith('cd ')) {
            const folderName = input.trim().substring(3);
            homeDir = await navdown(homeDir, folderName);
          } else if (input.trim().startsWith('hash ')) {
            const hashName = input.trim().substring(5);
            hashCalc(homeDir, hashName);
          } else if (input.trim().startsWith('compress ')) {
            const compressInput = input.trim().split(' ');
            const filenameCo = compressInput[1];
            const pathToCompress = compressInput[2];
            await compress(homeDir, filenameCo, pathToCompress);
          } else if (input.trim().startsWith('decompress ')) {
            const decompressInput = input.trim().split(' ');
            const filenameDe = decompressInput[1];
            const pathToDecompress = decompressInput[2];
            await decompress(homeDir, filenameDe, pathToDecompress);
          } else if (input.trim().startsWith('cat ')) {
            const toRead = input.trim().substring(4);
            await printFile(homeDir, toRead);
          } else if (input.trim().startsWith('add ')) {
            const newFile = input.trim().substring(4);
            await createNewFile(homeDir, newFile);
          } else if (input.trim().startsWith('rn ')) {
            const renameInput = input.trim().split(' ');
            const oldName = renameInput[1];
            const newName = renameInput[2];
            await renameFile(homeDir, oldName, newName);
          } else if (input.trim().startsWith('cp ')) {
            const renameInput = input.trim().split(' ');
            const copyFileName = renameInput[1];
            const CopyPath = renameInput[2];
            await copyThatFile(homeDir, copyFileName, CopyPath);
          } else if (input.trim().startsWith('mv ')) {
            const renameInput = input.trim().split(' ');
            const moveFileName = renameInput[1];
            const movePath = renameInput[2];
            await moveThatFile(homeDir, moveFileName, movePath);
          } else if (input.trim().startsWith('rm ')) {
            const delFile = input.trim().substring(3);
            await deleteThis(homeDir, delFile);
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
    console.log('');
    rl.setPrompt(`\x1b[32m${homeDir}> \x1b[0m`);
    rl.prompt();
    return;
  }