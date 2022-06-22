import React, { useState } from 'react';
import { MenuItem, Typography } from '@mui/material';
// import PropTypes from 'prop-types';
import ButtonDropdown from '../../ButtonDropdown';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import Divider from '@mui/material/Divider';
import modelConstants from '../../../redux/constants/model';
import Example from '../../WorkBoard/Example';
import ImportDialog from './ImportDialog';
import ConfirmDialog from './ConfirmCreateNew';
import Constants from '../../../util/Constant';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { modelActions } from '../../../redux/reducer/model';
const { UPDATE_MODEL } = modelConstants;
const ITEMS = [
    {
        icon: 'create_new_folder',
        text: 'New from example',
        key: 'new',
    },
    {
        icon: 'open_in_browser',
        text: 'Import from file (.JSON)',
        key: 'import',
    },
    {
        divider: true,
    },
    {
        icon: 'cloud_download',
        text: 'Export model to JSON',
        key: 'download',
    },
];
const FileButton = ({}) => {
    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const elements = useSelector((state) => {
        return state.model.elements;
    }, shallowEqual);
    const dispatch = useDispatch();
    const setElements = () => {
        dispatch(modelActions[UPDATE_MODEL]({ elements: Example }));
    };
    const onClose = () => {
        setOpen(false);
    };
    const onCloseConfirm = () => {
        setOpenConfirm(false);
    };
    const download = (filename, text) => {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleClick = (key) => {
        switch (key) {
            case 'download':
                let _elements = JSON.parse(JSON.stringify(elements));
                _elements.forEach((item) => {
                    if (Constants.isConnection(item) && !item.label) {
                        item.label = item.data.label;
                    }
                });
                let data = {
                    elements: _elements,
                    version: Constants.version,
                    createAt: Date.now(),
                };
                download('modeler-model.json', JSON.stringify(data));
                break;
            case 'new':
                if (elements.length) {
                    return setOpenConfirm(true);
                }
                setElements();
                break;
            case 'import':
                setOpen(true);
            default:
                break;
        }
    };
    const renderMenuItems = () => {
        return ITEMS.map((item, index) => {
            return item.divider ? (
                <Divider className="divider" key={index} />
            ) : (
                <MenuItem key={index} onClick={() => handleClick(item.key)} className="menu-item-dropdown">
                    <span className="material-icons">{item.icon}</span>
                    <Typography>{item.text}</Typography>
                </MenuItem>
            );
        });
    };
    return (
        <>
            <ButtonDropdown renderMenuItems={renderMenuItems}>
                <FilePresentIcon /> File
            </ButtonDropdown>
            <ImportDialog open={open} onClose={onClose} />
            <ConfirmDialog open={openConfirm} onClose={onCloseConfirm} setElements={setElements} />
        </>
    );
};
FileButton.propTypes = {};
export default FileButton;
