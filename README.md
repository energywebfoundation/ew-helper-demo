# EWF - COO - DEMO

## Introduction 

This repo is for demonstration purposes and to show how the certificate of origin can work. This repo will:
* deploy and setup all required smart contracts with the provided private key
* start the example matcher automatically
* onboard users, consuming- and producing assets
* create demands
* set meterreading of both consuming- and producing assets

Currently the repo will <b>not</b> start the ui. You still have to do this by yourself. 

After you clone this repo you have to run the command <code>npm install</code>. It will install all the required dependencies.

When the command is finished you have to start a blockchain:
* ganache / testrpc: to run this testchain simply run the command <code>npm run start-ganache</code>
* parity: if you're using docker you can run the command <code>npm run parity-docker</code>
* your own blockchain client connected to any ethereum-like chain (e.g. Tobalaba)

This demo is using raw-transactions, so you don't have to unlock your accounts in the blockchain-client. Because this demo was developed with Tobalaba in mind the current gasPrice is set to 0 thus enabling sending transaction from accounts without any balance.<br>
Currently the demo is configured to use the port <code>8545</code>. In case you're using your own client please make sure that the client is listening to that port. <br>
We strongly recommend to change the keys included in this repo when running on a public chain (see configuration)

## Configuration

The configuration and flow of actions is done with the file [ewf-config.json](config/ewf-config.json) in the config-folder. 

The following keys are required: 
* topAdminPrivateKey: the private key of the topAdmin 
* matcherPrivateKey: the private key for the used matcher
* flow: an array with flow actions. They will get executed in the ordering within the config-file

### flow actions

Every flowaction has two entries: 
* <code>type</code>: the action type
* <code>data</code>: the corresponding data for the action type

Currently the following action types are supported:
* CREATE_ACCOUNT
* CREATE_CONSUMING_ASSET
* CREATE_PRODUCING_ASSET
* CREATE_DEMAND
* SAVE_SMARTMETER_READ_PRODUCING
* SAVE_SMARTMETER_READ_CONSUMING
* SLEEP

#### CREATE_ACCOUNT
usage: command to onboard a new user <br>
params: 
* <code>firstName</code>: the first name of a user 
* <code>surname</code>: the surname of a user
* <code>organization</code>: the organization of a user
* <code>street</code> the streetname of the organization
* <code>number</code> the housenumber of the organization
* <code>zip</code> the zipcode of the organization
* <code>city</code> the city of the organization,
* <code>country</code> the country of the organization
* <code>state</code> the state of the organization
* <code>address</code> the ethereum address of the user
* <code>privateKey</code> the corresponding private key of an
* <code>rights</code> the bitmask with rights

#### example:
Onboard the user <code>John Doe</code> working for the <code>UserAdmin Organization</code> which is located in <code>Main Street 1, 01234 Anytown, anstate, USA</code>

<code>
<br>{
<br>"type": "CREATE_ACCOUNT",
<br>"data": {
<br>"firstName": "John",
<br>"surname": "Doe",
<br>"organization": "UserAdmin Organization",
<br>"street": "Main Street",
<br>"number": 1,
<br>"zip": "01234",
<br>"city": "Anytown",
<br>"country": "USA",
<br>"state": " anystate",
<br>"address": "0x71c31ff1faa17b1cb5189fd845e0cca650d215d3",
<br>"privateKey:" "0xbfb423a193614c6712efd02951289192c20d70b3fc8a8b7cdee7360ead486",
<br>"rights": 2
<br>}
<br>}
</code>

### CREATE_CONSUMING_ASSET
usage: command to onboard a new consuming asset
<br>params:
* <code>smartMeter</code>: ethereum address of the used smart meter
* <code>smartMeterPK</code>: the private Key of the smart meter (needed for simulating meterreadings)
* <code>owner</code>: the owner of an asset (has to have the asset manager rights)
* <code>operationalSince</code>: the unix-timestamp when the asset went into operation mode
* <code>capacityWh</code>: maximal capcity of an asset
* <code>lastSmartMeterReadWh</code>: the last meterreading, should be 0
* <code>active</code>: flag if the the asset is active
* <code>lastSmartMeterReadFileHash</code>: the last filehash
* <code>country</code>: the country where the asset is located
* <code>region</code>: the region where the asset is located
* <code>zip</code>: the zipcode of the city where the asset is located
* <code>city</code>: the city where the asset is located
* <code>street</code>: the street where the asset is located
* <code>houseNumber</code>: the housenumber of the asset
* <code>gpsLatitude</code>: the latitude of the asset as string
* <code>gpsLongitude</code>: the longitude of the asset as string
* <code>maxCapacitySet</code>: flag if the maximal capacity is set
* <code>certificatesUsedForWh</code>: amount of certificates already used by the consuming asset, will be 0 in most cases

#### example
Onboard a new consuming asset for the owner <code>0x33496f621350cea01b18ea5b5c43c6c233c3f72d (John Doe Four of the AssetManager Organization)
</code>. The asset has a smart meter connected with the ethereum account <code>0x1112ec367b20d2bffd40ee11523c3d36d61adf1b</code>. We're also passing the private key <code>50764e302e4ed8ce624003deca642c03ce06934fe77585175c5576723f084d4c</code> of that smart meter because we want to log new data within the demonstration.<br>
The smart meter is active since 06/28/2018 (<code>1529971200</code>), has the capactiy of <code>5000</code> and is active. Because we're freshly deploying that asset, it does not have a meterreading thus no need for a filehash. <br>
The asset is located in <code>Main Street 11, 01234 Anytown, AnyState, USA</code>. If you're passing the some GPS coordinates, you will see the location of the asset within the webapplication in the consuming asset detail view. 

<code>
<br>{
<br>"type": "CREATE_CONSUMING_ASSET",
<br>"data": {
<br>"smartMeter": "0x1112ec367b20d2bffd40ee11523c3d36d61adf1b",
<br>"smartMeterPK": "50764e302e4ed8ce624003deca642c03ce06934fe77585175c5576723f084d4c",
<br>"owner": "0x33496f621350cea01b18ea5b5c43c6c233c3f72d",
<br>"operationalSince": "1529971200",
<br>"capacityWh": 5000,
<br>"lastSmartMeterReadWh": 0,
<br>"active": true,
<br>"lastSmartMeterReadFileHash": "",
<br>"country": "USA",
<br>"region": "AnyState",
<br>"zip": "01234",
<br>"city": "Anytown",
<br>"street": "Main Street",
<br>"houseNumber": 11,
<br>"gpsLatitude": "0",
<br>"gpsLongitude": "0",
<br>"maxCapacitySet": true,
<br>"certificatesUsedForWh": 0
<br>}
<br>}
</code>

### CREATE_PRODUCING_ASSET
usage: command to onboard a new producing asset
<br>params:
* <code>smartMeter</code>: ethereum address of the smart meter
* <code>smartMeterPK</code>: private key of the ethereum address (needed to simuate meterreading)
* <code>owner</code>: ethereum address of the owner of the asset, has to have to asset manager rights
* <code>operationalSince</code>: UNIX-timestamp when the asset entered service
* <code>capacityWh</code>: capacity of the asset
* <code>lastSmartMeterReadWh</code>: last meterreading in Wh
* <code>active</code>: flag if the asset is enabled
* <code>lastSmartMeterReadFileHash</code>: last filehash
* <code>country</code>: country where the asset is located
* <code>region</code>: region where the asset is located
* <code>zip</code>: zipcode of the city where the asset is located
* <code>city</code>: city where the asset is located
* <code>street</code>: street where the asset is located
* <code>houseNumber</code>: housenumber where the asset is located
* <code>gpsLatitude</code>: latitude of the asset as string
* <code>gpsLongitude</code>: longitude of the asset as string
* <code>assetType</code>: Type of asset as string (Wind,
    Solar,
    RunRiverHydro,
    BiomassGas)
* <code>certificatesCreatedForWh</code>: amount of certificates created for wh
* <code>lastSmartMeterCO2OffsetRead</code>: last CO2 offset read
* <code>cO2UsedForCertificate</code>: amount of CO2 already used for certificates
* <code>complianceRegistry</code>: complaince as string (none,
    IREC,
    EEC,
    TIGR)
* <code>otherGreenAttributes</code>: green attributes as string
* <code>typeOfPublicSupport</code>: type of public support as string

#### example
Onboard a new energy producing asset for the owner <code>0x33496f621350cea01b18ea5b5c43c6c233c3f72d (John Doe Four of the AssetManager Organization)
</code>. The asset has a smart meter connected with the ethereum account <code>0x1112ec367b20d2bffd40ee11523c3d36d61adf1b</code>. We're also passing the private key <code>50764e302e4ed8ce624003deca642c03ce06934fe77585175c5576723f084d4c</code> of that smart meter because we want to log new data within the demonstration.<br>
The asset has a capacity of <code>10000</code> Wh and went into producition on <code>01/01/2018 (1514764800)</code>. It's some kind of BiomassGas-powerplant and is compliant to TIGR. In addition, it has the green Attributes of <code>N.A.</code> and also the <code>N.A.</code> type of public support. Because we're freshly deploying that asset, it does not have a meterreading thus no need for a filehash. <br>
The asset is located in <code>Main Street 11, 01234 Anytown, AnyState, USA</code>. If you're passing the some GPS coordinates, you will see the location of the asset within the webapplication in the consuming asset detail view.

<code>
<br>{
<br>type": "CREATE_PRODUCING_ASSET",
<br>data": {
<br>smartMeter": "0x00f4af465162c05843ea38d203d37f7aad2e2c17",
<br>smartMeterPK": "09f08bc14bfdaf427fdd0eb676db21a86fa908a25870158345e4f847b5ada35e",
<br>owner": "0x33496f621350cea01b18ea5b5c43c6c233c3f72d",
<br>operationalSince": 1514764800,
<br>capacityWh": 10000,
<br>lastSmartMeterReadWh": 0,
<br>active": true,
<br>lastSmartMeterReadFileHash": "",
<br>country": "USA",
<br>region": "AnyState",
<br>zip": "01234",
<br>city": "Anytown",
<br>street": "Main Street",
<br>houseNumber": 10,
<br>gpsLatitude": "0",
<br>gpsLongitude": "0",
<br>assetType": "BiomassGas",
<br>certificatesCreatedForWh": 0,
<br>lastSmartMeterCO2OffsetRead": 0,
<br>cO2UsedForCertificate": 0,
<br>complianceRegistry": "TIGR",
<br>otherGreenAttributes": "N.A.",
<br>typeOfPublicSupport": "N.A"
<br>}
<br>}
</code>

### CREATE_DEMAND
usage: command to onboard a new demand
<br>params:
* <code>enabledProperties</code>: boolean array with 10 flags (depending on which demand properties should be enabled)
* <code>originator</code>: the originator (if set) for producing energy (<code>enabledProperties[0]</code>). If false this value is ignored but there has to be a value
* <code>assettype"</code>: assetTime which should have produced the certificate (<code>enabledProperties[1]</code>). If false this value is ignored but there has to be a value
* <code>registryCompliance</code>: compliance that the certificate should have (<code>enabledProperties[2]</code>). If false this value is ignored but there has to be a value
* <code>locationCountry</code>: country where the certificate should come from (<code>enabledProperties[3]</code>). If false this value is ignored but there has to be a value
* <code>locationRegion</code>: state where the certificate should come from (<code>enabledProperties[4]</code>). If false this value is ignored but there has to be a value
* <code>minCO2Offset</code>: minimum amount of CO2 offset (<code>enabledProperties[5]</code>). If false this value is ignored but there has to be a value
* <code>producingAsset</code>: assetId of a producing asset (<code>enabledProperties[6]</code>). If false this value is ignored but there has to be a value
* <code>consumingAsset</code>: assetID of a consuming asset (<code>enabledProperties[7]</code>). If false this value is ignored but there has to be a value
* <code>otherGreenAttributes</code>: other green attributes that the certificate should posess (<code>enabledProperties[8]</code>). If false this value is ignored but there has to be a value
* <code>typeOfPublicSupport</code>: type of public support that the certificate should posess (<code>enabledProperties[9]</code>). If false this value is ignored but there has to be a value
* <code>buyer</code>: the buyer of certificates
* <code>startTime</code>: UNIX-timestamp when the demand is enabled
* <code>endTime</code>: UNIX-timestamp when the demand will be automatically disabled
* <code>timeFrame</code>: timeframe for demands (yearly, monthly, daily) as string
* <code>pricePerCertifiedWh</code>: agreed price 
* <code>currency</code>: used currency (Euro, USD, SingaporeDollar, Ether) as string
* <code>targetWhPerPeriod</code>: amount of energy per period in Wh
* <code>matcher</code>: ethereum-address of the matcher (matcher has to have to rights)

#### example
We want to create a new demand. This is the very basic one, so all demand Properties are disabled <code>enabledProperties": [false, false, false, false, false, false, false, false, false, false]</code>. This demand will accept energy from any originator, any assetType, any compliance, any country and region, any CO2-offset from any producing asset. It will also accept any kind of other green attribute and any type of public support. <br>
The buyer will be <code>0xfeebf1e463e39d09d5f8a40a6ed08d604ab01360 (John Doe Six from the Trader Organization)"</code> and the demand will be active between <code>1529928570 (25/06/2018)</code> and <code>1530403200 01/07/2018</code>. The buyer agrees to buy certificates until he reaches <code>100000</code> Wh <code>daily</code>. The creator chose the matcher <code>0x585cc5c7829b1fd303ef5c019ed23815a205a59e</code>.

<code>
 <br>{
<br>"type": "CREATE_DEMAND",
<br>"data": {
<br>"enabledProperties": [false, false, false, false, false, false, false, false, false, false],
<br>"originator": "0x33496f621350cea01b18ea5b5c43c6c233c3f72d",
<br>"buyer": "0xfeebf1e463e39d09d5f8a40a6ed08d604ab01360",
<br>"startTime": 1529928570,
<br>"endTime": 1530403200,
<br>"timeFrame": "daily",
<br>"pricePerCertifiedWh": 1000,
<br>"currency": "USD",
<br>"producingAsset": 0,
<br>"consumingAsset": 0,
<br>"locationCountry": "USA",
<br>"locationRegion": "Anystate",
<br>"assettype": "Wind",
<br>"minCO2Offset": 10,
<br>"otherGreenAttributes": "N.A.",
<br>"typeOfPublicSupport": "N.A",
<br>"targetWhPerPeriod": 100000,
<br>"matcher": "0x585cc5c7829b1fd303ef5c019ed23815a205a59e",
<br>"registryCompliance": "none"
<br>}
<br>}
</code>

### SAVE_SMARTMETER_READ_CONSUMING
usage: command store a new meterreading of an consuming asset
<br>params:
* <code>assetId</code>: the assetID for the meterreading 
* <code>meterreading</code>: the amount of energy to be logged (counter)
* <code>filehash</code>: the filehash

#### example
We want to log a new meterreading for the consuming asset with id <code>1</code>. The new meterreading will be <code>100000</code> Wh with the filehash <code>newMeterRead</code>. 
Keep in mind that the meterrading is not doing any addition, so the meterreading you pass here will be the new reading of the asset. 
<code>
<br>{
<br>"type": "SAVE_SMARTMETER_READ_CONSUMING",
<br>"data": {
<br>"assetId": 0,
<br>"meterreading": 100000,
<br>"filehash": "newMeterRead"
<br>}
<br>}
</code>

### SAVE_SMARTMETER_READ_PRODUCING
usage: command store a new meterreading of an producing asset
<br>params:
* <code>assetId</code>: the assetID for the meterreading 
* <code>meterreading</code>: the amount of energy to be logged (counter)
* <code>filehash</code>: the filehash
* <code>co2Offset</code>: the new CO2 meterreading

#### example
We want to log a new meterreading for the producing asset with id <code>1</code>. The new meterreading will be <code>100000</code> Wh with the filehash <code>newMeterRead</code>. The new CO2-Offset of the asset will be <code>10</code>.
Keep in mind that the meterrading is not doing any addition, so the meterreading you pass here will be the new reading of the asset. 

<code>
<br>{
<br>"type": "SAVE_SMARTMETER_READ_CONSUMING",
<br>"data": {
<br>"assetId": 0,
<br>"meterreading": 100000,
<br>"filehash": "newMeterRead",
<br>"co2Offset": 10
<br>}
<br>}
</code>

#### SLEEP
usage: command to pause the flow for a certain amount of time
<br>params: 
* <code>data</code>: amount of ms to sleep

#### example
We want to pause the flow for <code>2</code> secondss

<code>{"type": "SLEEP", "data": 2000}</code>

## starting the demo
Once all the actions are set within the config-file simply run <code>npm run start-demo</code>. It will freshly deploy all contracts and setup everything for you. After this is done, it will automatically run all the flow-actions. <br>
<b>The demo application won't stop itself after the flowactions were finished.</b>

