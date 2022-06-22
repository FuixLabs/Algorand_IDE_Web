import React from 'react';
import Applications from './index';
import { mount } from 'enzyme';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import muiTheme from '../../../MuiTheme';
import Constants from '../../../util/Constant';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
const waitForComponentToPaint = async (wrapper, button) => {
    await act(async () => {
        button.simulate('click');
        await new Promise((resolve) => setTimeout(resolve, 60));
        wrapper.update();
    });
};
// const asset = {
//     id: 0,
//     amount: formatBigNumWithDecimals(BigInt(10), 6),
//     creator: '',
//     frozen: false,
//     decimals: 6,
//     name: 'Algo',
//     unitName: 'Algo',
// };
const initWrapper = ({
    initialWalletConnect = {
        chain: 'testnet',
        address: Constants.testAddress,
        // assets: [asset],
        connector: {
            connected: false,
            on: () => '',
            accounts: [Constants.testAddress],
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
                    <Applications transactions={[]} />
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    );
    return wrapper;
};

describe('Component: index Applications', () => {
    it('renders a button', async () => {
        const wrapper = await initWrapper({});
        // let $ButtonShow = wrapper.find(ButtonShow);
        // expect($ButtonShow.exists()).toEqual(true);
        // let $Dialog = wrapper.find(Dialog);
        // expect($Dialog.exists()).toEqual(true);
    });
});
