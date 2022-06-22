/* global BigInt */
import React from 'react';
import AccountButton from './AccountButton';
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

const initWrapper = ({ initialWalletConnect = {} }) => {
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
                    <AccountButton />
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    );
    return wrapper;
};
describe('Component: Account button', () => {
    it('renders a button sign in and click show QRModal', async () => {
        let wrapper = initWrapper({
            initialWalletConnect: {
                chain: 'testnet',
                connector: { connected: false, on: () => '', killSession: () => '' },
                assets: [asset],
            },
        });
        let buttonSignIn = wrapper.find('[data-test="test__button-sign-in"]').hostNodes();
        expect(buttonSignIn.text().replace('account_circle', '')).toEqual('Sign in');
        await waitForComponentToPaint(wrapper, buttonSignIn);
        let QRModal = wrapper.find('.q-r-modal .content');
        //test content popover
        expect(QRModal.exists()).toEqual(true);
    });

    it('renders account address, and button disconnect', async () => {
        const killSession = jest.fn();
        let wrapper = initWrapper({
            initialWalletConnect: {
                chain: 'testnet',
                connector: { connected: true, on: () => '', killSession, accounts: [Constants.testAddress] },
                assets: [asset],
            },
        });
        let buttonAccount = wrapper.find('[data-test="test__button-sign-in"]').hostNodes();
        //test logged in
        expect(buttonAccount.text().replace('account_circle', '')).toEqual(compactAddress(Constants.testAddress));
        let balances = wrapper.find('[data-test="test__balances"]').hostNodes();
        //test balance
        expect(balances.text()).toEqual(`${asset.amount} ${asset.unitName}`);
        await waitForComponentToPaint(wrapper, buttonAccount);
        //test button disconnect click
        let buttonDisconnect = wrapper.find('[data-test="test__disconnect"]').hostNodes();
        expect(buttonDisconnect.exists()).toEqual(true);
        await waitForComponentToPaint(wrapper, buttonDisconnect);
        expect(killSession).toBeCalled();
    });
});
