import React from 'react';
import Dialog from './QRModal';
import muiTheme from '../../MuiTheme';
import { ThemeProvider } from '@mui/material/styles';
import { shallow, mount } from 'enzyme';
import WalletConnectIcon from '../../images/walletConnectIcon.svg';
import AlgorandIcon from '../../images/icon_algo_wallet.svg';
// const setPropsImg = (wrapper) => {
//     wrapper.find('.wallet-connect-icon').setProps({ src: WalletConnectIcon });
//     wrapper.find('img.title').setProps({ src: AlgorandIcon });
// };
describe('Component: Dialog show QRCode', () => {
    it('renders a Dialog', () => {
        const wrapper = shallow(
            <ThemeProvider theme={muiTheme()}>
                <Dialog open={true} uri="test.com" src1={WalletConnectIcon} src2={AlgorandIcon} />
            </ThemeProvider>
        );
        //setPropsImg(wrapper);
        let dialog = wrapper.childAt(0).childAt(0);
        expect(dialog.exists()).toEqual(true);
    });

    it('not renders a Dialog when uri undefined', () => {
        const wrapper = mount(
            <ThemeProvider theme={muiTheme()}>
                <Dialog open={true} />
            </ThemeProvider>
        );
        let dialog = wrapper.find('.q-r-modal').hostNodes();
        expect(dialog.exists()).toEqual(false);
    });

    it('test onClose button', () => {
        const onCloseMock = jest.fn();
        const onClose = jest.fn(() => {
            onCloseMock();
        });
        const wrapper = mount(
            <ThemeProvider theme={muiTheme()}>
                <Dialog open={true} handleClose={onClose} uri="test.com" src1={WalletConnectIcon} src2={AlgorandIcon} />
            </ThemeProvider>
        );
        // setPropsImg(wrapper);
        let button = wrapper.find('.button-close').hostNodes();
        button.simulate('click');
        expect(onCloseMock).toBeCalled();
    });
});
