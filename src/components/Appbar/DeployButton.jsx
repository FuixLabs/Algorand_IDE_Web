import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NETWORK_CONSTANT from '../../constants/network';
import PropTypes from 'prop-types';
import { Divider, InputAdornment } from '@mui/material';
import { Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import CopyPopover from '../CopyPopover';
import WalletConnect from './WalletConnect';
import walletConnectConstants from '../../redux/constants/walletConnect';
import AlgorandLogoFull from '../Icons/AlgorandLogoFull';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { walletConnectActions } from '../../redux/reducer/walletConnect';
import './styles/DeployButton.scss';
import { formatBigNumWithDecimals } from '../../scripts/util';
const { UPDATE_CHAIN, DEPLOY_CHANGE } = walletConnectConstants;
import Constant from '../../util/Constant';
DeployButton.propTypes = {
    onDeploy: PropTypes.func,
    convert: PropTypes.func,
    handleOpen: PropTypes.func,
    disabled: PropTypes.bool,
};

DeployButton.defaultProps = {
    onDeploy: null,
    convert: () => {},
};

const LeftIcon = styled(`span`)({
    marginRight: 8,
});

const RightIcon = styled(`span`)({
    marginLeft: 8,
});
const Message = styled(Typography)({
    fontSize: 14,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    marginTop: 32,
    justifyContent: 'center',
});
const Message2 = styled(Typography)({
    fontSize: 12,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    marginTop: 32,
    justifyContent: 'center',
});
const AppOverviewLink = styled(Link)({
    textDecoration: 'none',
    display: 'flex',
    justifyContent: 'flex-end',
});

function DeployButton(props) {
    const { convert, disabled } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDeploying, setIsDeploying] = useState(false);
    const [application, setApp] = useState(null);
    const [error, setError] = useState('');
    const open = Boolean(anchorEl);
    const id = open ? 'deploy-popover' : undefined;
    const dispatch = useDispatch();
    const walletConnect = useSelector((state) => {
        return state.walletConnect;
    }, shallowEqual);
    const { chain, connector } = walletConnect;
    const handleClick = (event) => {
        if (disabled) return;
        setAnchorEl(event.currentTarget);
        if (props.handleOpen) {
            props.handleOpen();
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const getBalanceFromError = (error = '') => {
        let mainError = error.substring(error.indexOf('below min'), error.length).replace('below min ', ''),
            balance = '',
            i = 0;
        while (mainError[i] !== ' ') {
            balance += mainError[i];
            i++;
        }
        return formatBigNumWithDecimals(BigInt(balance), walletConnect.assets[0].decimals);
    };
    const handleDeploy = async () => {
        let { elements, computeEngine } = convert();
        if (!computeEngine) {
            setError('Wrong design!');
            return;
        }

        /* check number of transitions, not exceeds 60 */
        let count = 0;
        for (let i = 0; i < elements.length; i++) {
            if (Constant.isOperation(elements[i])) count++;
        }
        if (count > 60) {
            setError(`Number of operations must be at most 60. (Current: ${count})`);
            return;
        }

        setError('');
        setApp(null);
        setIsDeploying(true);
        if (!props.onDeploy) return setIsDeploying(false);

        try {
            let res = await props.onDeploy(elements, computeEngine, chain);
            if (!res) {
                setError('Deploy failed');
            } else {
                setApp(res);
                dispatch(walletConnectActions[DEPLOY_CHANGE]());
            }
        } catch (e) {
            setIsDeploying(false);
            if (e.message.indexOf('below min') >= 0) {
                return setError(
                    `Your account must reach the minimum balance of ${getBalanceFromError(e.message)} ${
                        walletConnect.assets[0].name
                    } in order to perform deployments.`
                );
            }
            setError(e.message);
        }
        setIsDeploying(false);
    };

    const renderSelectValue = (value) => {
        return (
            <Typography
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    fontSize: 14,
                    color: 'primary.light',
                }}
            >
                <AlgorandLogoFull className="logo" />
                {NETWORK_CONSTANT.find((item) => item.value === value).label}
            </Typography>
        );
    };
    return (
        <>
            <Button
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 14,
                    minHeight: 45,
                    px: 2,
                    fontWeight: 'bold',
                }}
                variant="contained"
                aria-describedby={id}
                onClick={handleClick}
                disabled={disabled}
                data-test="test__button-open"
            >
                <LeftIcon className="material-icons">rocket_launch</LeftIcon>
                Deploy
            </Button>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                sx={{
                    '& .MuiPopover-paper': {
                        border: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.toolbar',
                        backgroundImage: 'unset',
                        borderRadius: 1,
                        mt: 1,
                        p: 4,
                        width: { sm: 400, xs: 300 },
                    },
                }}
                className="popover-deploy"
            >
                <Typography sx={{ fontWeight: 'bold', fontSize: 21, pb: 4 }}>Deploy To Network</Typography>
                <FormControl fullWidth>
                    <InputLabel id="network-select-label">Network</InputLabel>
                    <Select
                        id="network-select"
                        value={chain}
                        label="Network"
                        onChange={(e) => {
                            dispatch(
                                walletConnectActions[UPDATE_CHAIN]({
                                    chain: e.target.value,
                                })
                            );
                        }}
                        sx={{
                            maxHeight: 56,
                            '& fieldset': {
                                borderColor: 'divider',
                            },
                        }}
                        renderValue={renderSelectValue}
                    >
                        {NETWORK_CONSTANT.map((item, index) => (
                            <MenuItem value={item.value} disabled={item.value === 'mainnet'} key={index}>
                                {renderSelectValue(item.value)}
                            </MenuItem>
                        ))}
                    </Select>
                    <Box
                        className="swap-vert"
                        component="div"
                        sx={{
                            '& span': {
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                            },
                        }}
                    >
                        <span className="material-icons">swap_vert</span>
                    </Box>
                    <WalletConnect />
                </FormControl>
                <Button
                    sx={{
                        mt: 5,
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 14,
                        minHeight: 45,
                        px: 2,
                        width: '100%',
                        bgcolor: application?.appId ? 'success.light' : 'primary.main',
                        fontWeight: 'bold',
                    }}
                    variant="contained"
                    onClick={handleDeploy}
                    disabled={!connector || !connector.connected || isDeploying}
                    data-test="test__button-deploy"
                >
                    {isDeploying ? <CircularProgress color="primary" size={30} /> : 'Deploy'}
                </Button>
                {!connector || !connector.connected ? (
                    <Message2 color="textPrimary" data-test="test__message-connect">
                        <LeftIcon className="material-icons" sx={{ mr: 1 }}>
                            info
                        </LeftIcon>
                        Please connect to wallet before deploy
                    </Message2>
                ) : !error && !application ? (
                    <Message color="success.light" data-test="test__message-connected">
                        <LeftIcon className="material-icons" sx={{ mr: 1 }}>
                            done
                        </LeftIcon>
                        Ready to deploy
                    </Message>
                ) : (
                    ''
                )}
                {connector && connector.connected && error && (
                    <Message color="error.light" data-test="test__message-deploy_failed">
                        <LeftIcon className="material-icons" sx={{ mr: 1 }}>
                            error
                        </LeftIcon>
                        <Typography
                            color="error.light"
                            component="span"
                            sx={{
                                wordBreak: 'break-word',
                                fontSize: 'inherit',
                                fontWeight: 'inherit',
                                overflow: 'hidden',
                                maxHeight: '20rem',
                                overflow: 'hidden',
                                WebkitLineClamp: '10',
                                display: 'box',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'normal',
                            }}
                        >
                            {' '}
                            {error}
                        </Typography>
                    </Message>
                )}
                {!error && connector && connector.connected && application?.appId && (
                    <Box>
                        <Message
                            sx={{
                                my: 4,
                            }}
                            color="success.light"
                            data-test="test__message-deploy-success"
                        >
                            <LeftIcon className="material-icons" sx={{ mr: 1 }}>
                                check_circle
                            </LeftIcon>
                            Contract has deployed successfully
                        </Message>
                        <Divider />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Transaction ID"
                            sx={{
                                mt: 4,
                                '& fieldset': {
                                    borderColor: 'divider',
                                },
                            }}
                            value={application.txId}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <CopyPopover copyValue={application.txId} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <AppOverviewLink to={'/testnet/application/' + application.appId} target="_blank">
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: 3,
                                    justifyContent: 'center',
                                }}
                                color="textPrimary"
                            >
                                Go to Application Overview
                                <RightIcon className="material-icons">open_in_new</RightIcon>
                            </Typography>
                        </AppOverviewLink>
                    </Box>
                )}
            </Popover>
        </>
    );
}

export default DeployButton;
