/* global BigInt */
import React from 'react';
import Component from './index';
import muiTheme from '../../../MuiTheme';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Example from '../Example';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
const waitForComponentToPaint = async (wrapper, callback) => {
    await act(async () => {
        if (callback) {
            callback();
        }
        await new Promise((resolve) => setTimeout(resolve, 60));
        wrapper.update();
    });
};
const initWrapper = ({
    props,
    initialWalletConnect = {
        isRequesting: false,
        isFetching: false,
        elements: Example,
        isExample: false,
        ref: null,
    },
}) => {
    const modelSlice = createSlice({
        name: 'model',
        initialState: initialWalletConnect,
        reducers: {},
    });
    let store = configureStore({
        reducer: {
            model: modelSlice.reducer,
        },
    });
    let wrapper = mount(
        <Provider store={store}>
            <ThemeProvider theme={muiTheme()}>
                <BrowserRouter>
                    <Component {...props} />
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    );
    return wrapper;
};

let node = Example[2];
describe('Component: Add Guard', () => {
    it('renders form and test change input, click 2 button', async () => {
        let onSave = jest.fn();
        let onDelete = jest.fn();
        let wrapper = initWrapper({
            props: {
                node,
                onSave,
                onDelete,
            },
        });
        let input = wrapper.find('[data-test="test__input_name"] input').hostNodes();
        await waitForComponentToPaint(wrapper, () => {
            input.simulate('change', { target: { value: 'test' } });
        });
        let buttonSave = wrapper.find('[data-test="test__button-save"]').hostNodes();
        await waitForComponentToPaint(wrapper, () => {
            buttonSave.simulate('click');
        });
        expect(onSave).toBeCalled();
        let buttonDelete = wrapper.find('[data-test="test__button-delete"]').hostNodes();
        await waitForComponentToPaint(wrapper, () => {
            buttonDelete.simulate('click');
        });
        expect(onSave).toBeCalled();
    });
    it('renders form with not guard', async () => {
        let onSave = jest.fn();
        let onDelete = jest.fn();
        let wrapper = initWrapper({
            props: {
                node,
                onSave,
                onDelete,
            },
        });
        let buttonSave = wrapper.find('[data-test="test__button-save"]').hostNodes();
        expect(buttonSave.hasClass('Mui-disabled')).toEqual(true);
    });
});
