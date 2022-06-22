import React from 'react';
import Button from './Button';
import muiTheme from '../../../MuiTheme';
import { ThemeProvider } from '@mui/material/styles';
import { shallow } from 'enzyme';

describe('Component: Button show Applications', () => {
    it('renders a button', () => {
        const wrapper = shallow(
            <ThemeProvider theme={muiTheme()}>
                <Button number={0} />
            </ThemeProvider>
        );
        let button = wrapper.childAt(0).childAt(0);
        expect(button.exists()).toEqual(true);
    });
    it('test onClick button', () => {
        const onClickMock = jest.fn();
        const onClick = jest.fn(() => {
            onClickMock();
        });
        const wrapper = shallow(
            <ThemeProvider theme={muiTheme()}>
                <Button number={0} onClick={onClick} />
            </ThemeProvider>
        );
        let button = wrapper.childAt(0).childAt(0);
        button.simulate('click');
        expect(onClickMock).toBeCalled();
    });
});
