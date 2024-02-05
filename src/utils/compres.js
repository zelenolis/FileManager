import { createGzip } from 'node:zlib';
import { createGunzip } from 'node:zlib';
import { pipeline } from 'node:stream';
import { createReadStream, createWriteStream } from 'node:fs';
import { stat } from 'fs/promises';
import { join } from 'path';


export async function compress(pth, filename, newPath=pth) {
    const pathToFile = join(pth, filename);
    const pathToCopy = join(newPath, filename);
    const gzip = createGzip();

    try {
        if (
            (await isAFile(pathToFile)) &&
            (await isADir(newPath))
        ) {
            const src = createReadStream(pathToFile);
            const dst = createWriteStream(pathToCopy + '.gz');

            src.on('error', () => {
                console.log('Read stream error');
            });
            gzip.on('error', () => {
                console.log('Compress error');
            });
            dst.on('error', () => {
                console.log('Write stream error');
            });

            pipeline(src, gzip, dst, (err) => {
                if (err) {
                    console.log(`Process error: ${err}`);
                }
            });
            console.log('succesfuly compressed');
        } else {
            console.log('Something went wrong!');
            return;
        }
    } catch (err) {
        console.log(`Unexpected compress error: ${err}`);
        return;
    }

}

export async function decompress(pth, filename, newPath=pth) {
    const pathToFile = join(pth, filename);
    const pathToCopy = join(newPath, filename);

    try {
        if (
            (await isAFile(pathToFile)) &&
            (await isADir(newPath))
        ) {
            const src = createReadStream(pathToFile);
            const dst = createWriteStream(pathToCopy.slice(0, -3));
            src.pipe(createGunzip()).pipe(dst);
            console.log('succesfuly decompressed')
        } else {
            console.log('Something went wrong!');
            return;
        }
    } catch (err) {
        console.log(`Unexpected compress error: ${err}`);
        return;
    }

}


// helpful local functions

async function isAFile(pathToFile) {
    try {
        const stats = await stat(pathToFile);
        return stats.isFile();
    } catch (err) {
        console.log(`error reading file: ${err}`);
        return false
    }
}

async function isADir(pathToDir) {
    try {
        const stats = await stat(pathToDir);
        return stats.isDirectory();
    } catch (err) {
        console.log(`error reading directory: ${err}`);
        return false
    }
}