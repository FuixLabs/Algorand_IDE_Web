/* global BigInt */
import React from 'react';
import Component from './Header';
import muiTheme from '../../MuiTheme';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';

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
describe('Component: Header ', () => {
    it('render Header', async () => {
        let wrapper = initWrapper({
            props: {
                title: 'test',
            },
        });
        let title = wrapper.find('[data-test="test__title"]').hostNodes();
        expect(title.text()).toEqual('test');
    });
});
