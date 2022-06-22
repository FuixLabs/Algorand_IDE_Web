import { apiGetTxnParams, ChainType, clientForChain } from '../../scripts/api';
import algosdk from 'algosdk';
import Constants from '../../util/Constant';
import mainContract from '../../contract/assets/data-store.teal';
import clearContract from '../../contract/assets/clear.teal';
import { ComputeEngineConvertor, str2bytes } from '../../contract/src';
const { wrapStoreDataProgram } = require('../../contract/utils/offchainService');
const { LIBRARY_APP_ID_TESTNET } = require('../../contract/src/converter/Constants');

export const testAccounts = [
    algosdk.mnemonicToSecretKey(
        'cannon scatter chest item way pulp seminar diesel width tooth enforce fire rug mushroom tube sustain glide apple radar chronic ask plastic brown ability badge'
    ),
    algosdk.mnemonicToSecretKey(
        'person congress dragon morning road sweet horror famous bomb engine eager silent home slam civil type melt field dry daring wheel monitor custom above term'
    ),
    algosdk.mnemonicToSecretKey(
        'faint protect home drink journey humble tube clinic game rough conduct sell violin discover limit lottery anger baby leaf mountain peasant rude scene abstract casual'
    ),
];

const approvalProgramSource = async () => {
    return await (await fetch(mainContract)).text();
};

const clearProgramSource = async () => {
    return await (await fetch(clearContract)).text();
};

async function compileProgram(client, programSource) {
    let encoder = new TextEncoder();
    let programBytes = encoder.encode(programSource);
    let compileResponse = await client.compile(programBytes).do();
    let compiledBytes = new Uint8Array(Buffer.from(compileResponse.result, 'base64'));
    return compiledBytes;
}

const waitForConfirmation = async function (algodClient, txId, timeout) {
    if (algodClient == null || txId == null || timeout < 0) {
        throw new Error('Bad arguments');
    }

    const status = await algodClient.status().do();
    if (status === undefined) {
        throw new Error('Unable to get node status');
    }

    const startround = status['last-round'] + 1;
    let currentround = startround;

    while (currentround < startround + timeout) {
        const pendingInfo = await algodClient.pendingTransactionInformation(txId).do();
        if (pendingInfo !== undefined) {
            if (pendingInfo['confirmed-round'] !== null && pendingInfo['confirmed-round'] > 0) {
                //Got the completed Transaction
                return pendingInfo;
            } else {
                if (pendingInfo['pool-error'] != null && pendingInfo['pool-error'].length > 0) {
                    // If there was a pool error, then the transaction has been rejected!
                    throw new Error('Transaction ' + txId + ' rejected - pool error: ' + pendingInfo['pool-error']);
                }
            }
        }
        await algodClient.statusAfterBlock(currentround).do();
        currentround++;
    }
    throw new Error('Transaction ' + txId + ' not confirmed after ' + timeout + ' rounds!');
};

const getAppIndex = (chain) => {
    if (chain === ChainType.MainNet) {
        return 305162725;
    }

    if (chain === ChainType.TestNet) {
        return 22314999;
    }

    throw new Error(`App not defined for chain ${chain}`);
};
const signTxnWithTestAccount = (txn) => {
    const sender = algosdk.encodeAddress(txn.from.publicKey);

    for (const testAccount of testAccounts) {
        if (testAccount.addr === sender) {
            return txn.signTxn(testAccount.sk);
        }
    }

    throw new Error(`Cannot sign transaction from unknown test account: ${sender}`);
};
const deployAppCall = async (chain, address, { elements, computeEngine }, IPFS) => {
    let computeEngineConvertor = new ComputeEngineConvertor(computeEngine);

    const { markingsToTokenIndex, tokenArray, indexArray } = computeEngineConvertor.markingsToTokenArray();
    computeEngine.MarkingsToTokenIndex = markingsToTokenIndex;
    computeEngine.TokenArray = tokenArray;
    computeEngine.IndexArray = indexArray;

    computeEngineConvertor = new ComputeEngineConvertor(computeEngine);

    let computeEngineURI = '';
    if (IPFS) {
        const results = await IPFS.add(JSON.stringify({ elements, computeEngine }));
        computeEngineURI = Constants.ipfsHost + results.path;
    } else {
        computeEngineURI = JSON.stringify({ elements, computeEngine });
    }

    // Convert to Algorand Arguments
    let tArray = computeEngineConvertor.tokensToArguments();
    const bArray = computeEngineConvertor.variablesToArguments();
    let iArray = computeEngineConvertor.indexArrayToArguments();
    const fireablePlaceId = computeEngineConvertor.fireablePlaceIdToArguments();
    const eArray = computeEngineConvertor.expressionToEArray();
    const gArray = computeEngineConvertor.guardsToGArray();
    const bIArray = computeEngineConvertor.variablesToIndex();

    let dataStoreProgram = await approvalProgramSource();

    dataStoreProgram = wrapStoreDataProgram(
        dataStoreProgram,
        bArray,
        gArray,
        eArray,
        bIArray,
        fireablePlaceId,
        LIBRARY_APP_ID_TESTNET
    );

    let client = clientForChain(chain);
    const suggestedParams = await apiGetTxnParams(chain);

    suggestedParams.fee = 1000;
    suggestedParams.flatFee = true;
    const onComplete = algosdk.OnApplicationComplete.NoOpOC;
    const approvalProgram = await compileProgram(client, dataStoreProgram);
    const clearProgram = await compileProgram(client, await clearProgramSource());
    const extraPage = Math.trunc(approvalProgram.length / 2048);

    let txn = algosdk.makeApplicationCreateTxn(
        address,
        suggestedParams,
        onComplete,
        approvalProgram,
        clearProgram,
        0,
        0,
        2,
        62,
        [str2bytes(tArray), str2bytes(iArray)],
        undefined,
        undefined,
        undefined,
        str2bytes(computeEngineURI),
        undefined,
        undefined,
        extraPage
    );
    let txgroup = algosdk.assignGroupID([txn]);
    const txnsToSign = [{ txn }];
    return [txnsToSign];
};

export {
    approvalProgramSource,
    clearProgramSource,
    compileProgram,
    waitForConfirmation,
    signTxnWithTestAccount,
    getAppIndex,
    deployAppCall,
};
