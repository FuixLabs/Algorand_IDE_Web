/* global BigInt */
import React from 'react';
// import Component from './index';
// import muiTheme from '../../MuiTheme';
// import { ThemeProvider } from '@mui/material/styles';
// import { BrowserRouter } from 'react-router-dom';
// import Constants from '../../util/Constant';
// import { mount } from 'enzyme';
// // import Appbar from '../Appbar';
// import { act } from 'react-dom/test-utils';
// import { Provider } from 'react-redux';
// import { configureStore, createSlice } from '@reduxjs/toolkit';
// const asset = {
//     id: 0,
//     amount: BigInt(10),
//     creator: '',
//     frozen: false,
//     decimals: 6,
//     name: 'Algo',
//     unitName: 'Algo',
// };
// const initWrapper = async ({
//     initialWalletConnect = {
//         chain: 'testnet',
//         address: Constants.testAddress,
//         assets: [asset],
//         connector: {
//             connected: false,
//             on: () => '',
//             accounts: [Constants.testAddress],
//         },
//     },
// }) => {
//     const walletConnectSlice = createSlice({
//         name: 'walletConnect',
//         initialState: initialWalletConnect,
//         reducers: {},
//     });
//     let store = configureStore({
//         reducer: {
//             walletConnect: walletConnectSlice.reducer,
//         },
//     });
//     let wrapper;
//     await act(
//         async () =>
//             (wrapper = mount(
//                 <Provider store={store}>
//                     <ThemeProvider theme={muiTheme()}>
//                         <BrowserRouter>
//                             <Component />
//                         </BrowserRouter>
//                     </ThemeProvider>
//                 </Provider>
//             ))
//     );
//     return wrapper;
// };

describe('Component: Header', () => {
    it('renders appbar', async () => {
        // let wrapper = await initWrapper({});
        // let $Appbar = wrapper.find(Appbar);
        // expect($Appbar.exists()).toEqual(true);
    });
});
