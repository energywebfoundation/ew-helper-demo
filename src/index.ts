import * as winston from 'winston'
import * as fs from 'fs'
import { deployContracts } from './startup/deployment'
import { BlockchainProperties } from 'ewf-coo'
import { startMatcher } from './startup/matcherStart'
import { uiStart } from './startup/uiStart'
import { ActionModeController } from './controller/ActionModeController'

const exec = require('child_process').exec

export const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [

        new winston.transports.Console({ level: 'silly' })
    ]
})

const main = async () => {
    const configFile = JSON.parse(fs.readFileSync('config/ewf-config.json', 'utf-8').toString())
    const Web3 = require('web3')

    const web3 = new Web3('http://localhost:8545')

    logger.info('ewf-coo demo application started.')

    const blockchainProperties = await deployContracts()
    const CoOAddress = blockchainProperties.cooInstance._address

    logger.verbose(CoOAddress)

    const configJSON = {
        coo: blockchainProperties.cooInstance._address,
        consumingAssetLogic: blockchainProperties.consumingAssetLogicInstance._address,
        producingAssetLogic: blockchainProperties.producingAssetLogicInstance._address,
        demandLogic: blockchainProperties.demandLogicInstance._address,
        certificateLogic: blockchainProperties.certificateLogicInstance._address,
        userLogic: blockchainProperties.userLogicInstance._address,
        matcherPrivateKey: configFile.matcherPrivateKey
    }

    logger.debug('creating JSON config File')
    console.log(configJSON)

    const writeJsonFile = require('write-json-file')
    await writeJsonFile('contractConfig.json', configJSON)

    startMatcher()
    //  uiStart()
    //  console.log("http://localhost:3000/" + CoOAddress)

    const actionmodeController = new ActionModeController(web3)
    await actionmodeController.doFlow()
    logger.info('Demo actions finished!')
    logger.info('UI: http://localhost:3000/' + CoOAddress)

}

main()
