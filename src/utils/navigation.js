import { dirname } from 'path';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { stat } from 'fs';

export function navup(pth) {
    return dirname(pth);
}

export async function navlist(pth) {

    const list = await readdir(pth);

    let allfolders = [];
    let allfiles = [];
    let promises = [];

    list.forEach(element => {
        const el = join(pth, element);
        let promise = new Promise((resolve, reject) => {
            stat(el, (err, stats) => { 
                if (err) reject(err);
    
                if (stats.isDirectory()) {
                    const fldr = {"name": element, "type": "folder"}
                    allfolders.push(fldr);
                } else {
                    const filez = {"name": element, "type": "file"}
                    allfiles.push(filez);
                }
                resolve();
            });
        });
        promises.push(promise);
    });
    await Promise.all(promises);
    allfolders.sort();
    allfiles.sort();
    console.log('directory\'s list');
    console.table(allfolders.concat(allfiles));
}

export function navdown(oldPath, fldr) {
    return new Promise((resolve, reject) => {
        const newPath = join(oldPath, fldr);
        stat(newPath, (err, stats) => {
            if (err) reject(err);
    
            if (stats.isDirectory()) {
                console.log(`directory changed to ${newPath}`);
                resolve(newPath);
            } else {
                console.log('no such directory');
                resolve(oldPath);
            }
        })
    })
}
