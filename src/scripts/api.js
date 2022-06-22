import algosdk from 'algosdk';
import constant from '../constants/network';
import { formatJsonRpcRequest } from '@json-rpc-tools/utils';
const { chunkString, str2bytes } = require('../contract/src');
const { LIBRARY_APP_ID_TESTNET } = require('../contract/src/converter/Constants');
const { pad } = require('../contract/src');

export const ChainType = {
    MainNet: constant[0].id,
    TestNet: constant[1].id,
};

const mainNetClient = new algosdk.Algodv2('', 'https://node.algoexplorerapi.io/', '');
const testNetClient = new algosdk.Algodv2('', 'https://node.testnet.algoexplorerapi.io/', '');

const mainNetClientIndexer = new algosdk.Indexer('', 'https://algoindexer.algoexplorerapi.io/', '');
const testNetClientIndexer = new algosdk.Indexer('', 'https://algoindexer.testnet.algoexplorerapi.io/', '');
export function clientForChain(chain) {
    switch (chain) {
        case ChainType.MainNet:
            return mainNetClient;
        case ChainType.TestNet:
            return testNetClient;
        default:
            throw new Error(`Unknown chain type: ${chain}`);
    }
}

export function clientForChainIndexer(chain) {
    switch (chain) {
        case ChainType.MainNet:
            return mainNetClientIndexer;
        case ChainType.TestNet:
            return testNetClientIndexer;
        default:
            throw new Error(`Unknown chain type: ${chain}`);
    }
}
export async function apiGetAccountAssets(chain, address) {
    const client = clientForChainIndexer(chain);

    const { account } = await client.lookupAccountByID(address).setIntDecoding(algosdk.IntDecoding.BIGINT).do();

    const algoBalance = account.amount; // bigint
    const assetsFromRes = account.assets || [];

    const assets = assetsFromRes.map(({ 'asset-id': id, amount, creator, frozen }) => ({
        id: Number(id),
        amount,
        creator,
        frozen,
        decimals: 0,
    }));

    assets.sort((a, b) => a.id - b.id);

    await Promise.all(
        assets.map(async (asset) => {
            const { params } = await client.lookupAssetByID(asset.id).do();
            if (!params) return;
            asset.name = params.name;
            asset.unitName = params['unit-name'];
            asset.url = params.url;
            asset.decimals = params.decimals;
        })
    );

    assets.unshift({
        id: 0,
        amount: algoBalance,
        creator: '',
        frozen: false,
        decimals: 6,
        name: 'Algo',
        unitName: 'Algo',
    });

    return assets;
}

export async function apiGetTxnParams(chain) {
    const params = await clientForChain(chain).getTransactionParams().do();
    return params;
}

export async function apiSubmitTransactions(chain, stxns) {
    const { txId } = await clientForChain(chain).sendRawTransaction(stxns).do();
    return await waitForTransaction(chain, txId);
}

async function waitForTransaction(chain, txId, timeout = 4) {
    const client = clientForChain(chain);
    let lastStatus = await client.status().do();
    let lastRound = lastStatus['last-round'];
    while (true) {
        console.log('Wait for confirm', lastStatus);

        const status = await client.pendingTransactionInformation(txId).do();

        if (status['pool-error']) {
            throw new Error(`Transaction Pool Error: ${status['pool-error']}`);
        }
        if (status['confirmed-round']) {
            return status['application-index'];
        }
        lastStatus = await client.statusAfterBlock(lastRound + 1).do();
        lastRound = lastStatus['last-round'];
    }
}

export async function lookupApplications(chain, appId) {
    const client = clientForChainIndexer(chain);
    const response = await client.lookupApplications(appId).includeAll(true).do();
    return response;
}

export async function searchForTransactionsByAppId({ chain, appId, limit, targetBlock, minRound }) {
    const client = clientForChainIndexer(chain);
    const response = await client
        .searchForTransactions()
        .applicationID(appId)
        .limit(limit)
        .round(targetBlock)
        .minRound(minRound)
        .do();
    return response;
}

//sdk path: `/v2/accounts/${this.address}/transactions/pending` ?
// export async function pendingTransactionByAddress(chain, address) {
//     const client = clientForChain(chain);
//     const response = await client.pendingTransactionByAddress(address).do();
//     return response;
// }

/*
    prepare signed txns before submitting
    input: txnsToSign: [[{txn},..]], walletconnect connector
    output: {signedTxns, signedTxnInfo}
*/
export const prepareSignedTransactions = async (txnsToSign, connector) => {
    //flatten txns
    const flatTxns = txnsToSign.reduce((acc, val) => acc.concat(val), []);
    const walletTxns = flatTxns.map(({ txn, signers, authAddr, message }) => ({
        txn: Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString('base64'),
        signers,
        authAddr,
        message,
    }));

    // sign transaction
    const requestParams = [walletTxns];
    const request = formatJsonRpcRequest('algo_signTxn', requestParams);
    const result = await connector.sendCustomRequest(request);

    const indexToGroup = (index) => {
        for (let group = 0; group < txnsToSign.length; group++) {
            const groupLength = txnsToSign[group].length;
            if (index < groupLength) {
                return [group, index];
            }

            index -= groupLength;
        }

        throw new Error(`Index too large for groups: ${index}`);
    };

    const signedPartialTxns = txnsToSign.map(() => []);
    try {
        result.forEach((r, i) => {
            const [group, groupIndex] = indexToGroup(i);
            const toSign = txnsToSign[group][groupIndex];
            if (r == null) {
                if (toSign.signers !== undefined && toSign.signers?.length < 1) {
                    signedPartialTxns[group].push(null);
                    return;
                }
                throw new Error(`Transaction at index ${i}: was not signed when it should have been`);
            }

            if (toSign.signers !== undefined && toSign.signers?.length < 1) {
                throw new Error(`Transaction at index ${i} was signed when it should not have been`);
            }

            const rawSignedTxn = Buffer.from(r, 'base64');
            signedPartialTxns[group].push(new Uint8Array(rawSignedTxn));
        });
    } catch (err) {
        console.log(err);
    }

    const signedTxns = signedPartialTxns.map((signedPartialTxnsInternal, group) => {
        return signedPartialTxnsInternal.map((stxn, groupIndex) => {
            if (stxn) {
                return stxn;
            }

            return signTxnWithTestAccount(txnsToSign[group][groupIndex].txn);
        });
    });
    const signedTxnInfo = signedPartialTxns.map((signedPartialTxnsInternal, group) => {
        return signedPartialTxnsInternal.map((rawSignedTxn, i) => {
            if (rawSignedTxn == null) {
                return null;
            }

            const signedTxn = algosdk.decodeSignedTransaction(rawSignedTxn);
            const txn = signedTxn.txn || algosdk.Transaction; //need check
            const txID = txn.txID();
            const unsignedTxID = txnsToSign[group][i].txn.txID();

            if (txID !== unsignedTxID) {
                throw new Error(
                    `Signed transaction at index ${i} differs from unsigned transaction. Got ${txID}, expected ${unsignedTxID}`
                );
            }

            if (!signedTxn.sig) {
                throw new Error(`Signature not present on transaction at index ${i}`);
            }

            return {
                txID,
                signingAddress: signedTxn.sgnr ? algosdk.encodeAddress(signedTxn.sgnr) : undefined,
                signature: Buffer.from(signedTxn.sig).toString('base64'),
            };
        });
    });

    return [signedTxns, signedTxnInfo];
};

export const submitSignedTransactions = async (signedTxns, txId, chain = 'testnet') => {
    if (signedTxns == null) {
        throw new Error('Transactions to submit are null');
    }
    for (let index = 0; index < signedTxns.length; index++) {
        try {
            let signedTxn = signedTxns[index];

            const appId = await apiSubmitTransactions(chain, signedTxn);
            return { txId, appId };
        } catch (err) {
            throw new Error(err);
        }
    }
};

export const addTokenAppCall = async (client, dataStoreApp, address, args, connector, chain) => {
    const params = await client.getTransactionParams().do();
    const txns = [];
    const chunkTArray = chunkString(args[1]);
    const chunkIArray = chunkString(args[2]);
    for (let i = 0; i < chunkTArray.length; i++) {
        const tmpArg = [str2bytes(chunkTArray[i]), str2bytes(chunkIArray[i])];
        txns.push(algosdk.makeApplicationNoOpTxn(address, params, dataStoreApp, tmpArg));
    }
    const appArgs = [str2bytes('add_token'), str2bytes(args[0])];
    txns.push(algosdk.makeApplicationNoOpTxn(address, params, LIBRARY_APP_ID_TESTNET, appArgs));

    //check whether there is hArray list
    const lastArgs = [str2bytes('store_hash_and_hint')];
    if (args[3]) lastArgs.push(str2bytes(args[3]));
    txns.push(algosdk.makeApplicationNoOpTxn(address, params, dataStoreApp, lastArgs));

    const txgroup = algosdk.assignGroupID(txns);

    const txnsToSign = [
        txns.map((txn) => ({
            txn,
        })),
    ];

    const [signedTxns, signedTxnInfo] = await prepareSignedTransactions(txnsToSign, connector);

    return submitSignedTransactions(signedTxns, signedTxnInfo[0][0].txID, chain);
};

// args[0]: str2bytes('store_hint'), args[1]: hint list (after toListHintArray function)
export const addHintAppCall = async (client, dataStoreApp, address, args, connector, chain) => {
    const params = await client.getTransactionParams().do();
    const txns = [];
    txns.push(algosdk.makeApplicationNoOpTxn(address, params, dataStoreApp, args));
    for (let i = 0; i < 15; i++) {
        const tmpArg = [str2bytes('buff_add_hint' + i), str2bytes('app' + i)];
        txns.push(algosdk.makeApplicationNoOpTxn(address, params, dataStoreApp, tmpArg));
    }
    algosdk.assignGroupID(txns);
    const txnsToSign = [
        txns.map((txn) => ({
            txn,
        })),
    ];

    const [signedTxns, signedTxnInfo] = await prepareSignedTransactions(txnsToSign, connector);

    return submitSignedTransactions(signedTxns, signedTxnInfo[0][0].txID, chain);
};

export const fireTransitionAppCall = async (
    client,
    dataStoreApp,
    sender,
    args,
    fireableTransitionArr,
    connector,
    chain,
    hintIndex,
    numberOfTx = 16
) => {
    const params = await client.getTransactionParams().do();
    let txns = [];
    const chunkTArray = chunkString(args[0]);
    const chunkIArray = chunkString(args[1]);

    for (let i = 0; i < chunkTArray.length; i++) {
        txns.push(
            algosdk.makeApplicationNoOpTxn(sender, params, dataStoreApp, [
                str2bytes(chunkTArray[i]),
                str2bytes(chunkIArray[i]),
            ])
        );
    }

    fireableTransitionArr.forEach((fireableTransition, index) => {
        const appArgs = [str2bytes('fire_transition'), str2bytes(pad(index + Number(hintIndex), 2))];
        txns.push(
            algosdk.makeApplicationNoOpTxn(
                sender,
                params,
                LIBRARY_APP_ID_TESTNET,
                appArgs,
                undefined,
                [dataStoreApp],
                undefined,
                str2bytes(JSON.stringify(fireableTransition))
            )
        );
    });

    txns.push(algosdk.makeApplicationNoOpTxn(sender, params, dataStoreApp, [str2bytes('store_hash_and_hint')]));

    for (let i = 0; i < 16 - 5 - args[2].length; i++) {
        txns.push(
            algosdk.makeApplicationNoOpTxn(sender, params, dataStoreApp, [str2bytes('buff' + i), str2bytes('app')])
        );
    }

    txns = txns.slice(0, numberOfTx);

    const txgroup = algosdk.assignGroupID(txns);

    const txnsToSign = [
        txns.map((txn) => ({
            txn,
        })),
    ];
    const [signedTxns, signedTxnInfo] = await prepareSignedTransactions(txnsToSign, connector);

    return submitSignedTransactions(signedTxns, signedTxnInfo[0][0].txID, chain);
};

export const signFireTransitionTxns = async (
    client,
    dataStoreApp,
    sender,
    args,
    fireableTransitionArr,
    connector,
    chain,
    hintIndex,
    numberOfTx = 16
) => {
    const params = await client.getTransactionParams().do();
    let txns = [];
    const chunkTArray = chunkString(args[0]);
    const chunkIArray = chunkString(args[1]);

    for (let i = 0; i < chunkTArray.length; i++) {
        txns.push(
            algosdk.makeApplicationNoOpTxn(sender, params, dataStoreApp, [
                str2bytes(chunkTArray[i]),
                str2bytes(chunkIArray[i]),
            ])
        );
    }

    fireableTransitionArr.forEach((fireableTransition, index) => {
        const appArgs = [str2bytes('fire_transition'), str2bytes(pad(index + Number(hintIndex), 2))];
        txns.push(
            algosdk.makeApplicationNoOpTxn(
                sender,
                params,
                LIBRARY_APP_ID_TESTNET,
                appArgs,
                undefined,
                [dataStoreApp],
                undefined,
                str2bytes(JSON.stringify(fireableTransition))
            )
        );
    });

    txns.push(algosdk.makeApplicationNoOpTxn(sender, params, dataStoreApp, [str2bytes('store_hash_and_hint')]));

    for (let i = 0; i < 16 - 5 - fireableTransitionArr.length; i++) {
        txns.push(
            algosdk.makeApplicationNoOpTxn(sender, params, dataStoreApp, [str2bytes('buff' + i), str2bytes('app')])
        );
    }

    txns = txns.slice(0, numberOfTx);

    const txgroup = algosdk.assignGroupID(txns);

    const txnsToSign = [
        txns.map((txn) => ({
            txn,
        })),
    ];
    const [signedTxns, signedTxnInfo] = await prepareSignedTransactions(txnsToSign, connector);
    return [signedTxns, signedTxnInfo];
    // return submitSignedTransactions(signedTxns, signedTxnInfo[0][0].txID, chain);
};

function base64Decode(str) {
    return Buffer.from(str, 'base64').toString('ascii');
}

export function decodeGlobalState(json) {
    const result = {};
    for (let i = 0; i < json.length; i++) {
        if (json[i].value.type === 1)
            result[base64Decode(json[i].key)] = new Uint8Array(Buffer.from(json[i].value.bytes, 'base64'));
        else result[base64Decode(json[i].key)] = json[i].value.uint;
    }
    return result;
}

export async function getGlobalState(chain, appId) {
    const indexerClient = clientForChainIndexer(chain);
    const globalState = await indexerClient.lookupApplications(appId).do();
    const json = globalState.application.params['global-state'];
    return decodeGlobalState(json);
}
