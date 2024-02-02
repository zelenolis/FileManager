import os from 'os';

export function cpusinfo() {
    const cpus = os.cpus();

    console.log(`Number of CPUs: ${cpus.length}`);

    cpus.forEach((cpu, index) => {
        console.log(`CPU no${index + 1}: Model: "${cpu.model}", clock speed: "${cpu.speed} GHz"`);
      });
}

export function osinfo() {
    console.log(`Operating system information: ${os.platform()} ${os.release()}`);
}

export function systemUser() {
    const username = os.userInfo().username;
    console.log(`Current system username is: ${username}`);
}

export function homedirectory() {
    console.log(`Home system's directory is: ${os.homedir()}`);
}

export function architect() {
    console.log(`CPU architecture is: ${os.arch()}`);
}