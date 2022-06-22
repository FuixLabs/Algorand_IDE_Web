/* global BigInt */
import React from 'react';
import Component from './AddExpression';
import muiTheme from '../../MuiTheme';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Example from './Example';
const waitForComponentToPaint = async (wrapper, callback) => {
    await act(async () => {
        if (callback) {
            callback();
        }
        await new Promise((resolve) => setTimeout(resolve, 60));
        wrapper.update();
    });
};
const initWrapper = ({ props }) => {
    let wrapper = mount(
        <ThemeProvider theme={muiTheme()}>
            <BrowserRouter>
                <Component {...props} />
            </BrowserRouter>
        </ThemeProvider>
    );
    return wrapper;
};
describe('Component: Add expression', () => {
    it('renders form with type in target node', async () => {
        let onSave = jest.fn();
        let onDelete = jest.fn();
        let wrapper = initWrapper({
            props: {
                node: Example[4],
                elements: Example,
                onSave,
                onDelete,
            },
        });
        let message = wrapper.find('[data-test="test__not_has_type"]').hostNodes();
        expect(message.exists()).toEqual(false);
        let input = wrapper.find('[data-test="test__input_1"] input').hostNodes();
        let input2 = wrapper.find('[data-test="test__input_2"] input').hostNodes();
        await waitForComponentToPaint(wrapper, () => {
            input.simulate('change', { target: { value: 'exp_date' } });
            input2.simulate('change', { target: { value: 'name' } });
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
        expect(onDelete).toBeCalled();
    });
    it('renders form with not type in target node', async () => {
        let onSave = jest.fn();
        let onDelete = jest.fn();
        Example[3].data.type = [];
        let wrapper = initWrapper({
            props: {
                node: Example[4],
                elements: Example,
                onSave,
                onDelete,
            },
        });
        let buttonSave = wrapper.find('[data-test="test__button-save"]').hostNodes();
        expect(buttonSave.hasClass('Mui-disabled')).toEqual(true);
        let message = wrapper.find('[data-test="test__not_has_type"]').hostNodes();
        expect(message.exists()).toEqual(true);
    });
});
