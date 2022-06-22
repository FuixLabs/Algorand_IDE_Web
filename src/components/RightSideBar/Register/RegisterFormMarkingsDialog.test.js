// /* global BigInt */
// import React from 'react';
// import Component from './RegisterFormMarkingsDialog';
// import muiTheme from '../../MuiTheme';
// import { ThemeProvider } from '@mui/material/styles';
// import { BrowserRouter } from 'react-router-dom';
// import { mount } from 'enzyme';
// import { act } from 'react-dom/test-utils';
// import { Context } from '../../useContext';
// import Example from './Example';
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
//         <Context.Provider value={{}}>
//             <ThemeProvider theme={muiTheme()}>
//                 <BrowserRouter>
//                     <Component {...props} />
//                 </BrowserRouter>
//             </ThemeProvider>
//         </Context.Provider>
//     );
//     return wrapper;
// };
// let node = Example[0];
// let data = {
//     id: '1',
//     total: '2',
//     tokens: ['a', 'b', 'c', 'd'],
// };
describe('Component: Marking dialog ', () => {
    it('not render Dialog', async () => {
        // let onSave = jest.fn();
        // let handleClose = jest.fn();
        // let wrapper = initWrapper({
        //     props: {
        //         node,
        //         onSave,
        //         open: false,
        //         handleClose,
        //     },
        // });
        // let dialog = wrapper.find('[data-test="test__modal-container"]').hostNodes();
        // expect(dialog.exists()).toEqual(false);
    });
    // it('render Dialog with do not has type', async () => {
    //     let onSave = jest.fn();
    //     let handleClose = jest.fn();
    //     let wrapper = initWrapper({
    //         props: {
    //             node: {
    //                 ...node,
    //                 data: {
    //                     ...node.data,
    //                     type: [],
    //                 },
    //             },
    //             onSave,
    //             open: true,
    //             handleClose,
    //         },
    //     });
    //     let dialog = wrapper.find('[data-test="test__modal-container"]').hostNodes();
    //     expect(dialog.exists()).toEqual(true);
    //     let message = wrapper.find('[data-test="test__do-not-has-type"]').hostNodes();
    //     expect(message.exists()).toEqual(true);
    // });

    // it('render Dialog with has type, edit marking and save, click back button', async () => {
    //     let onSave = jest.fn();
    //     let handleClose = jest.fn();
    //     node.data.markings = [data];
    //     let wrapper = initWrapper({
    //         props: {
    //             node,
    //             onSave,
    //             open: true,
    //             handleClose,
    //         },
    //     });
    //     let dialog = wrapper.find('[data-test="test__modal-container"]').hostNodes();
    //     expect(dialog.exists()).toEqual(true);
    //     let message = wrapper.find('[data-test="test__do-not-has-type"]').hostNodes();
    //     expect(message.exists()).toEqual(false);
    //     //show edit marking
    //     let buttonEdit = wrapper.find('[data-test="test__button-edit"]').hostNodes();
    //     expect(buttonEdit.exists()).toEqual(true);
    //     await waitForComponentToPaint(wrapper, () => {
    //         buttonEdit.simulate('click');
    //     });
    //     //check title
    //     let title = wrapper.find('[data-test="test__title"]').hostNodes();
    //     expect(title.text()).toEqual('Edit Marking');

    //     let buttonSave = wrapper.find('[data-test="test__button-save"]').hostNodes();
    //     await waitForComponentToPaint(wrapper, () => {
    //         buttonSave.simulate('click');
    //     });
    //     expect(onSave).toBeCalled();
    //     //show edit marking
    //     await waitForComponentToPaint(wrapper, () => {
    //         buttonEdit.simulate('click');
    //     });
    //     //back to default
    //     let buttonBack = wrapper.find('[data-test="test__button-back"]').hostNodes();
    //     await waitForComponentToPaint(wrapper, () => {
    //         buttonBack.simulate('click');
    //     });
    //     title = wrapper.find('[data-test="test__title"]').hostNodes();
    //     expect(title.exists()).toEqual(false);
    // });
});
