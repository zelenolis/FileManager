import { createReadStream, createWriteStream } from 'node:fs';
import { stat } from 'fs/promises';
import { join } from 'path';
import { writeFile } from 'node:fs';
import { rename } from 'node:fs';
import { pipeline } from 'node:stream';
import { unlink } from 'node:fs';


export async function printFile(pth, filename) {
    const pathToFile = join(pth, filename);

    try {
        if (
            (await isAFile(pathToFile))
        ) {
            const readStream = createReadStream(pathToFile, { encoding: 'utf8' });
            readStream.on('data', (chunk) => {
                process.stdout.write(chunk);
                });
                readStream.on('error', (err) => {
                console.error(`Process error: ${err}`);
                });
                readStream.on('close', () => {
                    console.log('');
                });
        } else {
            console.log('Something went wrong!');
            return;
        }
    } catch (err) {
        console.log(`Unexpected read error: ${err}`);
        return;
    }
}

export async function createNewFile(pth, filename) {
    const pathToFile = join(pth, filename);

    try {
        if (
            (!(await alreadyExist(pathToFile)))
        ) {
            writeFile(pathToFile, '', (err) => {
                if (err) {
                    console.log('Something went wrong!');
                }
            });
            console.log(`${filename} created`);
        } else {
            console.log('Something went wrong!');
            return;
        }
    } catch (err) {
        console.log(`Unexpected create error: ${err}`);
        return;
    }
}

export async function renameFile(pth, filename, newName) {
    const pathToFile = join(pth, filename);
    const pathToNew = join(pth, newName);

    try {
        if (
            (await isAFile(pathToFile)) &&
            (!(await alreadyExist(pathToNew)))
        ) {
            rename(pathToFile, pathToNew, (err) => {
                if (err) {
                    console.log('Something went wrong!');
                }
              });
              console.log('Rename complete!'); 
        } else {
            console.log('Something went wrong!');
            return;
        }
    } catch (err) {
        console.log(`Unexpected rename error: ${err}`);
        return;
    }
}

export async function copyThatFile(pth, filename, newPath) {
    const pathToFile = join(pth, filename);
    const pathToCopy = join(newPath, filename);

    try {
        if (
            (await isAFile(pathToFile)) &&
            (await isADir(newPath))
        ) {
            const copyReadStream = createReadStream(pathToFile);
            const copyWriteStream = createWriteStream(pathToCopy);

            pipeline(copyReadStream, copyWriteStream, (err) => {
                if (err) {
                    console.log(`Copy error: ${err}`);
                    return;
                }
            });
            console.log('Copy completed!');
        } else {
            console.log('Something went wrong!');
            return;
        }
    } catch (err) {
        console.log(`Unexpected copy error: ${err}`);
        return;
    }
}

export async function deleteThis(pth, filename) {
    const pathToFile = join(pth, filename);

    try {
        if(await isAFile(pathToFile)) {
            unlink(pathToFile, (err) => {
                if (err) {
                    console.log('Something went wrong!');
                }
            });
            console.log(`${filename} was deleted`);
        } else {
            console.log('file doesn\'t exist');
            return;
        }
    } catch (err) {
        console.log(`Unexpected delete error: ${err}`);
        return;
    }
}

export async function moveThatFile(pth, filename, newPath){
    const pathToFile = join(pth, filename);
    const pathToCopy = join(newPath, filename);
    
    try {
        if (
            (await isAFile(pathToFile)) &&
            (await isADir(newPath))
        ) {
            const copyReadStream = createReadStream(pathToFile);
            const copyWriteStream = createWriteStream(pathToCopy);

            pipeline(copyReadStream, copyWriteStream, (err) => {
                if (err) {
                    console.log(`Copy error: ${err}`);
                    return;
                }
                console.log(`${filename} was copied and moved`)
            });
            deleteThis(pth, filename);
        } else {
            console.log('Something went wrong!');
            return;
        }
    } catch (err) {
        console.log(`Unexpected copy error: ${err}`);
        return;
    }
}


// internal checks here

async function isAFile(pathToFile) {
    try {
        const stats = await stat(pathToFile);
        return stats.isFile();
    } catch (err) {
        console.log(`error reading file: ${err}`);
        return false
    }
}

export async function isADir(pathToDir) {
    try {
        const stats = await stat(pathToDir);
        return stats.isDirectory();
    } catch (err) {
        console.log(`error reading directory: ${err}`);
        return false
    }
}

async function alreadyExist(pathToFile) {
    try {
        const stats = await stat(pathToFile);
        return stats.isFile();
    } catch (err) {
        return false
    }
}