// /* global BigInt */
// import React from 'react';
// import Component from './RegisterForm';
// import muiTheme from '../../MuiTheme';
// import { ThemeProvider } from '@mui/material/styles';
// import { BrowserRouter } from 'react-router-dom';
// import { mount } from 'enzyme';
// import { act } from 'react-dom/test-utils';
// import { Context } from '../../useContext';
// import Example from './Example';
// import DescriptionTab from './RegisterFormDescriptionTab';
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
describe('Component: Register Form ', () => {
    it('render form', async () => {
        // let onDelete = jest.fn();
        // let onSave = jest.fn();
        // let wrapper = initWrapper({
        //     props: {
        //         node,
        //         onDelete,
        //         onSave,
        //     },
        // });
        // let form = wrapper.find('[data-test="test__container-register-form"]').hostNodes();
        // expect(form.exists()).toEqual(true);
        // let button = wrapper.find('[data-test="test__button-open-dialog"]').hostNodes();
        // await waitForComponentToPaint(wrapper, () => {
        //     button.simulate('click');
        // });
        // let dialog = wrapper.find('[data-test="test__modal-container"]').hostNodes();
        // expect(dialog.exists()).toEqual(true);
        // expect(wrapper.find(DescriptionTab).exists()).toEqual(true);
    });
});
