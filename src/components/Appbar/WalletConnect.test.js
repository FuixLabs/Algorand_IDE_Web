/* global BigInt */
import React from 'react';
import WalletConnect from './WalletConnect';
import muiTheme from '../../MuiTheme';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import Constants from '../../util/Constant';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { compactAddress, formatBigNumWithDecimals } from '../../scripts/util';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
const waitForComponentToPaint = async (wrapper, button) => {
    await act(async () => {
        button.simulate('click');
        await new Promise((resolve) => setTimeout(resolve, 60));
        wrapper.update();
    });
};
const asset = {
    id: 0,
    amount: formatBigNumWithDecimals(BigInt(10), 6),
    creator: '',
    frozen: false,
    decimals: 6,
    name: 'Algo',
    unitName: 'Algo',
};
const initWrapper = ({
    onDisconnect,
    initialWalletConnect = {
        chain: 'testnet',
        address: Constants.testAddress,
        assets: [asset],
        connector: {
            connected: false,
            on: () => '',
            accounts: [Constants.testAddress],
            killSession: onDisconnect,
        },
    },
}) => {
    const walletConnectSlice = createSlice({
        name: 'walletConnect',
        initialState: initialWalletConnect,
        reducers: {},
    });
    let store = configureStore({
        reducer: {
            walletConnect: walletConnectSlice.reducer,
        },
    });
    let wrapper = mount(
        <Provider store={store}>
            <ThemeProvider theme={muiTheme()}>
                <BrowserRouter>
                    <WalletConnect />
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    );
    return wrapper;
};

describe('Component: Wallet connect Button', () => {
    it('renders a button connect and click show QRModal', async () => {
        let wrapper = initWrapper({
            initialWalletConnect: {
                chain: 'testnet',
                connector: { connected: false, on: () => '' },
            },
        });
        let buttonSignIn = wrapper.find('[data-test="test__button_connect"]').hostNodes();
        expect(buttonSignIn.text()).toEqual('Connect to WalletConnect');
        await waitForComponentToPaint(wrapper, buttonSignIn);
        let QRModal = wrapper.find('.q-r-modal .content');
        //test content popover
        expect(QRModal.exists()).toEqual(true);
    });

    it('renders account address, and button disconnect', async () => {
        const onDisconnect = jest.fn();
        let wrapper = initWrapper({ onDisconnect });
        let address = wrapper.find('[data-test="test__address"]').hostNodes();
        //test logged in
        expect(address.text()).toEqual(compactAddress(Constants.testAddress));
        let balances = wrapper.find('[data-test="test__balances"]').hostNodes();
        //test balance
        expect(balances.text()).toEqual(`${asset.amount} ${asset.unitName}`);
        //test button disconnect click
        let buttonDisconnect = wrapper.find('[data-test="test__button-disconnect"]').hostNodes();
        expect(buttonDisconnect.exists()).toEqual(true);
        await waitForComponentToPaint(wrapper, buttonDisconnect);
        expect(onDisconnect).toBeCalled();
    });
});
