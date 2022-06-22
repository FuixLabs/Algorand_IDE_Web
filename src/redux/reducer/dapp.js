import { createSlice } from '@reduxjs/toolkit';
import { base64ToStr } from '../../util/dappUtils';

const initialModel = {
    applicationInfo: null,
    chain: 'testnet',
    isFetchingApplication: false,
    isFireable: false,
    pElements: null, //model
    computeEngine: null,
    transactions: null,
    createTransaction: null, // transaction that create app
    lastTransaction: null,
    globalState: null,
    shouldAddHint: false,
    isLastTxnAddHint: false,
};

export const dappSlice = createSlice({
    name: 'dapp',
    initialState: initialModel,
    reducers: {
        updateChain(state, action) {
            state.chain = action.payload;
        },
        updateDappModel(state, action) {
            state.pElements = action.payload;
        },
        updateFireable(state, action) {
            state.isFireable = action.payload;
        },
        updateComputeEngineState(state, action) {
            if (action?.payload?.elements) state.pElements = action.payload.elements;
            if (action?.payload?.computeEngine) state.computeEngine = action.payload.computeEngine;
            if (action?.payload?.isFireable) state.isFireable = Boolean(action.payload.isFireable);
        },
        fetchApplication(state, action) {
            state.isFetchingApplication = action.payload;
        },
        fetchApplicationSuccess(state, action) {
            state.isFetchingApplication = false;
            state.applicationInfo = action.payload;
        },
        fetchTransactionsSuccess(state, action) {
            let newTransactions = action?.payload;
            if (newTransactions[newTransactions.length - 1]?.id === state.lastTransaction?.id) return;
            state.transactions = newTransactions;
            const lastTxn = newTransactions[newTransactions.length - 1];
            let firstArg = base64ToStr(lastTxn?.['application-transaction']?.['application-args']?.[0]);
            if (firstArg && firstArg.indexOf('buff_add_hint') !== -1) {
                state.isLastTxnAddHint = true;
                state.shouldAddHint = false;
                for (let i = newTransactions.length - 1; i--; i >= 0) {
                    firstArg = base64ToStr(newTransactions[i]['application-transaction']?.['application-args']?.[0]);
                    if (firstArg && firstArg.indexOf('buff_add_hint') === -1 && firstArg !== 'store_hint') {
                        state.lastTransaction = newTransactions[i];
                        break;
                    }
                }
            } else {
                state.lastTransaction = lastTxn;
                state.isLastTxnAddHint = false;
            }
        },
        updateCreateTxn(state, action) {
            state.createTransaction = action.payload;
        },
        reset() {
            state = initialModel;
        },
        updateGlobalState(state, action) {
            state.globalState = action.payload;
        },
        updateShouldAddHint(state, action) {
            state.shouldAddHint = action.payload;
        },
    },
});

export const dappSliceActions = dappSlice.actions;
export default dappSlice.reducer;
