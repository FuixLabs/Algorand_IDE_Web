// /* global BigInt */
// import React from 'react';
// import Component from './RegisterFormAddMarkings';
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
describe('Component: Add marking form ', () => {
    it('not render form', async () => {
        // let setShow = jest.fn();
        // let onDelete = jest.fn();
        // let onSave = jest.fn();
        // let setSelectRow = jest.fn();
        // let wrapper = initWrapper({
        //     props: {
        //         node,
        //         elements: Example,
        //         onDelete,
        //         setShow,
        //         onSave,
        //         hide: true,
        //         setSelectRow,
        //     },
        // });
        // let form = wrapper.find('[data-test="test__container-form"]').hostNodes();
        // expect(form.exists()).toEqual(false);
    });
    // it('show form with type create new, fill input and click save', async () => {
    //     let setShow = jest.fn();
    //     let onDelete = jest.fn();
    //     let onSave = jest.fn();
    //     let setSelectRow = jest.fn();
    //     let wrapper = initWrapper({
    //         props: {
    //             node,
    //             elements: Example,
    //             onDelete,
    //             setShow,
    //             onSave,
    //             setSelectRow,
    //             hide: false,
    //         },
    //     });

    //     let form = wrapper.find('[data-test="test__container-form"]').hostNodes();
    //     expect(form.exists()).toEqual(true);
    //     let buttonSave = wrapper.find('[data-test="test__button-save"]').hostNodes();
    //     expect(buttonSave.hasClass('Mui-disabled')).toEqual(true);

    //     let input = wrapper.find('[data-test="test__input-total"] input').hostNodes();
    //     await waitForComponentToPaint(wrapper, () => {
    //         input.simulate('change', { target: { value: '2' } });
    //     });
    //     let inputType = wrapper.find('[data-test="test__input-type"] input').hostNodes();
    //     for (let i = 0; i < inputType.length; i++) {
    //         let el = inputType.at(i);
    //         await waitForComponentToPaint(wrapper, () => {
    //             el.simulate('change', { target: { value: '2' } });
    //         });
    //     }
    //     await waitForComponentToPaint(wrapper, () => {
    //         buttonSave.simulate('click');
    //     });
    //     expect(onSave).toBeCalled();
    //     expect(setShow).toBeCalled();
    //     expect(setSelectRow).toBeCalled();

    //     // let checkbox = wrapper.find('[data-test="test__checkbox"] input').hostNodes();
    //     // await waitForComponentToPaint(wrapper, () => {
    //     //     checkbox.simulate('change', { target: { checked: true } });
    //     // });
    //     // await waitForComponentToPaint(wrapper, () => {
    //     //     input.simulate('change', { target: { value: '2' } });
    //     // });
    //     // for (let i = 0; i < inputType.length; i++) {
    //     //     let el = inputType.at(i);
    //     //     await waitForComponentToPaint(wrapper, () => {
    //     //         el.simulate('change', { target: { value: '2' } });
    //     //     });
    //     // }
    //     // await waitForComponentToPaint(wrapper, () => {
    //     //     buttonSave.simulate('click');
    //     // });
    //     // expect(onSave).toBeCalled();
    //     // expect(setShow).toBeCalled();
    //     // expect(setSelectRow).toBeCalled();
    // });

    // it('show form with edit data, change input and click save button', async () => {
    //     let setShow = jest.fn();
    //     let onDelete = jest.fn();
    //     let onSave = jest.fn();
    //     node.data.markings = [data];
    //     let setSelectRow = jest.fn();
    //     let wrapper = initWrapper({
    //         props: {
    //             node,
    //             elements: Example,
    //             onDelete,
    //             setShow,
    //             onSave,
    //             setSelectRow,
    //             hide: false,
    //             data,
    //         },
    //     });
    //     let form = wrapper.find('[data-test="test__container-form"]').hostNodes();
    //     expect(form.exists()).toEqual(true);
    //     let buttonSave = wrapper.find('[data-test="test__button-save"]').hostNodes();
    //     let input = wrapper.find('[data-test="test__input-total"] input').hostNodes();
    //     await waitForComponentToPaint(wrapper, () => {
    //         input.simulate('change', { target: { value: '2' } });
    //     });
    //     let inputType = wrapper.find('[data-test="test__input-type"] input').hostNodes();
    //     for (let i = 0; i < inputType.length; i++) {
    //         let el = inputType.at(i);
    //         await waitForComponentToPaint(wrapper, () => {
    //             el.simulate('change', { target: { value: '2' } });
    //         });
    //     }
    //     await waitForComponentToPaint(wrapper, () => {
    //         buttonSave.simulate('click');
    //     });
    //     expect(onSave).toBeCalled();
    //     expect(setShow).toBeCalled();
    //     expect(setSelectRow).toBeCalled();
    // });
    // it('show form with edit data, change input and click delete button', async () => {
    //     let setShow = jest.fn();
    //     let onDelete = jest.fn();
    //     let onSave = jest.fn();
    //     node.data.markings = [data];
    //     let setSelectRow = jest.fn();
    //     let wrapper = initWrapper({
    //         props: {
    //             node,
    //             elements: Example,
    //             onDelete,
    //             setShow,
    //             onSave,
    //             setSelectRow,
    //             hide: false,
    //             data,
    //         },
    //     });
    //     let form = wrapper.find('[data-test="test__container-form"]').hostNodes();
    //     expect(form.exists()).toEqual(true);
    //     let buttonDelete = wrapper.find('[data-test="test__button-delete"]').hostNodes();
    //     await waitForComponentToPaint(wrapper, () => {
    //         buttonDelete.simulate('click');
    //     });
    //     expect(onDelete).toBeCalled();
    //     expect(setShow).toBeCalled();
    //     expect(setSelectRow).toBeCalled();
    // });
});
