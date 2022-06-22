import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Paper, Button, Typography, IconButton } from '@mui/material';
import './styles/index.scss';

const ConfirmModal = ({
    open,
    title,
    handleClose = () => {},
    onOk = () => {},
    children,
    icon,
    labelButtonCancel,
    labelButtonOk,
    buttonCancelProps,
    buttonOkProps,
}) => {
    return (
        <Modal open={open} onClose={handleClose} className="confirm-modal">
            <Paper className="content" data-test="text__content-modal">
                <div className="header-modal">
                    {icon ? (
                        <span data-test="test__header-icon" className="material-icons header-icon">
                            {icon}
                        </span>
                    ) : (
                        ''
                    )}
                    <Typography className="title" color="textPrimary" data-text="text__title">
                        {title}
                    </Typography>
                    <IconButton className="button-close" variant="contained" onClick={handleClose}>
                        <span className="material-icons">close</span>
                    </IconButton>
                </div>
                <div className="body-modal">{children}</div>
                <div className="footer-modal">
                    <Button
                        className="button-cancel"
                        variant="outlined"
                        color="secondary"
                        onClick={handleClose}
                        data-text="text__button-cancel"
                        {...buttonCancelProps}
                    >
                        {labelButtonCancel ? labelButtonCancel : 'CANCEL'}
                    </Button>
                    <Button
                        className="button-yes"
                        variant="contained"
                        color="primary"
                        onClick={onOk}
                        data-text="text__button-ok"
                        {...buttonOkProps}
                    >
                        {labelButtonOk ? labelButtonOk : 'OK'}
                    </Button>
                </div>
            </Paper>
        </Modal>
    );
};

ConfirmModal.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    onOk: PropTypes.func,
    children: PropTypes.any,
    labelButtonCancel: PropTypes.any,
    labelButtonOk: PropTypes.any,
    title: PropTypes.any,
    icon: PropTypes.any,
    buttonOkProps: PropTypes.any,
    buttonCancelProps: PropTypes.any,
};

export default ConfirmModal;
