import * as fs from 'fs'
import { logger } from '..';

export const startMatcher = async () => {
    const exec = require('child_process').exec
    const addressConfigFile = JSON.parse(fs.readFileSync('contractConfig.json', 'utf-8').toString());

    // console.log(addressConfigFile)

    exec("node " + process.cwd() + "/node_modules/ewf-coo-matcher/build/matcher-main " + addressConfigFile.coo + " 0x" + addressConfigFile.matcherPrivateKey, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });


}

