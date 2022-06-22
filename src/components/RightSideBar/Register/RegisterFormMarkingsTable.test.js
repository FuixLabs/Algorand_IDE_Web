// /* global BigInt */
// import React from 'react';
// import Component from './RegisterFormMarkingsTable';
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
describe('Component: Marking table ', () => {
    it('not render table', async () => {
        // let setShow = jest.fn();
        // let onDelete = jest.fn();
        // let onEdit = jest.fn();
        // let wrapper = initWrapper({
        //     props: {
        //         node,
        //         elements: Example,
        //         onDelete,
        //         setShow,
        //         onEdit,
        //         hide: true,
        //         disableAdd: false,
        //     },
        // });
        // let table = wrapper.find('[data-test="test__container-table"]').hostNodes();
        // expect(table.exists()).toEqual(false);
    });
    // it('hide button add, hide action button', async () => {
    //     let setShow = jest.fn();
    //     let wrapper = initWrapper({
    //         props: {
    //             node,
    //             elements: Example,
    //             setShow,
    //             disableAdd: true,
    //         },
    //     });

    //     let table = wrapper.find('[data-test="test__container-table"]').hostNodes();
    //     expect(table.exists()).toEqual(true);
    //     let buttonAdd = wrapper.find('[data-test="test__button-add"]').hostNodes();
    //     expect(buttonAdd.exists()).toEqual(false);
    //     let actionCell = wrapper.find('[data-test="test__action-cell"]').hostNodes();
    //     expect(actionCell.exists()).toEqual(false);
    // });
    // it('show table, with type and full button, and not has markings', async () => {
    //     let setShow = jest.fn();
    //     let onDelete = jest.fn();
    //     let onEdit = jest.fn();
    //     let wrapper = initWrapper({
    //         props: {
    //             node,
    //             elements: Example,
    //             onDelete,
    //             setShow,
    //             onEdit,
    //             hide: false,
    //             disableAdd: false,
    //         },
    //     });

    //     let table = wrapper.find('[data-test="test__container-table"]').hostNodes();
    //     expect(table.exists()).toEqual(true);
    //     //test button add
    //     let buttonAdd = wrapper.find('[data-test="test__button-add"]').hostNodes();
    //     expect(buttonAdd.exists()).toEqual(true);
    //     await waitForComponentToPaint(wrapper, () => {
    //         buttonAdd.simulate('click');
    //     });
    //     expect(setShow).toBeCalled();
    //     let actionCell = wrapper.find('[data-test="test__action-cell"]').hostNodes();
    //     expect(actionCell.exists()).toEqual(true);
    //     let typeCells = wrapper.find('[data-test="test__type_cell"]').hostNodes();
    //     expect(typeCells.length).toEqual(node.data.type.length);
    //     let message = wrapper.find('[data-test="test__dot-not-has-markings"]').hostNodes();
    //     expect(message.exists()).toEqual(true);
    // });
    // it('show table has markings, and search input', async () => {
    //     let setShow = jest.fn();
    //     let onDelete = jest.fn();
    //     let onEdit = jest.fn();
    //     node.data.markings = [
    //         {
    //             id: '1',
    //             total: '2',
    //             tokens: ['a', 'b', 'c', 'd'],
    //         },
    //     ];
    //     let wrapper = initWrapper({
    //         props: {
    //             node,
    //             elements: Example,
    //             onDelete,
    //             setShow,
    //             onEdit,
    //             hide: false,
    //             disableAdd: false,
    //         },
    //     });

    //     let message = wrapper.find('[data-test="test__dot-not-has-markings"]').hostNodes();
    //     expect(message.exists()).toEqual(false);
    //     let markingRow = wrapper.find('[data-test="test__marking-row"]').hostNodes();
    //     expect(markingRow.length).toEqual(node.data.markings.length);
    //     //test button edit
    //     let buttonEdit = wrapper.find('[data-test="test__button-edit"]').hostNodes();
    //     expect(buttonEdit.exists()).toEqual(true);
    //     await waitForComponentToPaint(wrapper, () => {
    //         buttonEdit.simulate('click');
    //     });
    //     expect(onEdit).toBeCalled();
    //     //test button delete
    //     let buttonDelete = wrapper.find('[data-test="test__button-delete"]').hostNodes();
    //     expect(buttonDelete.exists()).toEqual(true);
    //     await waitForComponentToPaint(wrapper, () => {
    //         buttonDelete.simulate('click');
    //     });
    //     expect(onDelete).toBeCalled();
    //     //test search do not match
    //     let input = wrapper.find('[data-test="test__search"] input').hostNodes();
    //     await waitForComponentToPaint(wrapper, () => {
    //         input.simulate('change', { target: { value: 'test' } });
    //     });
    //     message = wrapper.find('[data-test="test__dot-not-has-markings"]').hostNodes();
    //     expect(message.exists()).toEqual(true);
    //     markingRow = wrapper.find('[data-test="test__marking-row"]').hostNodes();
    //     expect(markingRow.length).toEqual(0);
    //     //test search match 1
    //     input = wrapper.find('[data-test="test__search"] input').hostNodes();
    //     await waitForComponentToPaint(wrapper, () => {
    //         input.simulate('change', { target: { value: 'a' } });
    //     });
    //     message = wrapper.find('[data-test="test__dot-not-has-markings"]').hostNodes();
    //     expect(message.exists()).toEqual(false);
    //     markingRow = wrapper.find('[data-test="test__marking-row"]').hostNodes();
    //     expect(markingRow.length).toEqual(1);
    // });
});
