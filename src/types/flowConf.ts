import { ConsumingProperties } from "ewf-coo";

export enum FlowActionType {
    CreateUser = "CREATE_ACCOUNT",
    OnboardProducingAsset = "CREATE_PRODUCING_ASSET",
    OnboardConsumingAsset = "CREATE_CONSUMING_ASSET",
    CreateDemand = "CREATE_DEMAND",
    SaveSmartMeterReadProducing = "SAVE_SMARTMETER_READ_PRODUCING",
    SaveSmartMeterConsuming = "SAVE_SMARTMETER_READ_CONSUMING",
    Sleep = "SLEEP"
}

export interface FlowActionUserData {
    firstName: string
    surname: string
    organization: string
    street: string
    number: string
    zip: string
    city: string
    country: string
    state: string
    address: string
    privateKey: string
    rights: 64
}

export interface FlowActionConsumingAssetData extends ConsumingProperties {
    smartMeterPK: string
}

export interface FlowActionProducingAssetData {
    smartMeter: string
    smartMeterPK: string
    owner: string
    operationalSince: number
    capacityWh: number
    lastSmartMeterReadWh: number
    active: boolean
    lastSmartMeterReadFileHash: string
    country: string
    region: string
    zip: string
    city: string
    street: string
    houseNumber: string
    gpsLatitude: string
    gpsLongitude: string
    assetType: string
    certificatesCreatedForWh: number
    lastSmartMeterCO2OffsetRead: number
    cO2UsedForCertificate: number
    complianceRegistry: string
    otherGreenAttributes: string
    typeOfPublicSupport: string
}

export interface FlowActionDemandData {
    enabledProperties: boolean[]
    originator: string
    buyer: string
    startTime: number
    endTime: number
    timeFrame: string
    pricePerCertifiedWh: number
    currency: string
    producingAsset: number
    consumingAsset: number
    locationCountry: string
    locationRegion: string
    assettype: string
    minCO2Offset: number
    otherGreenAttributes: string
    typeOfPublicSupport: string
    targetWhPerPeriod: number
    matcher: string
    registryCompliance: string
}

export interface FlowActionMeterReadDataProducing extends FlowActionMeterReadData {
    co2Offset: number
}

export interface FlowActionMeterReadData {
    assetId: number
    meterreading: number
    filehash: string
}