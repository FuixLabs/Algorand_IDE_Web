// /* global BigInt */
// import React from 'react';
// import Component from './RegisterFormDescriptionTab';
// import muiTheme from '../../MuiTheme';
// import { ThemeProvider } from '@mui/material/styles';
// import { BrowserRouter } from 'react-router-dom';
// import { mount } from 'enzyme';
// import { act } from 'react-dom/test-utils';
// import { Context } from '../../useContext';
// import Example from './Example';
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
describe('Component: Register form ', () => {
    it('renders form and test change input, click 2 button', async () => {
        // let onSave = jest.fn();
        // let onDelete = jest.fn();
        // let wrapper = initWrapper({
        //     props: {
        //         node,
        //         elements: Example,
        //         onSave,
        //         onDelete,
        //     },
        // });
        // let input = wrapper.find('[data-test="test__input-name"] input').hostNodes();
        // await waitForComponentToPaint(wrapper, () => {
        //     input.simulate('change', { target: { value: 'test' } });
        // });
        // let buttonSave = wrapper.find('[data-test="test__button-save"]').hostNodes();
        // await waitForComponentToPaint(wrapper, () => {
        //     buttonSave.simulate('click');
        // });
        // expect(onSave).toBeCalled();
        // let buttonDelete = wrapper.find('[data-test="test__button-delete"]').hostNodes();
        // await waitForComponentToPaint(wrapper, () => {
        //     buttonDelete.simulate('click');
        // });
        // expect(onSave).toBeCalled();
    });
    // it('renders button add option', async () => {
    //     let wrapper = initWrapper({
    //         props: {
    //             node,
    //             elements: Example,
    //         },
    //     });
    //     let button = wrapper.find('[data-test="test__button-add-option"]').hostNodes();
    //     await waitForComponentToPaint(wrapper, () => {
    //         button.simulate('click');
    //     });
    //     let selects = wrapper.find('[data-test="test__select-type"]').hostNodes();
    //     expect(selects.length).toBe(node.data.type.length + 1);
    // });
});
