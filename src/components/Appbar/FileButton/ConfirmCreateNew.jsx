import React from 'react';
import { Typography, Modal, Button, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import st from './styles/ConfirmDialog';
import './styles/ConfirmDialog.scss';
const ConfirmDialog = ({ open, onClose, classes, setElements }) => {
    const _setElements = () => {
        setElements();
        onClose();
    };
    return (
        <Modal open={open} onClose={onClose}>
            <div className={'confirm-modal-create ' + classes.modal}>
                <div className="header">
                    <IconButton className="button-close" variant="contained" onClick={onClose}>
                        <span className="material-icons">close</span>
                    </IconButton>
                </div>
                <div className="body">
                    <Typography className="title">Do you want to create a new model using the example?</Typography>
                    <Typography className="des">
                        All your current components and data will be erased. Are you sure?
                    </Typography>
                </div>
                <div className="footer">
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        CANCEL
                    </Button>
                    <Button variant="contained" color="primary" onClick={_setElements} data-test="test__button-close">
                        YES, CREATE NOW
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
ConfirmDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    setElements: PropTypes.func,
    classes: PropTypes.object,
};
export default withStyles(st)(ConfirmDialog);
