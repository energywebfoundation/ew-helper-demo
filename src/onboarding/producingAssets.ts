// Copyright 2018 Energy Web Foundation
//
// This file is part of the Origin Application brought to you by the Energy Web Foundation,
// a global non-profit organization focused on accelerating blockchain technology across the energy sector, 
// incorporated in Zug, Switzerland.
//
// The Origin Application is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY and without an implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details, at <http://www.gnu.org/licenses/>.
//

// tslint:disable-next-line:missing-jsdoc
import { BlockchainProperties, AssetType, Compliance, ProducingAsset, ProducingAssetProperties, AssetProducingLogicTruffleBuild, User, UserLogicTruffleBuild } from 'ewf-coo'
import * as parse from 'csv-parse'
import * as fs from 'fs'
import { UserProperties } from 'ewf-coo/build/ts/blockchain-facade/User'

const Web3 = require('web3')

let blockchainProperties: BlockchainProperties
let web3
const parseUser = parse({ from: 2, delimiter: ';' }, async function (err, allData) { })

interface ExtraUserData extends UserProperties {
    privateKey?: string
}

const newOrganizations = {}

const producingAssetsToOnboard: ProducingAssetProperties[] = []

const parseUserCSV = async (): Promise<any> => {

    return new Promise<any>(resolve => {
        fs.createReadStream(process.cwd() + '/csv/assets.csv')
            .pipe(parse({ from: 2, delimiter: ';' }, function (err, allData) { }))
            .on('data', async (data) => {

                console.log(data)
                let owner = data[0]
                const assetTypeRaw = data[1]
                const capacityWh = Number(String(data[2]).replace(',', '')) * 1000
                const country = data[3]
                const region = data[4]
                const zip = data[5]
                const city = data[6]
                const street = data[7]
                const houseNumber = data[8]
                const geoCoords = String(data[9]).split(',')
                const comissionData = (data[10] !== '-') ? new Date(data[10]) : new Date(0)
                const certifiedBy = data[11]
                const publicSupport = data[12]
                const otherGreenAttributes = data[13]
                const smartMeter = data[14]
                const organization = data[15]

                let aType
                switch (String(assetTypeRaw)) {
                    case 'Wind': aType = AssetType.Wind
                                 break
                    case 'Hydro': aType = AssetType.RunRiverHydro
                                  break
                    case 'Bio': aType = AssetType.BiomassGas
                                break
                    default:
                        aType = AssetType.Solar
                }

                let comp
                switch (String(certifiedBy)) {
                    case 'TIGR':
                        comp = Compliance.TIGR
                        break
                    case 'IREC':
                        comp = Compliance.IREC
                        break
                    case 'EEC':
                        comp = Compliance.EEC
                        break
                    default:
                        comp = Compliance.none
                }

                /*
                let ethAccount
                if (owner === '') {
                    console.log('found empty owner!')

                    //       owner = '0x33496f621350cea01b18ea5b5c43c6c233c3f72d'

                    ethAccount = web3.eth.accounts.create()
                    console.log('created new owner-account:')
                    console.log('address: ' + ethAccount.address)
                    console.log('privateKey: ' + ethAccount.privateKey)
                    owner = ethAccount.address
                    const userProps: UserProperties = {
                        accountAddress: ethAccount.address,
                        firstName: String(' '),
                        surname: String(organization),
                        organization: String(organization),
                        street: String(street),
                        number: String(houseNumber),
                        zip: String(zip),
                        city: String(city),
                        country: String(country),
                        state: 'state',
                        roles: 16
                    }

                    console.log('trying to onboard user')
                    await User.CREATE_USER_RAW(userProps, blockchainProperties)
                    console.log('new user onboarded')

                    newOrganizations[organization] = ethAccount.address
                    console.log('orgs:')
                    console.log(newOrganizations)
                }
   */

                if (owner === '') {

                    //       owner = '0x33496f621350cea01b18ea5b5c43c6c233c3f72d'

                    const ethAccount = web3.eth.accounts.create()
                    owner = !newOrganizations[organization] ? ethAccount.address : newOrganizations[organization].accountAddress

                    // owner = newOrganizations.hasOwnProperty(organization) ? organization : ethAccount.address
                    // owner = newOrganizations[organization] ? newOrganizations[organization] : ethAccount.address
                    // owner = ethAccount.address

                    const userProps: ExtraUserData = {
                        accountAddress: ethAccount.address,
                        privateKey: ethAccount.privateKey,
                        firstName: String(' '),
                        surname: String(organization),
                        organization: String(organization),
                        street: String(street),
                        number: String(houseNumber),
                        zip: String(zip),
                        city: String(city),
                        country: String(country),
                        state: 'state',
                        roles: 16
                    }

                    if (!newOrganizations[organization])
                        newOrganizations[organization] = userProps

                }

                const assetProp: ProducingAssetProperties = {
                    owner: String(owner),
                    assetType: aType,
                    capacityWh: capacityWh,
                    country: String(country),
                    region: String(region),
                    zip: String(zip),
                    city: String(city),
                    street: String(street),
                    houseNumber: String(houseNumber),
                    gpsLatitude: String(geoCoords[0]),
                    gpsLongitude: String(geoCoords[1]),
                    operationalSince: (comissionData.getTime() / 1000),
                    typeOfPublicSupport: String(publicSupport),
                    otherGreenAttributes: String(otherGreenAttributes),
                    complianceRegistry: comp,
                    smartMeter: String(smartMeter),
                    active: true
                }

                producingAssetsToOnboard.push(assetProp)

            }).on('finish', function () {
                resolve()
            })
    })
}

const init = async () => {

    const contractConfig = JSON.parse(fs.readFileSync('contractConfig.json', 'utf-8').toString())

    const connectionConfig = JSON.parse(fs.readFileSync('config.json', 'utf-8').toString())

    blockchainProperties = {
        web3: web3,
        producingAssetLogicInstance: new web3.eth.Contract((AssetProducingLogicTruffleBuild as any).abi, contractConfig.producingAssetLogic),
        userLogicInstance: new web3.eth.Contract((UserLogicTruffleBuild as any).abi, contractConfig.userLogic),
        assetAdminAccount: web3.eth.accounts.privateKeyToAccount('0x' + connectionConfig.privateKey).address,
        topAdminAccount: web3.eth.accounts.privateKeyToAccount('0x' + connectionConfig.privateKey).address,
        privateKey: connectionConfig.privateKey,
        userAdmin: web3.eth.accounts.privateKeyToAccount('0x' + connectionConfig.privateKey).address

    }
}

const main = async () => {

    const configFile = JSON.parse(fs.readFileSync('config.json', 'utf-8').toString())

    web3 = new Web3(configFile.web3)

    await init()

    console.log('init done')
    await parseUserCSV()

    for (const index in newOrganizations) {

        await User.CREATE_USER_RAW(newOrganizations[index], blockchainProperties)

    }

    //  console.log('assets to onboard:' + producingAssetsToOnboard.length)
    //   console.log('found already ' + await ProducingAsset.GET_ASSET_LIST_LENGTH(blockchainProperties) + ' assets!')

    let i = 1
    for (const asset of producingAssetsToOnboard) {

        console.log('checking ' + i + ' asset in list')
        i += 1
        if (!await searchForAsset(asset)) {
            console.log('found undeployed asset')

            // console.log(asset)

            await ProducingAsset.CREATE_ASSET_RAW(asset, blockchainProperties)
        }
    }

    console.log(newOrganizations)

}

const searchForAsset = async (asset: ProducingAssetProperties): Promise<boolean> => {

    let result = false
    const onboardingAssets = await ProducingAsset.GET_ALL_ASSETS(blockchainProperties)

    for (const a of onboardingAssets) {
        result = (
            (a.smartMeter.toLowerCase() === asset.smartMeter.toLowerCase())
            && a.city === asset.city
            && a.country === asset.country
            && a.complianceRegistry === asset.complianceRegistry
            && a.assetType === asset.assetType
        )
        if (result) {
            console.log('asset already found: ' + a.id)
            break
        }
    }

    return result
}

main()