import React from 'react';
import Dialog from './ConfirmCreateNew';
import muiTheme from '../../../MuiTheme';
import { ThemeProvider } from '@mui/material/styles';
import { shallow, mount } from 'enzyme';
describe('Component: Dialog confirm create new model', () => {
    it('renders a Dialog', () => {
        const wrapper = shallow(
            <ThemeProvider theme={muiTheme()}>
                <Dialog open={true} />
            </ThemeProvider>
        );
        //setPropsImg(wrapper);
        let dialog = wrapper.childAt(0).childAt(0);
        expect(dialog.exists()).toEqual(true);
    });

    it('not renders a Dialog', () => {
        const wrapper = mount(
            <ThemeProvider theme={muiTheme()}>
                <Dialog open={false} />
            </ThemeProvider>
        );
        let dialog = wrapper.find('.confirm-modal-create').hostNodes();
        expect(dialog.exists()).toEqual(false);
    });

    it('test onClose button', () => {
        const onCloseMock = jest.fn();
        const onClose = jest.fn(() => {
            onCloseMock();
        });
        const setElements = jest.fn();
        const wrapper = mount(
            <ThemeProvider theme={muiTheme()}>
                <Dialog open={true} onClose={onClose} setElements={setElements} />
            </ThemeProvider>
        );
        // setPropsImg(wrapper);
        let button = wrapper.find('[data-test="test__button-close"]').hostNodes();
        button.simulate('click');
        expect(onCloseMock).toBeCalled();
        expect(setElements).toBeCalled();
    });
});
