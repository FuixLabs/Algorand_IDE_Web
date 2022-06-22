import React, { useState } from 'react';
import { Modal, Typography, IconButton, CircularProgress, MenuItem, Button } from '@mui/material';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import './styles/FireableInfoModal.scss';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FireableDetails from './FireableDetails';
import ErrorIcon from '@mui/icons-material/Error';

FireableInformationModal.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    firingChainList: PropTypes.array,
    onFire: PropTypes.func,
    firingChainStatus: PropTypes.array,
    firing: PropTypes.bool,
    shouldAddHint: PropTypes.bool,
    isAdding: PropTypes.bool,
    onAddHint: PropTypes.func,
    isLastTxnAddHint: PropTypes.bool,
};

FireableInformationModal.defaultProps = {
    open: false,
    handleClose: null,
    onFire: null,
    firing: false,
    shouldAddHint: false,
    isAdding: false,
    onAddHint: null,
    isLastTxnAddHint: false,
};

const contentContainerStyle = {
    bgcolor: 'background.toolbar',
    width: {
        xs: '80vw',
        lg: '50vw',
    },
};

const CHAIN_STATUS = {
    approval_pending: {
        text: 'Approval pending.',
        color: 'primary.main',
        component: <CircularProgress size={24} color="primary" />,
    },
    pending: {
        text: 'Pending',
        color: 'warning.main',
        component: <AccessTimeFilledIcon color="warning" />,
    },
    signed: {
        text: 'Approved. Wait for firing.',
        color: 'primary.main',
        component: <AccessTimeFilledIcon color="primary" />,
    },
    firing: {
        text: 'Firing operations.',
        color: 'primary.main',
        component: <CircularProgress size={24} color="primary" />,
    },
    success: {
        text: 'Success',
        color: 'success.main',
        component: <CheckCircleIcon color="success" />,
    },
    error: {
        text: 'Click "FIRE ALL" to try again.',
        color: 'error.main',
        component: <ErrorIcon color="error" />,
    },
};

function FireableInformationModal(props) {
    const [chainId, setChainId] = useState(null);
    const {
        open,
        handleClose,
        firingChainList,
        onFire,
        firingChainStatus,
        firing,
        shouldAddHint,
        isAdding,
        onAddHint,
        isLastTxnAddHint,
    } = props;

    const showDetail = (index) => {
        return () => setChainId(index);
    };

    const onClose = () => {
        setChainId(null);
        handleClose();
    };

    const getNumberOfOperations = (fireTransitionArray) => {
        let count = 0;
        fireTransitionArray.map((item) => {
            if (!item.outToken) count++;
        });
        let operation = fireTransitionArray.length - count;
        let res = '';
        if (operation) res = operation + ' ' + (operation > 1 ? 'operations' : 'operation');
        if (count) res = res + (res ? ', ' : '') + count + ' ' + (count > 1 ? 'unexpected errors' : 'unexpected error');
        return res;
    };

    const getTitle = (chainId) => {
        return (
            <>
                {chainId !== null ? `Firing Chain  ${chainId + 1}` : 'Fireable Information'}
                {chainId !== null && (
                    <Button variant="outlined" color="secondary" onClick={showDetail(null)}>
                        Back
                    </Button>
                )}
            </>
        );
    };

    return (
        <Modal open={open} onClose={onClose} hideBackdrop>
            <Box className="fireable-container" sx={contentContainerStyle}>
                <Box className="header">
                    <Typography className="title">{getTitle(chainId)}</Typography>
                    <IconButton className="button-close" variant="contained" onClick={onClose}>
                        <span className="material-icons">close</span>
                    </IconButton>
                </Box>
                {shouldAddHint ? (
                    <>
                        <Box className="list-container">
                            <Typography>
                                The model is still having fireable operation(s) but they are not ready on chain. Send a
                                request to continue firing these operations.
                            </Typography>
                        </Box>
                        <Button
                            onClick={onAddHint}
                            variant="contained"
                            disabled={isAdding || !shouldAddHint || isLastTxnAddHint}
                        >
                            {isAdding ? <CircularProgress size={24} /> : 'SEND'}
                        </Button>
                    </>
                ) : chainId !== null ? (
                    <FireableDetails fireTransitionArray={firingChainList[chainId].fireTransitionArray} />
                ) : (
                    <>
                        <Box className="list-container">
                            {firingChainList?.map((item, index) => {
                                const status = CHAIN_STATUS[firingChainStatus[index]];

                                return (
                                    <MenuItem
                                        key={index}
                                        className="fire-section"
                                        sx={{ bgcolor: 'secondary.main' }}
                                        onClick={showDetail(index)}
                                    >
                                        <Box>
                                            <Typography className="title">
                                                Firing Chain {index + 1} (
                                                {getNumberOfOperations(item.fireTransitionArray)})
                                            </Typography>
                                            <Typography sx={{ color: status.color }}>{status.text}</Typography>
                                        </Box>
                                        <Box className="status-icon-container">{status.component}</Box>
                                    </MenuItem>
                                );
                            })}
                        </Box>
                        <Button
                            onClick={onFire}
                            variant="contained"
                            disabled={firing || firingChainStatus?.[firingChainStatus.length - 1] === 'success'}
                        >
                            FIRE ALL
                        </Button>
                    </>
                )}
            </Box>
        </Modal>
    );
}

export default FireableInformationModal;
