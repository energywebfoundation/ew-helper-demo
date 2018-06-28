import * as fs from 'fs'
import { logger } from '..'
import { FlowActionType, FlowActionUserData, FlowActionProducingAssetData, FlowActionDemandData, FlowActionMeterReadData, FlowActionMeterReadDataProducing, FlowActionConsumingAssetData } from '../types/flowConf';
import { User, BlockchainProperties, CoOTruffleBuild, DemandLogicTruffleBuild, AssetProducingLogicTruffleBuild, AssetConsumingLogicTruffleBuild, CertificateLogicTruffleBuild, UserLogicTruffleBuild, ProducingAsset, ProducingAssetProperties, Compliance, ConsumingAsset, ConsumingProperties, TimeFrame, Currency, FullDemandProperties, Demand } from 'ewf-coo';
import { UserProperties } from 'ewf-coo/build/ts/blockchain-facade/User';
import Web3Type from 'ewf-coo/build/ts/types/web3';
import { AssetType } from 'ewf-coo/build/ts/blockchain-facade/ProducingAsset';

export class ActionModeController {

    private actionFlow

    private blockchainProperties: BlockchainProperties

    private smartmeterkeyConsuming: any = {}
    private smartmeterkeyProducing: any = {}

    constructor(_web3: Web3Type) {

        this.actionFlow = JSON.parse(fs.readFileSync('config/ewf-config.json', 'utf-8').toString())

        const contractConfig = JSON.parse(fs.readFileSync('contractConfig.json', 'utf-8').toString())


        this.blockchainProperties = {
            web3: _web3,
            cooInstance: new _web3.eth.Contract((CoOTruffleBuild as any).abi, contractConfig.coo),
            demandLogicInstance: new _web3.eth.Contract((DemandLogicTruffleBuild as any).abi, contractConfig.demandLogic),
            producingAssetLogicInstance: new _web3.eth.Contract((AssetProducingLogicTruffleBuild as any).abi, contractConfig.producingAssetLogic),
            consumingAssetLogicInstance: new _web3.eth.Contract((AssetConsumingLogicTruffleBuild as any).abi, contractConfig.consumingAssetLogic),
            certificateLogicInstance: new _web3.eth.Contract((CertificateLogicTruffleBuild as any).abi, contractConfig.certificateLogic),
            userLogicInstance: new _web3.eth.Contract((UserLogicTruffleBuild as any).abi, contractConfig.userLogic),
            topAdminAccount: (_web3 as any).eth.accounts.privateKeyToAccount('0x' + this.actionFlow.topAdminPrivateKey).address,
            privateKey: this.actionFlow.topAdminPrivateKey,
            userAdmin: (_web3 as any).eth.accounts.privateKeyToAccount("0x" + this.actionFlow.topAdminPrivateKey).address,
            assetAdminAccount: (_web3 as any).eth.accounts.privateKeyToAccount("0x" + this.actionFlow.topAdminPrivateKey).address,
            agreementAdmin: (_web3 as any).eth.accounts.privateKeyToAccount("0x" + this.actionFlow.topAdminPrivateKey).address
        }
    }

    async doFlow() {

        logger.verbose("parsed config file. Found " + this.actionFlow.flow.length + " actions!")

        for (let i = 0; i < this.actionFlow.flow.length; i++) {
            switch (this.actionFlow.flow[i].type) {
                case FlowActionType.CreateDemand:
                    await this.createDemand(this.actionFlow.flow[i].data)
                    break
                case FlowActionType.CreateUser:
                    await this.createUser(this.actionFlow.flow[i].data)
                    break
                case FlowActionType.OnboardConsumingAsset:
                    await this.onboardConsumingAsset(this.actionFlow.flow[i].data)
                    break
                case FlowActionType.OnboardProducingAsset:
                    await this.onboardProducingAsset(this.actionFlow.flow[i].data)
                    break
                case FlowActionType.Sleep:
                    await this.sleep(this.actionFlow.flow[i].data)
                    break
                case FlowActionType.SaveSmartMeterReadProducing:
                    await this.setMeterReadingProducing(this.actionFlow.flow[i].data)
                    break
                case FlowActionType.SaveSmartMeterConsuming:
                    await this.setMeterReadingConsming(this.actionFlow.flow[i].data)
                    break
                default: logger.debug("TODO")
            }

        }

    }

    async createUser(userData: FlowActionUserData): Promise<User> {

        const userProps: UserProperties = {
            accountAddress: userData.address,
            firstName: userData.firstName,
            surname: userData.surname,
            organization: userData.organization,
            street: userData.street,
            number: userData.number,
            zip: userData.zip,
            city: userData.city,
            country: userData.country,
            state: userData.state,
            roles: userData.rights
        }

        logger.info('onboarding user: ' + userProps.firstName + ' ' + userProps.surname)
        logger.debug('calling facade with createUser. params: [accountAddress: '
            + userProps.accountAddress + ', first name: ' + userProps.firstName + ', surname: ' + userProps.surname + ', organization: ' + userProps.organization + ', rights: ' + userProps.roles + ']')

        return User.CREATE_USER_RAW(userProps, this.blockchainProperties)
    }

    async onboardProducingAsset(assetData: FlowActionProducingAssetData): Promise<ProducingAsset> {

        let assetTypeConfig

        switch (assetData.assetType) {
            case 'Wind': assetTypeConfig = AssetType.Wind
                break
            case 'Solar': assetTypeConfig = AssetType.Solar
                break
            case 'RunRiverHydro': assetTypeConfig = AssetType.RunRiverHydro
                break
            case 'BiomassGas': assetTypeConfig = AssetType.BiomassGas
        }

        let assetCompliance

        switch (assetData.complianceRegistry) {
            case 'IREC': assetCompliance = Compliance.IREC
                break
            case 'EEC': assetCompliance = Compliance.EEC
                break
            case 'TIGR': assetCompliance = Compliance.TIGR
                break
            default:
                assetCompliance = Compliance.none
                break
        }

        const assetProps: ProducingAssetProperties = {
            smartMeter: assetData.smartMeter,
            owner: assetData.owner,
            operationalSince: assetData.operationalSince,
            capacityWh: assetData.capacityWh,
            lastSmartMeterReadWh: assetData.lastSmartMeterReadWh,
            active: assetData.active,
            lastSmartMeterReadFileHash: assetData.lastSmartMeterReadFileHash,
            country: assetData.country,
            region: assetData.region,
            zip: assetData.zip,
            city: assetData.city,
            street: assetData.street,
            houseNumber: assetData.houseNumber,
            gpsLatitude: assetData.gpsLatitude,
            gpsLongitude: assetData.gpsLongitude,
            assetType: assetTypeConfig,
            certificatesCreatedForWh: assetData.certificatesCreatedForWh,
            lastSmartMeterCO2OffsetRead: assetData.lastSmartMeterCO2OffsetRead,
            cO2UsedForCertificate: assetData.cO2UsedForCertificate,
            complianceRegistry: assetCompliance,
            otherGreenAttributes: assetData.otherGreenAttributes,
            typeOfPublicSupport: assetData.typeOfPublicSupport
        }
        const onboardedAsset = await ProducingAsset.CREATE_ASSET_RAW(assetProps, this.blockchainProperties)
        this.smartmeterkeyProducing[onboardedAsset.id] = assetData.smartMeterPK
        logger.info('onboarded producing asset #' + onboardedAsset.id)
        return onboardedAsset
    }

    async onboardConsumingAsset(consumingData: FlowActionConsumingAssetData): Promise<ConsumingAsset> {

        const asset = await ConsumingAsset.CREATE_ASSET_RAW(consumingData, this.blockchainProperties)
        logger.info('onboarded consuming asset #' + asset.id)
        this.smartmeterkeyConsuming[asset.id] = consumingData.smartMeterPK
        return asset
    }

    async createDemand(demandData: FlowActionDemandData): Promise<any> {

        let timeFrameDemand: TimeFrame
        switch (demandData.timeFrame) {
            case 'yearly': timeFrameDemand = TimeFrame.yearly
                break
            case 'monthly': timeFrameDemand = TimeFrame.monthly
                break
            default:
                timeFrameDemand = TimeFrame.daily
                break
        }

        let currencyDemand: Currency
        switch (demandData.currency) {
            case 'Euro': currencyDemand = Currency.Euro
                break
            case 'USD': currencyDemand = Currency.USD
                break
            case 'SingaporeDollar': currencyDemand = Currency.SingaporeDollar
                break
            default: currencyDemand = Currency.Ether
                break
        }

        let assetTypeConfig

        switch (demandData.assettype) {
            case 'Wind': assetTypeConfig = AssetType.Wind
                         break
            case 'Solar': assetTypeConfig = AssetType.Solar
                          break
            case 'RunRiverHydro': assetTypeConfig = AssetType.RunRiverHydro
                                  break
            case 'BiomassGas': assetTypeConfig = AssetType.BiomassGas
        }

        let assetCompliance

        switch (demandData.registryCompliance) {
            case 'IREC': assetCompliance = Compliance.IREC
                         break
            case 'EEC': assetCompliance = Compliance.EEC
                        break
            case 'TIGR': assetCompliance = Compliance.TIGR
                         break
            default:
                assetCompliance = Compliance.none
                break
        }

        const demandProps: FullDemandProperties = {
            enabledProperties: demandData.enabledProperties,
            originator: demandData.originator,
            buyer: demandData.buyer,
            startTime: demandData.startTime,
            endTime: demandData.endTime,
            timeframe: timeFrameDemand,
            pricePerCertifiedWh: demandData.pricePerCertifiedWh,
            currency: currencyDemand,
            productingAsset: demandData.producingAsset,
            consumingAsset: demandData.consumingAsset,
            locationCountry: demandData.locationCountry,
            locationRegion: demandData.locationRegion,
            assettype: assetTypeConfig,
            minCO2Offset: demandData.minCO2Offset,
            otherGreenAttributes: demandData.otherGreenAttributes,
            typeOfPublicSupport: demandData.typeOfPublicSupport,
            targetWhPerPeriod: demandData.targetWhPerPeriod,
            matcher: demandData.matcher,
            registryCompliance: assetCompliance
        }

        const onboardedDemand = await Demand.CREATE_DEMAND_RAW(demandProps, this.blockchainProperties, this.blockchainProperties.topAdminAccount)
        logger.info('Demand #' + onboardedDemand.id + ' onboarded')
        return onboardedDemand
    }

    async sleep(ms) {
        logger.verbose('Sleeping for ' + ms + 'ms')
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async setMeterReadingProducing(meterreadData: FlowActionMeterReadDataProducing) {
        logger.info('Logging ' + meterreadData.meterreading + 'wH for producing asset #' + meterreadData.assetId)

        const filehash = this.blockchainProperties.web3.utils.fromUtf8(meterreadData.filehash)

        logger.debug('provided data: assetId: ' + meterreadData.assetId + ', meterread: ' + meterreadData.meterreading + ', CO2: ' + meterreadData.co2Offset + ', filehash: ' + filehash + ', PK: ' + this.smartmeterkeyProducing[meterreadData.assetId])
        const newBlockchainProps = { ...this.blockchainProperties }
        newBlockchainProps.privateKey = this.smartmeterkeyProducing[meterreadData.assetId]
        const asset = await (new ProducingAsset(meterreadData.assetId, newBlockchainProps)).syncWithBlockchain()
        logger.debug('smartmeter SM:' + asset.smartMeter + ', calculatedAddress: ' + (this.blockchainProperties.web3 as any).eth.accounts.privateKeyToAccount('0x' + this.smartmeterkeyProducing[meterreadData.assetId]).address)

        logger.debug('meterread before: ' + asset.lastSmartMeterReadWh)

        await asset.saveSmartMeterRead(meterreadData.meterreading, filehash, meterreadData.co2Offset, newBlockchainProps)
        logger.debug('meterread after: ' + (await (new ProducingAsset(meterreadData.assetId, newBlockchainProps)).syncWithBlockchain()).lastSmartMeterReadWh)

    }

    async setMeterReadingConsming(meterreadData: FlowActionMeterReadData) {
        logger.info('Logging ' + meterreadData.meterreading + 'wH for consuming asset #' + meterreadData.assetId)

        const filehash = this.blockchainProperties.web3.utils.fromUtf8(meterreadData.filehash)

        logger.debug('provided data: assetId: ' + meterreadData.assetId + ', meterread: ' + meterreadData.meterreading + ', filehash: ' + filehash + ', PK: ' + this.smartmeterkeyConsuming[meterreadData.assetId])
        const newBlockchainProps = { ...this.blockchainProperties }
        newBlockchainProps.privateKey = this.smartmeterkeyConsuming[meterreadData.assetId]
        const asset = await (new ConsumingAsset(meterreadData.assetId, newBlockchainProps)).syncWithBlockchain()
        logger.debug('smartmeter SM:' + asset.smartMeter + ', calculatedAddress: ' + (this.blockchainProperties.web3 as any).eth.accounts.privateKeyToAccount('0x' + this.smartmeterkeyConsuming[meterreadData.assetId]).address)

        logger.debug('meterread before: ' + asset.lastSmartMeterReadWh)
        await asset.saveSmartMeter(meterreadData.meterreading, filehash, true, newBlockchainProps)

        logger.debug('meterread after: ' + (await (new ConsumingAsset(meterreadData.assetId, newBlockchainProps)).syncWithBlockchain()).lastSmartMeterReadWh)

    }
}