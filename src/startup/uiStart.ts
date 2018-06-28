import * as fs from 'fs'
import { logger } from '..';

export const uiStart = async () => {
    const exec = require('child_process').exec
    const addressConfigFile = JSON.parse(fs.readFileSync('contractConfig.json', 'utf-8').toString());

    // console.log(addressConfigFile)

    console.log("node " + process.cwd() + "/node_modules/webpack-dev-server/bin/webpack-dev-server.js --output-public-path=/dist/ -d --watch")

    exec("cd node_modules/ewf-coo-ui && node " + process.cwd() + "/node_modules/webpack-dev-server/bin/webpack-dev-server.js --output-public-path=/dist/ -d --watch", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });


}

