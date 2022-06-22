/* global BigInt */

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Typography } from '@mui/material';
import { PropTypes } from 'prop-types';
import WalletConnectClient from '@walletconnect/client';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import { withStyles } from '@mui/styles';
import st from './styles/WalletConnect';
import QRModal from './QRModal';
import walletConnectConstants from '../../redux/constants/walletConnect';
import { bridge } from '../../redux/reducer/walletConnect';
import { compactAddress } from '../../scripts/util';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { walletConnectActions } from '../../redux/reducer/walletConnect';
import './styles/WalletConnect.scss';

const WalletConnect = ({ classes }) => {
    const [open, setOpen] = useState(false);
    const [uri, setUri] = useState('');
    const walletConnect = useSelector((state) => {
        return state.walletConnect;
    }, shallowEqual);
    const { assets, connector } = walletConnect;
    const { accounts } = connector ? connector : {};
    const dispatch = useDispatch();
    const ConnectInit = useCallback(async () => {
        // create new connector
        const connector = new WalletConnectClient({
            bridge,
        });
        dispatch(
            walletConnectActions[walletConnectConstants.UPDATE_CONNECTOR]({
                connector,
            })
        );
        // check if already connected
        if (!connector.connected) {
            // create new session
            await connector.createSession();
            setUri(connector.uri);
            handleOpen();
        }
    }, [walletConnect]);

    const onConnect = () => {
        // console.log('onConnect');
        handleClose();
    };

    const subscribeToEvents = async () => {
        if (!connector) {
            return;
        }
        connector.on('connect', (error, payload) => {
            if (error) {
                throw error;
            }
            onConnect(payload);
        });
    };
    useEffect(() => {
        subscribeToEvents();
    }, [connector]);

    const disconnect = () => {
        if (connector) {
            connector.killSession();
        }
    };
    const handleClose = () => {
        setOpen(false);
        setUri('');
    };
    const handleOpen = () => {
        setOpen(true);
    };
    let address = accounts && accounts.length ? accounts[0] : null;
    let asset = (assets && assets[0]) || {
        id: 0,
        amount: BigInt(0),
        creator: '',
        frozen: false,
        decimals: 6,
        name: 'Algo',
        unitName: 'Algo',
    };
    return (
        <div className="wallet-connect-container">
            {address ? (
                <div className={'account-info ' + classes.borderInput}>
                    <div className="info">
                        <AccountBalanceWalletIcon />
                        <div className="account">
                            <Typography className="address" data-test="test__address">
                                {compactAddress(address)}
                            </Typography>
                            <Typography color="textSecondary" data-test="test__balances">
                                {asset ? `${asset.amount} ${asset.unitName || 'units'}` : '0'}
                            </Typography>
                        </div>
                    </div>
                    <Button colo="primary" onClick={disconnect} data-test="test__button-disconnect">
                        <LogoutIcon />
                        Disconnect
                    </Button>
                </div>
            ) : (
                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    className={'button-connect ' + classes.borderButton}
                    onClick={() => ConnectInit()}
                    data-test="test__button_connect"
                >
                    Connect to WalletConnect
                </Button>
            )}
            <QRModal uri={uri} open={open} handleClose={handleClose} />
        </div>
    );
};

WalletConnect.propTypes = {
    classes: PropTypes.object,
};
export default withStyles(st)(WalletConnect);
