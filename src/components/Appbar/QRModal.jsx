import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import PropTypes from 'prop-types';
import { Button, IconButton, Modal, Typography, Popover } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { withStyles } from '@mui/styles';
import st from './styles/QRModal';
import CopyToClipboard from '../CopyToClipboard';
import WalletConnectIcon from '../../images/walletConnectIcon.svg';
import AlgorandWalletIcon from '../Icons/AlgorandWalletIcon';
import './styles/QRModal.scss';

const QRModal = ({ classes, open, handleClose, uri }) => {
    const [copied, setCopied] = useState(false);

    const onClick = (e) => {
        setCopied(e.currentTarget);
        setTimeout(_handleClose, 1000);
    };
    const _handleClose = () => {
        setCopied(null);
    };
    return !uri ? (
        ''
    ) : (
        <Modal
            classes={{ root: 'q-r-modal' }}
            BackdropProps={{
                classes: {
                    root: 'backdrop',
                },
            }}
            open={open}
            onClose={handleClose}
        >
            <div className="content">
                <div className="header">
                    <div className="title">
                        <img src={WalletConnectIcon} alt="wallet-connect-icon" className="wallet-connect-icon"></img>
                        <Typography color="#ffffff"> WalletConnect </Typography>
                    </div>
                    <IconButton onClick={handleClose} className="button-close">
                        <CancelIcon sx={{ color: '#fff' }} />
                    </IconButton>
                </div>
                <div className={'body ' + classes.body}>
                    <Typography color="textSecondary" className="title">
                        Scan QR code with a WalletConnect-compatible wallet
                    </Typography>
                    <div className="container-qr">
                        <QRCode value={uri} size={320} />
                    </div>
                    <CopyToClipboard color="secondary" variant="outlined" text={uri} onClick={onClick}>
                        <> Copy to Clipboard</>
                    </CopyToClipboard>
                    <Popover
                        //id={id}
                        open={Boolean(copied)}
                        anchorEl={copied}
                        onClose={_handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        sx={{
                            mt: 1,
                        }}
                    >
                        <Typography sx={{ p: 1, fontSize: 12 }}>Copied.</Typography>
                    </Popover>
                </div>

                <div className={'footer ' + classes.footer}>
                    <div>
                        <AlgorandWalletIcon />
                        <Typography color="textSecondary">
                            Pera Wallet is the easiest and safest way to store, buy and swap* on the Algorand
                            blockchain.
                        </Typography>
                    </div>
                    <Button color="primary" variant="outlined" href="https://perawallet.app/" target="_blank">
                        Download Wallet
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
QRModal.propTypes = {
    classes: PropTypes.object,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    uri: PropTypes.string,
};
export default withStyles(st)(QRModal);
