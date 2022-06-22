const { VALUE_TYPE } = require('../contract/src/converter/Constants');
const { str2bytes } = require('../contract/src');

function dec2hex(dec) {
    return dec.toString(16).padStart(2, '0');
}

const getId = () => {
    var arr = new Uint8Array(40 / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('');
};

const bytesToString = (array) => String.fromCharCode.apply(null, array);

const uint8ArrToNumber = (uint8Arr) => {
    const buffer = Buffer.from(uint8Arr);
    return buffer.readUIntBE(0, uint8Arr.length);
};

const base64ToStr = (base64Str) => {
    return bytesToString(Buffer.from(base64Str, 'base64'));
};

const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

const COLOR = {
    2: 'STRING',
    3: 'INT',
    4: 'BOOLEAN',
};

const toTokenArrayAndIndexArray = (token, index, placeToColor) => {
    const tokenArray = [];
    const indexArray = [];

    if (bytesToString(token) === 'empty') return { TokenArray: [], IndexArray: [] };

    for (let i = 0; i < index.length; i += 3) {
        const t = [];
        const type = placeToColor[index[i]];
        const startIndex = uint8ArrToNumber(new Uint8Array([index[i + 1], index[i + 2]]));
        const numberOfFields = uint8ArrToNumber(new Uint8Array([token[startIndex], token[startIndex + 1]])) / 2 - 1;
        for (let j = 0; j < numberOfFields; j++) {
            const start = startIndex + j * 2;
            const end = startIndex + (j + 1) * 2;
            const startField = uint8ArrToNumber(new Uint8Array([token[start], token[start + 1]]));
            const endField = uint8ArrToNumber(new Uint8Array([token[end], token[end + 1]]));
            const tmp = token.slice(startField + startIndex, endField + startIndex);
            if (index[i] === 255 || type[j] === VALUE_TYPE.STRING) {
                t.push(bytesToString(tmp));
            } else if (type[j] === VALUE_TYPE.INT) {
                t.push(uint8ArrToNumber(tmp));
            } else {
                t.push(tmp[0] === 1);
            }
        }
        tokenArray.push(t);
        indexArray.push([index[i], uint8ArrToNumber(index.slice(i + 1, i + 3))]);
    }
    return { TokenArray: tokenArray, IndexArray: indexArray };
};

const processTransactionErrorMessage = (errorMessage, title) => {
    if (!errorMessage) return '';

    let processedMessage = title ? title : '';
    if (errorMessage.includes('account') && errorMessage.includes('balance') && errorMessage.includes('below min'))
        processedMessage = 'Account balance is below the minimum required amount.';
    if (errorMessage.includes('Transaction Request Rejected'))
        processedMessage = 'You have rejected the transaction request.';
    if (errorMessage.includes('Network mismatch between dApp and Wallet'))
        processedMessage = 'Network mismatch between dApp and Wallet.';
    if (errorMessage.includes('overspend'))
        processedMessage = "Insufficient funds. Your wallet doesn't have enough Algo to pay for this action.";
    return processedMessage;
};

const getTArrayAndIArray = (transactions, lastTransaction) => {
    /* case 1: when the application is first created, not add or fire any tokens yet.*/
    // {tArray, iArray} is get from create app tx
    if (transactions.length === 1) {
        const tArray = base64ToStr(lastTransaction['application-transaction']['application-args'][0]);
        const iArray = base64ToStr(lastTransaction['application-transaction']['application-args'][1]);
        return { tArray, iArray };
    }

    /* case 2: when application was added or fired token(s) */
    // group of txns will be executed everytime we add/fire
    const groupTransactions = transactions.filter((transaction) => transaction.group === lastTransaction.group);
    let tArray = '',
        iArray = '';

    // tArray, iArray was broken into 4 chunks and stored in first 4 txns
    // joining 4 chunks to get tArray, iArray
    for (let i = 0; i < 4; i++) {
        const tx = groupTransactions[i];
        tArray += tx?.['application-transaction']?.['application-args']?.[0]
            ? base64ToStr(tx['application-transaction']['application-args'][0])
            : '';
        iArray += tx?.['application-transaction']?.['application-args']?.[1]
            ? base64ToStr(tx['application-transaction']['application-args'][1])
            : '';
    }

    if (iArray.length === 4) {
        iArray = iArray.substring(0, 3);
    }

    return { tArray, iArray };
};

const MAX_TOKEN_ARRAY_LENGTH = 4000;

const checkTArrayLimitAfterFiring = (fireableTransition, tArrayLength) => {
    const newTokensLength = fireableTransition?.outToken?.reduce((prevVal, out) => {
        const tokenArr = out.token.substring(1, out.token.length - 1).split(',');
        let cnt = 0;
        tokenArr.forEach((item) => {
            if (item[0] === "'" && item[item.length - 1] === "'") cnt = cnt + item.length - 2;
            else cnt += 4;
        });
        return prevVal + cnt + (tokenArr.length + 1) * 2;
    }, 0);
    if (tArrayLength + newTokensLength > MAX_TOKEN_ARRAY_LENGTH) {
        return false;
    }
    return true;
};

// tealArgs
// override some value of computeEngine to prevent unexpected changes
const tealArgsAndOverride = ({
    computeEngineConvertor,
    tArray,
    bArray,
    iArray,
    gArray,
    eArray,
    fireablePlaceId,
    placeToColor,
    Variables,
    Expressions,
    Guards,
}) => {
    const tealArgsComputeEngine = computeEngineConvertor.tealArgsToComputeEngine(
        str2bytes(tArray),
        str2bytes(bArray),
        str2bytes(iArray),
        str2bytes(gArray),
        str2bytes(eArray),
        str2bytes(fireablePlaceId),
        placeToColor
    );
    const { TokenArray, IndexArray } = toTokenArrayAndIndexArray(str2bytes(tArray), str2bytes(iArray), placeToColor);
    tealArgsComputeEngine.computeEngine.TokenArray = TokenArray;
    tealArgsComputeEngine.computeEngine.IndexArray = IndexArray;
    tealArgsComputeEngine.computeEngine.Variables = Variables;
    tealArgsComputeEngine.computeEngine.Expressions = Expressions;
    tealArgsComputeEngine.computeEngine.Guards = Guards;
    return tealArgsComputeEngine;
};

const tealArgs = ({ computeEngine, computeEngineConvertor, tArray, iArray }) => {
    const placeToColor = computeEngine.placeToColor;
    const tealArgsComputeEngine = computeEngineConvertor.tealArgsToComputeEngine(
        str2bytes(tArray),
        str2bytes(computeEngineConvertor.variablesToArguments()),
        str2bytes(iArray),
        str2bytes(computeEngineConvertor.guardsToGArray()),
        str2bytes(computeEngineConvertor.expressionToEArray()),
        str2bytes(computeEngineConvertor.fireablePlaceIdToArguments()),
        computeEngine.placeToColor
    );

    const { TokenArray, IndexArray } = toTokenArrayAndIndexArray(str2bytes(tArray), str2bytes(iArray), placeToColor);
    tealArgsComputeEngine.computeEngine.TokenArray = TokenArray;
    tealArgsComputeEngine.computeEngine.IndexArray = IndexArray;
    tealArgsComputeEngine.computeEngine.Variables = deepClone(computeEngine.Variables);
    tealArgsComputeEngine.computeEngine.Expressions = deepClone(computeEngine.Expressions);
    tealArgsComputeEngine.computeEngine.Guards = deepClone(computeEngine.Guards);
    return tealArgsComputeEngine;
};

const MAX_HINT = 60;

// used for parsing base 64 from app-args to token in array
const parseOnchainToken = (tokenStr, placeToColor) => {
    const tokenBytes = new Uint8Array(str2bytes(tokenStr));
    const indexArr = [];
    const tokenArr = [];
    const registerId = parseInt(tokenBytes[0]);
    for (let i = 1; i < tokenBytes.length; i += 2) {
        const index = tokenBytes[i] * 256 + tokenBytes[i + 1];
        indexArr.push(index);
        if (index >= tokenBytes.length - 1) break;
    }
    for (let i = 0; i < indexArr.length - 1; i++) {
        let temp = [];
        for (let j = indexArr[i]; j < indexArr[i + 1]; j++) {
            temp.push(tokenBytes[j + 1]);
        }
        tokenArr.push(temp);
    }

    const parsedToken = [];
    const placeToColorArr = placeToColor[registerId];
    for (let i = 0; i < placeToColorArr.length; i++) {
        const type = COLOR[placeToColorArr[i]];
        switch (type) {
            case 'INT': // int is stored using 4 bytes
                parsedToken.push(
                    tokenArr[i][0] * Math.pow(256, 3) +
                        tokenArr[i][1] * Math.pow(256, 2) +
                        tokenArr[i][2] * 256 +
                        tokenArr[i][3]
                );
                break;
            case 'STRING':
                parsedToken.push(String.fromCharCode.apply(null, tokenArr[i]));
                break;
            case 'BOOLEAN':
                parsedToken.push(Boolean(tokenArr[i][0]));
                break;
        }
    }
    return { registerId, parsedToken };
};

const getTransactionType = (txn) => {
    return base64ToStr(txn?.['application-transaction']?.['application-args']?.[0]);
};

export {
    processTransactionErrorMessage,
    toTokenArrayAndIndexArray,
    COLOR,
    base64ToStr,
    bytesToString,
    deepClone,
    getId,
    uint8ArrToNumber,
    getTArrayAndIArray,
    MAX_TOKEN_ARRAY_LENGTH,
    checkTArrayLimitAfterFiring,
    tealArgsAndOverride,
    MAX_HINT,
    parseOnchainToken,
    tealArgs,
    getTransactionType,
};
