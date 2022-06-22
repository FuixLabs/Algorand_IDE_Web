import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Paper, Button, Typography, IconButton } from '@mui/material';
import './styles/Confirm.scss';

const ConfirmDialog = ({ open, handleClose, onOk }) => {
    return (
        <Modal open={open} onClose={handleClose} className="dialog">
            <Paper className="content">
                <div className="header-dialog">
                    <Typography className="title" color="textPrimary">
                        Do you want to delete all components?
                    </Typography>
                    <IconButton className="button-close" variant="contained" onClick={handleClose}>
                        <span className="material-icons">close</span>
                    </IconButton>
                </div>
                <div className="body-dialog">
                    <Typography color="textSecondary">
                        All your current components and data will be erased. You have to start again. Are you sure?
                    </Typography>
                </div>
                <div className="footer-dialog">
                    <Button className="button-cancel" variant="outlined" color="secondary" onClick={handleClose}>
                        CANCEL
                    </Button>
                    <Button className="button-yes" variant="contained" color="primary" onClick={onOk}>
                        YES, DELETE ALL
                    </Button>
                </div>
            </Paper>
        </Modal>
    );
};

ConfirmDialog.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    onOk: PropTypes.func,
};

export default ConfirmDialog;
