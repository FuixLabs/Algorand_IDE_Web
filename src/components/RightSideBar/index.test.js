// /* global BigInt */
// import React from 'react';
// import Component from './index';
// import muiTheme from '../../MuiTheme';
// import { ThemeProvider } from '@mui/material/styles';
// import { BrowserRouter } from 'react-router-dom';
// import { mount } from 'enzyme';
// import { act } from 'react-dom/test-utils';
// import Example from './Example';
// import RegisterForm from './RegisterForm';
// import AddGuard from './AddGuard';
// import AddVariable from './AddVariable';
// import AddExpression from './AddExpression';
// import { wrap } from 'module';
// const crypto = require('crypto');
// Object.defineProperty(global.self, 'crypto', {
//     value: {
//         getRandomValues: (arr) => crypto.randomBytes(arr.length),
//     },
// });
// const waitForComponentToPaint = async (wrapper, callback) => {
//     await act(async () => {
//         if (callback) {
//             callback();
//         }
//         await new Promise((resolve) => setTimeout(resolve, 60));
//         wrapper.update();
//     });
// };
// const initWrapper = ({ props }) => {
//     let wrapper = mount(
//         <ThemeProvider theme={muiTheme()}>
//             <BrowserRouter>
//                 <Component {...props} />
//             </BrowserRouter>
//         </ThemeProvider>
//     );
//     return wrapper;
// };
// let data = {
//     id: '1',
//     total: '2',
//     tokens: ['a', 'b', 'c', 'd'],
// };
describe('Component: Right side bar  ', () => {
    it('render with not select node', async () => {
        // let onDelete = jest.fn();
        // let onSave = jest.fn();
        // let wrapper = initWrapper({
        //     props: {
        //         node: '',
        //         onDelete,
        //         onSave,
        //         elements: Example,
        //     },
        // });
        // let notSelected = wrapper.find('[data-test="test__not-selected"]').hostNodes();
        // expect(notSelected.exists()).toEqual(true);
    });

    // it('render with select register', async () => {
    //     let onDelete = jest.fn();
    //     let onSave = jest.fn();
    //     let wrapper = initWrapper({
    //         props: {
    //             selections: [Example[0]],
    //             onDelete,
    //             onSave,
    //             elements: Example,
    //         },
    //     });
    //     let notSelected = wrapper.find('[data-test="test__not-selected"]').hostNodes();
    //     expect(notSelected.exists()).toEqual(false);
    //     expect(wrapper.find(RegisterForm).exists()).toEqual(true);
    // });
    // it('render with select Add Expression', async () => {
    //     let onDelete = jest.fn();
    //     let onSave = jest.fn();
    //     let wrapper = initWrapper({
    //         props: {
    //             selections: [Example[4]],
    //             onDelete,
    //             onSave,
    //             elements: Example,
    //         },
    //     });
    //     let notSelected = wrapper.find('[data-test="test__not-selected"]').hostNodes();
    //     expect(notSelected.exists()).toEqual(false);
    //     expect(wrapper.find(AddExpression).exists()).toEqual(true);
    // });
    // it('render with select Add Guard', async () => {
    //     let onDelete = jest.fn();
    //     let onSave = jest.fn();
    //     let wrapper = initWrapper({
    //         props: {
    //             selections: [Example[2]],
    //             onDelete,
    //             onSave,
    //             elements: Example,
    //         },
    //     });
    //     let notSelected = wrapper.find('[data-test="test__not-selected"]').hostNodes();
    //     expect(notSelected.exists()).toEqual(false);
    //     expect(wrapper.find(AddGuard).exists()).toEqual(true);
    // });
    // it('render with select Add Variable', async () => {
    //     let onDelete = jest.fn();
    //     let onSave = jest.fn();
    //     let wrapper = initWrapper({
    //         props: {
    //             selections: [Example[5]],
    //             onDelete,
    //             onSave,
    //             elements: Example,
    //         },
    //     });
    //     let notSelected = wrapper.find('[data-test="test__not-selected"]').hostNodes();
    //     expect(notSelected.exists()).toEqual(false);
    //     expect(wrapper.find(AddVariable).exists()).toEqual(true);
    // });
});
