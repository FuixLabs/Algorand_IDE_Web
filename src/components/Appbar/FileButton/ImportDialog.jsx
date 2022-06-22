import React, { useRef, useCallback, useState, useContext } from 'react';
import { Typography, Modal, Button, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import modelConstants from '../../../redux/constants/model';
import { withStyles } from '@mui/styles';
import st from './styles/ImportDialog';
import { useDropzone } from 'react-dropzone';
import Chip from '@mui/material/Chip';
import './styles/ImportDialog.scss';
import messageConstants from '../../../redux/constants/message';
import { verifyElements } from '../../../scripts/util';
import { useDispatch } from 'react-redux';
import { messageActions } from '../../../redux/reducer/message';
import { modelActions } from '../../../redux/reducer/model';
import { Context } from '../../../useContext';
const { SHOW_MESSAGE } = messageConstants;
const { UPDATE_MODEL } = modelConstants;
const ImportDialog = ({ open, onClose, classes }) => {
    const [file, setFile] = useState(null);
    const [hover, setHover] = useState(false);
    const { reactFlow } = useContext(Context);
    const { state: refModel } = reactFlow;
    const dispatch = useDispatch();
    const ref = useRef();
    const onDrop = useCallback((acceptedFiles) => {
        if (!acceptedFiles[0]) {
            return;
        }
        setHover(false);
        setFile(acceptedFiles[0]);
    }, []);
    const onDragEnter = () => {
        if (hover) {
            return;
        }
        setHover(true);
    };
    const onDragLeave = () => {
        setHover(false);
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, onDragEnter, onDragLeave });
    const setElements = (_elements) => {
        dispatch(modelActions[UPDATE_MODEL]({ elements: _elements }));
    };

    const handleUploadFile = (e) => {
        if (!e.target.files[0]) {
            return;
        }
        let file = e.target.files[0];
        setFile(file);
    };
    const uploadFile = () => {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async (event) => {
            try {
                let data = JSON.parse(event.target.result);
                if (!verifyElements(data)) {
                    throw new Error('Data invalid');
                }
                if (!Array.isArray(data)) {
                    data = data.elements;
                }
                setElements(data);
                handleClose();
                setTimeout(() => {
                    refModel.fitView();
                    dispatch(
                        messageActions[SHOW_MESSAGE]({
                            message: 'Import successfully!',
                            severity: 'success',
                        })
                    );
                }, 10);
            } catch (err) {
                // console.log('err', err);
                dispatch(
                    messageActions[SHOW_MESSAGE]({
                        message: 'Import failed!',
                        severity: 'error',
                    })
                );
            }
        };
    };
    const handleDelete = () => {
        ref.current.value = '';
        setFile(null);
    };
    const handleClose = () => {
        setFile(null);
        ref.current.value = '';
        onClose();
    };

    let propsInput;
    if (isDragActive) {
        propsInput = getInputProps();
    } else {
        propsInput = { onChange: handleUploadFile, id: 'flat-button-file' };
    }
    return (
        <Modal open={open} onClose={handleClose}>
            <div className={'import-modal ' + classes.modal}>
                <div className="header">
                    <Typography className="title">Import a Model</Typography>
                    <Typography className="des">To import a model, add a JSON file and then click Import.</Typography>
                    <IconButton className="button-close" variant="contained" onClick={handleClose}>
                        <span className="material-icons">close</span>
                    </IconButton>
                </div>
                <div className="body">
                    <div className={'drop-content ' + classes.drop + (hover ? ' hover' : '')} {...getRootProps()}>
                        <input accept=".json" multiple type="file" {...propsInput} ref={ref} className="input-file" />
                        <Typography component="label" className="text" htmlFor="flat-button-file">
                            <span className="material-icons">open_in_browser</span>
                            Drag and drop a JSON file here or select a file
                        </Typography>
                    </div>
                    {file ? (
                        <>
                            <Typography className="sub-title">File to be imported:</Typography>
                            <Chip className="name-file" label={file.name} variant="outlined" onDelete={handleDelete} />
                        </>
                    ) : (
                        ''
                    )}
                </div>
                <div className="footer">
                    <Button variant="outlined" color="secondary" onClick={handleClose}>
                        CANCEL
                    </Button>
                    <Button variant="contained" color="primary" onClick={uploadFile} disabled={!file}>
                        IMPORT
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
ImportDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    classes: PropTypes.object,
};
export default withStyles(st)(ImportDialog);
