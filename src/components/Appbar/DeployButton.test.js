import React from 'react';
import DeployButton from './DeployButton';
import muiTheme from '../../MuiTheme';
import { ThemeProvider } from '@mui/material/styles';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Constants from '../../util/Constant';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
const waitForComponentToPaint = async (wrapper, buttonDeploy) => {
    await act(async () => {
        buttonDeploy.simulate('click');
        await new Promise((resolve) => setTimeout(resolve, 60));
        wrapper.update();
    });
};
const initWrapper = ({ initialWalletConnect = {}, onDeployMock, onOpen }) => {
    const onConvert = jest.fn(() => {
        return { elements: [], computeEngine: {} };
    });
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
                    <DeployButton onDeploy={onDeployMock} convert={onConvert} handleOpen={onOpen} />
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    );
    return wrapper;
};

const makeSurePopoverRendered = ({ onOpen, wrapper }) => {
    let button = wrapper.find('[data-test="test__button-open"]').hostNodes();
    button.simulate('click');
    expect(onOpen).toBeCalled();
    let buttonDeploy = wrapper.find('[data-test="test__button-deploy"]').hostNodes();
    expect(buttonDeploy.exists()).toEqual(true);
};
const makeSureConnected = (wrapper) => {
    let messageConnected = wrapper.find('[data-test="test__message-connected"]').hostNodes();
    expect(messageConnected.exists()).toEqual(true);
};
describe('Component: Deploy Button and Popover deploy', () => {
    it('renders a button and render popover', () => {
        const onDeployMock = jest.fn(() => ({ appId: '', txId: '' }));
        const onOpen = jest.fn();
        let wrapper = initWrapper({
            onDeployMock,
            onOpen,
            initialWalletConnect: {
                chain: 'testnet',
                address: Constants.testAddress,
                connector: { connected: true, on: () => '' },
            },
        });
        //test content popover
        makeSurePopoverRendered({ wrapper, onOpen });
    });

    it('test not connected', () => {
        const onDeployMock = jest.fn(() => null);
        const onOpen = jest.fn();
        let wrapper = initWrapper({
            onDeployMock,
            onOpen,
            initialWalletConnect: {
                chain: 'testnet',
                address: '',
                connector: {
                    connected: false,
                    on: () => null,
                },
            },
        });
        makeSurePopoverRendered({ wrapper, onOpen });
        let messageFailed = wrapper.find('[data-test="test__message-connect"]').hostNodes();
        expect(messageFailed.exists()).toEqual(true);
    });

    it('test connected', () => {
        const onDeployMock = jest.fn(() => null);
        const onOpen = jest.fn();
        let wrapper = initWrapper({
            onDeployMock,
            onOpen,
            initialWalletConnect: {
                chain: 'testnet',
                address: Constants.testAddress,
                connector: { connected: true, on: () => '' },
            },
        });
        makeSurePopoverRendered({ wrapper, onOpen });
        makeSureConnected(wrapper);
    });

    it('test deploy failed', async () => {
        const onDeployMock = jest.fn(() => null);
        const onOpen = jest.fn();
        let wrapper = initWrapper({
            onDeployMock,
            onOpen,
            initialWalletConnect: {
                chain: 'testnet',
                address: Constants.testAddress,
                connector: { connected: true, on: () => '' },
            },
        });
        makeSurePopoverRendered({ wrapper, onOpen });
        makeSureConnected(wrapper);
        let buttonDeploy = wrapper.find('[data-test="test__button-deploy"]').hostNodes();
        expect(buttonDeploy.exists()).toEqual(true);
        await waitForComponentToPaint(wrapper, buttonDeploy);
        expect(onDeployMock).toBeCalled();
        let messageFailed = wrapper.find('[data-test="test__message-deploy_failed"]').hostNodes();
        expect(messageFailed.exists()).toEqual(true);
    });

    it('test deploy success', async () => {
        const onDeployMock = jest.fn(
            () => new Promise((resolve) => setTimeout(() => resolve({ appId: '1', txId: '2' }), 20))
        );
        const onOpen = jest.fn();
        let wrapper = initWrapper({
            onDeployMock,
            onOpen,
            initialWalletConnect: {
                chain: 'testnet',
                address: Constants.testAddress,
                connector: { connected: true, on: () => '' },
            },
        });
        makeSurePopoverRendered({ wrapper, onOpen });
        makeSureConnected(wrapper);
        let buttonDeploy = wrapper.find('[data-test="test__button-deploy"]').hostNodes();
        expect(buttonDeploy.exists()).toEqual(true);
        await waitForComponentToPaint(wrapper, buttonDeploy);
        expect(onDeployMock).toBeCalled();
        let messageSuccess = wrapper.find('[data-test="test__message-deploy-success"]').hostNodes();
        expect(messageSuccess.exists()).toEqual(true);
    });
});
