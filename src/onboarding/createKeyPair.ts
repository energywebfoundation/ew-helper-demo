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
import * as fs from 'fs'

const main = async () => {

    const Web3 = require('web3')
    const configFile = JSON.parse(fs.readFileSync('config.json', 'utf-8').toString())

    const web3 = new Web3(configFile.web3)

    const ethAccount = web3.eth.accounts.create()

    console.log('created new account:')
    console.log('address:\n ' + ethAccount.address)
    console.log('\nprivateKey:\n ' + ethAccount.privateKey + '\n')

}

main()