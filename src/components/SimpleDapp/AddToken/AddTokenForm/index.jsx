import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import st from '../../../RightSideBar/styles/RegisterForm';
import { Modal, Button, Typography, IconButton } from '@mui/material';
import RegisterFormAddMarkings from './RegisterFormAddMarkings';
import RegisterFormMarkingsTable from './RegisterFormMarkingsTable';
import '../../../RightSideBar/styles/index.scss';
import useShallowEqualSelector from '../../../../redux/customHook/useShallowEqualSelector';

const MarkingsTab = ({ node, classes, open, handleClose }) => {
    const [showForm, setShow] = useState(false);
    const isFireable = useShallowEqualSelector((state) => {
        return state.dapp.isFireable;
    });

    const _handleClose = () => {
        setShow(false);
        handleClose();
    };

    const _setShow = () => {
        setShow(!showForm);
    };

    let _showForm = showForm ? true : false;
    return (
        <Modal open={open} onClose={_handleClose}>
            <div className={'register-dialog ' + classes.modal} data-test="test__modal-container">
                <div className="header-dialog">
                    {!_showForm ? (
                        <Typography className="title" color="textPrimary">
                            Markings of {node?.data?.label}
                        </Typography>
                    ) : (
                        <>
                            <Button
                                color="secondary"
                                variant="outlined"
                                onClick={_setShow}
                                className="button-back"
                                data-test="test__button-back"
                                sx={{ color: 'text.primary' }}
                            >
                                Back
                            </Button>
                            <Typography className="title" color="textPrimary" data-test="test__title">
                                Add New Marking
                            </Typography>
                        </>
                    )}
                    <IconButton className="button-close" variant="contained" onClick={_handleClose}>
                        <span className="material-icons">close</span>
                    </IconButton>
                </div>
                <RegisterFormAddMarkings node={node} onSave={() => {}} setShow={_setShow} hide={!_showForm} />
                <RegisterFormMarkingsTable waitForFiring={isFireable} hide={_showForm} node={node} setShow={_setShow} />
            </div>
        </Modal>
    );
};

MarkingsTab.propTypes = {
    node: PropTypes.object,
    classes: PropTypes.object,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
};
export default withStyles(st)(MarkingsTab);
