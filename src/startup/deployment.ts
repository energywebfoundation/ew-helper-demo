import { BlockchainProperties } from 'ewf-coo'

import * as fs from 'fs'
import { deployCoo, deployContract, logicInit, initCoo } from 'ewf-coo'
import { DemandLogicTruffleBuild, AssetProducingLogicTruffleBuild, AssetConsumingLogicTruffleBuild, CertificateLogicTruffleBuild, CoOTruffleBuild, UserLogicTruffleBuild } from 'ewf-coo'
import { DemandDBTruffleBuild, AssetProducingDBTruffleBuild, AssetConsumingDBTruffleBuild, CertificateDBTruffleBuild, UserDBTruffleBuild } from 'ewf-coo'
import { logger } from '..'

let blockchainProperties: BlockchainProperties

const Web3 = require('web3')
const web3 = new Web3('http://blockchain:8545')

export const deployContracts = async () => {
    const configFile = JSON.parse(fs.readFileSync('config/ewf-config.json', 'utf-8').toString())

    const CooAddress = await deployCoo(configFile.topAdminPrivateKey)
    logger.info('CoO deployed: ' + CooAddress)
    const assetConsumingLogicAddress = await deployContract(CooAddress, AssetConsumingLogicTruffleBuild, configFile.topAdminPrivateKey)
    logger.info('AssetConsumingLogic deployed: ' + assetConsumingLogicAddress)
    const assetConsumingDBAddress = await deployContract(assetConsumingLogicAddress, AssetConsumingDBTruffleBuild, configFile.topAdminPrivateKey)
    logger.info('AssetConsumingDB deployed: ' + assetConsumingDBAddress)
    const assetProducingLogicAddress = await deployContract(CooAddress, AssetProducingLogicTruffleBuild, configFile.topAdminPrivateKey)
    logger.info('AssetProducingLogic deployed: ' + assetProducingLogicAddress)
    const assetProducingDBAddress = await deployContract(assetProducingLogicAddress, AssetProducingDBTruffleBuild, configFile.topAdminPrivateKey)
    logger.info('AssetProducingDB deployed: ' + assetProducingDBAddress)
    const certificateLogicAddress = await deployContract(CooAddress, CertificateLogicTruffleBuild, configFile.topAdminPrivateKey)
    logger.info('CertificateLogic deployed: ' + certificateLogicAddress)
    const certificateDBAddress = await deployContract(certificateLogicAddress, CertificateDBTruffleBuild, configFile.topAdminPrivateKey)
    logger.info('CertificateDB deployed: ' + certificateLogicAddress)
    const demandLogicAddress = await deployContract(CooAddress, DemandLogicTruffleBuild, configFile.topAdminPrivateKey)
    logger.info('DemandLogic deployed: ' + demandLogicAddress)
    const demandDbAddress = await deployContract(demandLogicAddress, DemandDBTruffleBuild, configFile.topAdminPrivateKey)
    logger.info('DemandDB deployed: ' + demandDbAddress)
    const userLogicAddress = await deployContract(CooAddress, UserLogicTruffleBuild, configFile.topAdminPrivateKey)
    logger.info('UserLogic deployed: ' + userLogicAddress)
    const userDbAddress = await deployContract(userLogicAddress, UserDBTruffleBuild, configFile.topAdminPrivateKey)
    logger.info('UserDB deployed: ' + userDbAddress)

    logger.verbose('init assetConsuming')
    await logicInit(assetConsumingLogicAddress, assetConsumingDBAddress, configFile.topAdminPrivateKey)
    logger.verbose('init assetProducing')
    await logicInit(assetProducingLogicAddress, assetProducingDBAddress, configFile.topAdminPrivateKey)
    logger.verbose('init certificate')
    await logicInit(certificateLogicAddress, certificateDBAddress, configFile.topAdminPrivateKey)
    logger.verbose('init demand')
    await logicInit(demandLogicAddress, demandDbAddress, configFile.topAdminPrivateKey)
    logger.verbose('init userlogic')
    await logicInit(userLogicAddress, userDbAddress, configFile.topAdminPrivateKey)
    logger.verbose('init coo')
    await initCoo(CooAddress, userLogicAddress, assetProducingLogicAddress, certificateLogicAddress, demandLogicAddress, assetConsumingLogicAddress, configFile.topAdminPrivateKey)

    return blockchainProperties = {
        web3: web3,
        cooInstance: new web3.eth.Contract((CoOTruffleBuild as any).abi, CooAddress),
        producingAssetLogicInstance: new web3.eth.Contract((AssetProducingLogicTruffleBuild as any).abi, assetProducingLogicAddress),
        consumingAssetLogicInstance: new web3.eth.Contract((AssetConsumingLogicTruffleBuild as any).abi, assetConsumingLogicAddress),
        userLogicInstance: new web3.eth.Contract((UserLogicTruffleBuild as any).abi, userLogicAddress),
        demandLogicInstance: new web3.eth.Contract((DemandLogicTruffleBuild as any).abi, demandLogicAddress),
        certificateLogicInstance: new web3.eth.Contract((CertificateLogicTruffleBuild as any).abi, certificateLogicAddress),

        topAdminAccount: configFile.topAdminAddress,
        privateKey: configFile.topAdminPrivateKey,
        userAdmin: configFile.topAdminAddress,
        assetAdminAccount: configFile.topAdminAddress
    }
}
