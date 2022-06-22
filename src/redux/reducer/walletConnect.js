import walletConnectConstants from '../constants/walletConnect';
import WalletConnectClient from '@walletconnect/client';
import { createSlice } from '@reduxjs/toolkit';
import { ChainType } from '../../scripts/api';
const {
    UPDATE_CONNECTOR,
    UPDATE_ADDRESS,
    UPDATE_ACCOUNTS,
    UPDATE_CHAIN,
    UPDATE_ASSETS,
    UPDATE_DATA,
    RESET,
    DEPLOY_CHANGE,
} = walletConnectConstants;

export const bridge = 'https://bridge.walletconnect.org';
const connector = new WalletConnectClient({
    bridge,
});

export let initialWalletConnect = {
    connector: null,
    address: '',
    chain: ChainType.TestNet,
    assets: [],
    accounts: [],
    deployChange: 0,
};
if (connector._connected) {
    initialWalletConnect = {
        ...initialWalletConnect,
        connector,
        address: connector.accounts[0],
        accounts: connector.accounts,
    };
}

export const walletConnectSlice = createSlice({
    name: 'walletConnect',
    initialState: initialWalletConnect,
    reducers: {
        [UPDATE_CONNECTOR]: (state, action) => {
            let payload = action.payload;
            state.connector = payload.connector;
            return state;
        },
        [UPDATE_ADDRESS]: (state, action) => {
            let payload = action.payload;
            state.address = payload.address;
            return state;
        },
        [UPDATE_ACCOUNTS]: (state, action) => {
            let payload = action.payload;
            state.accounts = payload.accounts;
            return state;
        },
        [UPDATE_CHAIN]: (state, action) => {
            let payload = action.payload;
            state.chain = payload.chain;
            return state;
        },
        [UPDATE_ASSETS]: (state, action) => {
            let payload = action.payload;
            state.assets = payload.assets;
            return state;
        },
        [UPDATE_DATA]: (state, action) => {
            let payload = action.payload;
            return { ...state, ...payload.data };
        },
        [RESET]: () => {
            return {
                connector: null,
                address: '',
                chain: ChainType.TestNet,
                assets: [],
                accounts: [],
                deployChange: 0,
            };
        },
        [DEPLOY_CHANGE]: (state) => {
            state.deployChange = state.deployChange + 1;
            return state;
        },
    },
});

export const walletConnectActions = walletConnectSlice.actions;
export default walletConnectSlice.reducer;
