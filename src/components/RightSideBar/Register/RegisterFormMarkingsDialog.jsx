import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import st from '../styles/RegisterForm';
import { Modal, Button, Typography, IconButton } from '@mui/material';
import RegisterFormAddMarkings from './RegisterFormAddMarkings';
import RegisterFormMarkingsTable from './RegisterFormMarkingsTable';
import '../styles/index.scss';

const MarkingsTab = ({ node, onSave, classes, open, handleClose }) => {
    const [showForm, setShow] = useState(false);
    const [selectRow, setSelectRow] = useState('');

    const _handleClose = () => {
        setShow(false);
        setSelectRow('');
        handleClose();
    };

    const _setShow = () => {
        setShow(!showForm);
    };

    const onDelete = (marking) => {
        let _node = JSON.parse(JSON.stringify(node));
        _node.data.markings = _node.data.markings.filter((item) => item.id !== marking.id);
        onSave(_node);
    };

    let title = 'Add New Marking';
    if (selectRow) {
        title = 'Edit Marking';
    }
    let _showForm = selectRow || showForm ? true : false;
    let hasNotType = !node.data.type || !node.data.type.length || !node.data.type[0]?.value ? true : false;
    return (
        <Modal open={open} onClose={_handleClose}>
            <div className={'register-dialog ' + classes.modal} data-test="test__modal-container">
                <div className="header-dialog">
                    {!_showForm ? (
                        <Typography className="title" color="textPrimary">
                            Markings
                        </Typography>
                    ) : (
                        <>
                            <Button
                                color="secondary"
                                variant="outlined"
                                onClick={() => {
                                    _setShow();
                                    setSelectRow('');
                                }}
                                className="button-back"
                                data-test="test__button-back"
                                sx={{ color: 'text.primary' }}
                            >
                                Back
                            </Button>
                            <Typography className="title" color="textPrimary" data-test="test__title">
                                {title}
                            </Typography>
                        </>
                    )}
                    <IconButton className="button-close" variant="contained" onClick={_handleClose}>
                        <span className="material-icons">close</span>
                    </IconButton>
                </div>
                {hasNotType ? (
                    <div className="warning-define-type" data-test="test__do-not-has-type">
                        <Typography align="center" color="textPrimary">
                            Please define type before add marking
                        </Typography>
                    </div>
                ) : (
                    ''
                )}
                <RegisterFormAddMarkings
                    node={node}
                    onSave={onSave}
                    data={selectRow}
                    setShow={_setShow}
                    setSelectRow={setSelectRow}
                    hide={!_showForm || hasNotType}
                    onDelete={onDelete}
                />
                <RegisterFormMarkingsTable
                    hide={_showForm || hasNotType}
                    node={node}
                    setShow={_setShow}
                    onEdit={setSelectRow}
                    onDelete={onDelete}
                    onSave={onSave}
                />
            </div>
        </Modal>
    );
};

MarkingsTab.propTypes = {
    node: PropTypes.object,
    onSave: PropTypes.func,
    classes: PropTypes.object,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
};
export default withStyles(st)(MarkingsTab);
