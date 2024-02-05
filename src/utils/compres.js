import { createGzip } from 'node:zlib';
import { createGunzip } from 'node:zlib';
import { pipeline } from 'node:stream';
import { createReadStream, createWriteStream } from 'node:fs';
import { stat } from 'fs/promises';
import { join } from 'path';


export function compress(pth, filename) {
    const pathToFile = join(pth, filename);
    const gzip = createGzip();

    isAFile(pathToFile)
        .then((check) => {
            if (check) {
                const src = createReadStream(pathToFile);
                const dst = createWriteStream(pathToFile + '.gz');

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
                    } else {
                        console.log('succesfuly compressed')
                    }
                });
            } else {
                console.log('Something went wrong!')
                return;
            }
        })
        .catch((err) => {
            console.log(err);
          })

    
}

export function decompress(pth, filename) {
    const pathToFile = join(pth, filename);

    isAFile(pathToFile)
        .then((check) => {
            if (check) {
                const src = createReadStream(pathToFile);
                const dst = createWriteStream(pathToFile.slice(0, -3));
                src.pipe(createGunzip()).pipe(dst);
                console.log('succesfuly decompressed')
            } else {
                console.log('Something went wrong!')
                return;
            }
        })
        .catch((err) => {
            console.log(err);
          });
}

async function isAFile(pathToFile) {
    try {
        const stats = await stat(pathToFile);
        return stats.isFile();
    } catch (err) {
        console.log(`error reading file: ${err}`);
        return false
    }
}