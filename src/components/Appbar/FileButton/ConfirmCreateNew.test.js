// import React from 'react';
// import Dialog from './ImportDialog';
// import muiTheme from '../../../MuiTheme';
// import { ThemeProvider } from '@mui/material/styles';
// import { mount } from 'enzyme';
// import { BrowserRouter } from 'react-router-dom';
// import { Context } from '../../useContext';
// const initWrapper = ({ open, fitView }) => {
//     let wrapper = mount(
//         <Context.Provider
//             value={{
//                 refModel: {
//                     state: { fitView },
//                     dispatch: () => '',
//                 },
//             }}
//         >
//             <ThemeProvider theme={muiTheme()}>
//                 <BrowserRouter>
//                     <Dialog open={open} />
//                 </BrowserRouter>
//             </ThemeProvider>
//         </Context.Provider>
//     );
//     return wrapper;
// };
describe('Component: Dialog import model', () => {
    it('renders a Dialog', () => {
        // const wrapper = initWrapper({
        //     open: true,
        //     fitView: () => {},
        // });
        // //setPropsImg(wrapper);
        // let dialog = wrapper.childAt(0).childAt(0);
        // expect(dialog.exists()).toEqual(true);
    });

    // it('not renders a Dialog', () => {
    //     const wrapper = initWrapper({
    //         open: false,
    //         fitView: () => {},
    //     });
    //     let dialog = wrapper.find('.confirm-modal-create').hostNodes();
    //     expect(dialog.exists()).toEqual(false);
    // });

    // it('test onClose button', () => {
    //     const fitView = jest.fn();
    //     const onClose = jest.fn(() => {
    //         onCloseMock();
    //     });
    //     const setElements = jest.fn();
    //     const wrapper = initWrapper({
    //         open: true,
    //         fitView,
    //     });
    //     // setPropsImg(wrapper);
    //     let button = wrapper.find('[data-test="test__button-close"]').hostNodes();
    //     button.simulate('click');
    //     expect(onCloseMock).toBeCalled();
    //     //expect(fitView).toBeCalled();
    // });
});
