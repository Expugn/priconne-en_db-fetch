const http = require('http');
const fs = require('fs');
const path = require('path');

const python_tools = require('./python-tools/python-tools');

const database_dir = "out";
const _max_test_amount = 20;

run();

function run() {
    update_database().then(() => {
        console.log('SUCCESSFULLY UPDATED DATABASE');
    });
}

function update_database() {
    return new Promise(async function(resolve) {
        // CHECK IF DATABASE DIRECTORY EXISTS
        if (!fs.existsSync(database_dir)) {
            fs.mkdirSync(database_dir);
        }

        // READ CURRENT DATABASE VERSION
        let current_version;
        const version_file = path.join(database_dir, 'version');
        if (fs.existsSync(version_file)) {
            // DATABASE VERSION FILE EXISTS
            const json = JSON.parse(fs.readFileSync(version_file, 'utf8'));
            current_version = {
                truth_version: json['truth_version'],
                hash: json['hash'],
            };
            console.log('EXISTING VERSION FILE FOUND: CURRENT TRUTH VERSION =', current_version['truth_version']);
        }
        else {
            // DATABASE VERSION FILE DOES NOT EXIST, START FROM SCRATCH
            current_version = {
                truth_version: 10000000,
                hash: ''
            };
            console.log('VERSION FILE NOT FOUND. USING TRUTH VERSION', current_version['truth_version']);
        }

        console.log('CHECKING FOR DATABASE UPDATES...');
        let truth_version = parseInt(current_version['truth_version']);
        (async () => {
            function request(guess) {
                return new Promise((resolve) => {
                    http.request({
                        host: 'assets-priconne-redive-us.akamaized.net',
                        path: '/dl/Resources/' + guess + '/Jpn/AssetBundles/iOS/manifest/manifest_assetmanifest',
                        method: 'GET',
                    }, (res) => {
                        resolve(res);
                    }).end();
                });
            }

            // FIND NEW TRUTH VERSION
            const max_test = _max_test_amount;
            const test_multiplier = 10;
            for (let i = 1 ; i <= max_test ; i++) {
                const guess = truth_version + (i * test_multiplier);
                console.log('[GUESS]'.padEnd(10), guess, '(' + i + '/' + max_test + ')');
                const res = await request(guess);
                if (res.statusCode === 200) {
                    console.log('[SUCCESS]'.padEnd(10), guess, ' RETURNED STATUS CODE 200 (VALID TRUTH VERSION)');

                    // RESET LOOP
                    truth_version = guess;
                    i = 0;
                }
            }
        })().then(() => {
            console.log('VERSION CHECK COMPLETE ; LATEST TRUTH VERSION =', truth_version);

            // CHECK IF LATEST TRUTH VERSION IS DIFFERENT FROM CURRENT
            if (truth_version === current_version['truth_version']) {
                console.log('NO UPDATE FOUND, MUST BE ON THE LATEST VERSION!');
            }

            let bundle = '';
            http.request({
                host: 'assets-priconne-redive-us.akamaized.net',
                path: '/dl/Resources/' + truth_version + '/Jpn/AssetBundles/Android/manifest/masterdata_assetmanifest',
                method: 'GET',
            }, (res) => {
                res.on('data', function(chunk) {
                    bundle += Buffer.from(chunk).toString();
                });
                res.on('end', () => {
                    const b = bundle.split(',');
                    const hash = b[1];

                    // UPDATE VERSION FILE
                    current_version = {
                        truth_version: truth_version,
                        hash: hash,
                    };
                    fs.writeFile(version_file, JSON.stringify(current_version), function (err) {
                        if (err) throw err;
                    });

                    // DOWNLOAD FILES
                    download_DB(hash).then(() => {
                        // DATABASE UPDATE COMPLETE
                        resolve();
                    });
                });
            }).end();
        });

        function download_DB(hash) {
            return new Promise(async function(resolve) {
                const cdb_path = path.join(database_dir, 'master.unity3d');
                const db_path = path.join(database_dir, 'master.db');
                const file = fs.createWriteStream(cdb_path);
                http.get('http://assets-priconne-redive-us.akamaized.net/dl/pool/AssetBundles/' + hash.substr(0, 2) + '/' + hash, function(response) {
                    const stream = response.pipe(file);
                    stream.on('finish', async () => {
                        // CONVERT .unity3d TO .db
                        await python_tools.deserialize(cdb_path, db_path);
                        resolve();
                    });
                });
            });
        }
    });
}