/* global BigInt */
import React from 'react';
import Component from './index';
import muiTheme from '../../MuiTheme';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
const initWrapper = async ({ props }) => {
    let wrapper;
    await act(
        async () =>
            (wrapper = mount(
                <ThemeProvider theme={muiTheme()}>
                    <BrowserRouter>
                        <Component {...props} />
                    </BrowserRouter>
                </ThemeProvider>
            ))
    );
    return wrapper;
};
describe('Component: Left Side Bar', () => {
    it('renders left side bar with example', async () => {
        // let wrapper = await initWrapper({
        //     props: {
        //         isExample: true,
        //     },
        // });
        // let isExample = wrapper.find('[data-test="test__example"]').hostNodes();
        // expect(isExample.exists()).toEqual(false);
    });
    // it('renders left side bar not example', async () => {
    //     let wrapper = await initWrapper({
    //         props: {
    //             isExample: false,
    //         },
    //     });
    //     let isExample = wrapper.find('[data-test="test__example"]').hostNodes();
    //     expect(isExample.exists()).toEqual(true);
    // });
});
