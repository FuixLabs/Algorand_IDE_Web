/* global BigInt */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import WalletConnectClient from '@walletconnect/client';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import algoSrc from '../../images/algo.svg';
import walletConnectConstants from '../../redux/constants/walletConnect';
import { bridge } from '../../redux/reducer/walletConnect';
import { compactAddress } from '../../scripts/util';
import QRModal from './QRModal';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { walletConnectActions } from '../../redux/reducer/walletConnect';
import './styles/AccountButton.scss';
AccountButton.propTypes = {
    unreadNotificationNumber: PropTypes.number,
    toggleTransactionActivity: PropTypes.func,
};

AccountButton.defaultProps = {
    unreadNotificationNumber: 0,
    toggleTransactionActivity: null,
};

function AccountButton(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [uri, setUri] = useState('');
    const { assets, connector, walletConnect } = useSelector((state) => {
        const { assets, connector } = state.walletConnect;
        return { assets, connector, walletConnect: state.walletConnect };
    }, shallowEqual);
    const { accounts } = connector ? connector : {};
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
            handleOpenModal();
        }
    }, [walletConnect]);

    const onConnect = () => {
        handleCloseModal();
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
    const handleCloseModal = () => {
        setOpenModal(false);
        setUri('');
    };
    const handleOpenModal = () => {
        setOpenModal(true);
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
    const handleClick = (event) => {
        if (address) {
            return setAnchorEl(event.currentTarget);
        }
        ConnectInit();
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        disconnect();
    };

    const getPublicAddr = (address) => {
        return compactAddress(address);
    };

    return (
        <Box className="account-button-container">
            {!address ? null : (
                <>
                    <Tooltip title="Transaction Activity">
                        <IconButton
                            sx={{ color: 'text.primary' }}
                            className="transaction-activity-button"
                            onClick={props.toggleTransactionActivity}
                        >
                            <Box component="span" className="material-icons">
                                notifications
                            </Box>
                            {props.unreadNotificationNumber > 0 ? (
                                <Typography className="notification-number" sx={{ bgcolor: 'primary.dark' }}>
                                    {props.unreadNotificationNumber}
                                </Typography>
                            ) : null}
                        </IconButton>
                    </Tooltip>
                    <Divider orientation="vertical" flexItem />
                    <Box className="balance-container">
                        <Typography fontSize={10} color="textSecondary">
                            Balances
                        </Typography>
                        <Typography className="amount">
                            <Box component="img" src={algoSrc} />
                            <span data-test="test__balances">
                                {asset ? `${asset.amount} ${asset.unitName || 'units'}` : '0'}
                            </span>
                        </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                </>
            )}

            <Button
                className="account-button"
                color="inherit"
                id="account-button"
                aria-controls="account-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                data-test="test__button-sign-in"
            >
                <Box component="span" className="material-icons">
                    account_circle
                </Box>
                <Typography
                    sx={{
                        display: { xs: 'none', sm: 'flex' },
                        ml: { xs: 0, sm: 1 },
                    }}
                    fontWeight="medium"
                >
                    {address ? getPublicAddr(address) : 'Sign in'}
                </Typography>
            </Button>
            <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'account-button',
                }}
            >
                <MenuItem className="disconnect-item" onClick={handleLogout} data-test="test__disconnect">
                    <Typography className="text-container">
                        <Box component="span" className="material-icons" mr={1}>
                            logout
                        </Box>
                        Disconnect
                    </Typography>
                </MenuItem>
            </Menu>
            <QRModal uri={uri} open={openModal} handleClose={handleCloseModal} />
        </Box>
    );
}

export default AccountButton;
