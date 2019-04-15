fs = require('fs')
const { exec } = require('child_process');

Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

var elasticsearch = require('elasticsearch');
var elasticClient = new elasticsearch.Client({
    host: 'elasticsearch:9200'
})

var express = require('express');
var app = express();
const PORT = 3003

app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    next();
  });
app.listen(PORT, () => {
 console.log("Server running on port " + PORT);
});

app.get("/coo", (req, res, next) => {
    fs.readFile('contractConfig.json', 'utf8', (err, data) => {
        if (err) {
            res.status(404).json("CoO not yet migrated")
        } else {
            res.json({coo: JSON.parse(data).coo})
        }
    })
});

app.post("/coo", (req, res, next) => {
    console.log("Deploying CoO contracts")
    fs.writeFile('config/ewf-config.json', JSON.stringify(req.body.config, null, 4), function(err) {
        if (err) {
            res.status(403).json("Couldn't write config on backend")
        }
    })
    exec('npm run start-demo', (err, stdout, stderr) => {
        console.log(stdout)
        if (err) {
            res.status(500).json("Couldn't create CoO")
        } else {
            fs.readFile('contractConfig.json', 'utf8', (err, data) => {
                if (err) {
                    res.status(404).json("CoO not yet migrated")
                } else {
                    res.json({coo: JSON.parse(data).coo})
                }
            })
        }
    })
});

app.get("/account", (req, res, next) => {
    const account = fs.readFile('account.txt', 'utf8', (err, data) => {
        if (err) {
            res.status(404).json("Account not yet created")
        } else {
            res.json({account: data})
        }
    })
});

app.post("/account", (req, res, next) => {
    console.log("Creating new account now.")
    account = web3.eth.accounts.create()
    address = account['address']
    privateKey = account['privateKey']

    console.log('address:', address, 'privateKey:', privateKey)

    fs.writeFile('account.txt', address, function(err) {
        if (err) {
            res.status(500).json("Couldn't create account")
        } else {
            res.json({
                address: address,
                privateKey: privateKey
            })
        }
    })
});

app.put("/control", (req, res, next) => {
    addDocument(req.body)
    // give es some time to settle
    setTimeout(() => {
        res.json({
            status: 'success'
        })
    }, 2000)
})

function addDocument(data) {
    indexName = 'charging-control'
    docType = 'Command'
    elasticClient.index({
        index: indexName,
        type: docType,
        id: data['cs_id'],
        body: data
    })
}