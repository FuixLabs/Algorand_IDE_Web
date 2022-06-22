import React from 'react';
import Dialog from './Dialog';
import muiTheme from '../../../MuiTheme';
import { ThemeProvider } from '@mui/material/styles';
import { shallow, mount } from 'enzyme';
describe('Component: Dialog show Applications', () => {
    it('renders a Dialog', () => {
        const wrapper = shallow(
            <ThemeProvider theme={muiTheme()}>
                <Dialog open={true} />
            </ThemeProvider>
        );
        let dialog = wrapper.childAt(0).childAt(0);
        expect(dialog.exists()).toEqual(true);
    });
    it('test onClose button', () => {
        const onCloseMock = jest.fn();
        const onClose = jest.fn(() => {
            onCloseMock();
        });
        const wrapper = mount(
            <ThemeProvider theme={muiTheme()}>
                <Dialog open={true} onClose={onClose} />
            </ThemeProvider>
        );
        let button = wrapper.find('.button-close').hostNodes();
        button.simulate('click');
        expect(onCloseMock).toBeCalled();
    });

    it('test render list applications', () => {
        const wrapper = mount(
            <ThemeProvider theme={muiTheme()}>
                <Dialog
                    open={true}
                    transactions={[
                        { id: '1', 'created-at-round': '1' },
                        { id: '2', 'created-at-round': '2' },
                    ]}
                />
            </ThemeProvider>
        );
        let button = wrapper.find('.table-row').hostNodes();
        expect(button.length).toBe(2);
    });
});
