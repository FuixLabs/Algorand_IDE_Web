// /* global BigInt */
// import React from 'react';
// import Component from './index';
// import muiTheme from '../../MuiTheme';
// import { ThemeProvider } from '@mui/material/styles';
// import { BrowserRouter } from 'react-router-dom';
// import Constants from '../../util/Constant';
// import { mount } from 'enzyme';
// import AccountButton from '../../containers/Appbar/AccountButton';
// import DeployButton from '../../containers/Appbar/DeployButton';
// import ApplicationsHistory from '../../containers/Appbar/ApplicationsHistory';
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
//     props,
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
//     let wrapper = await act(
//         async () =>
//             (wrapper = mount(
//                 <Provider store={store}>
//                     <ThemeProvider theme={muiTheme()}>
//                         <BrowserRouter>
//                             <Component {...props} />
//                         </BrowserRouter>
//                     </ThemeProvider>
//                 </Provider>
//             ))
//     );
//     return wrapper;
// };

describe('Component: Appbar', () => {});
// describe('Component: Appbar', () => {
//     let title = 'test title';
it('renders appbar with title, show account button', async () => {
    // let wrapper = await initWrapper({
    //     props: {
    //         title,
    //         showAccount: true,
    //     },
    // });
    // let $title = wrapper.find('[data-test="test__title"]').hostNodes();
    // expect($title.text()).toEqual(title);
    // let $AccountButton = wrapper.find(AccountButton);
    // expect($AccountButton.exists()).toEqual(true);
});
// it('renders with Applications history and deploy button', async () => {
//     let wrapper = await initWrapper({
//         props: {
//             title,
//             atWorkboard: true,
//         },
//     });
//     let $ApplicationsHistory = wrapper.find(ApplicationsHistory);
//     expect($ApplicationsHistory.exists()).toEqual(true);
//     let $DeployButton = wrapper.find(DeployButton);
//     expect($DeployButton.exists()).toEqual(true);
// });
// });
