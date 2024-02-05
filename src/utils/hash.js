import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { stdout } from 'node:process';
import { join } from 'path';

export function hashCalc(homeDir, hashFile) {

    const filePath = join(homeDir, hashFile);
    const file = createReadStream(filePath);
    const hash = createHash('sha256');

    file.on('error', (err) => {
        console.error(`Error reading file: ${err}`);
    });
    hash.on('error', (err) => {
        console.error(`Error calculating hash: ${err}`);
    });

    try {
        file.pipe(hash).setEncoding('hex').pipe(stdout);
    } catch (err) {
        console.log(err);
    }
}