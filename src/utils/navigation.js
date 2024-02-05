import { dirname } from 'path';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { stat } from 'fs';
import { isADir } from './basic.js';


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

export async function navdown(oldPath, fldr) {
   
    const newPath = join(oldPath, fldr);

    try {
        if(await isADir(newPath)) {
            console.log(`directory changed to ${newPath}`);
            return newPath;
        } else {
            return oldPath;
        }
    } catch (err) {
        return oldPath;
    }

}