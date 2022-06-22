import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './styles/index.scss';
import { withStyles } from '@mui/styles';
import st from './styles/index';
import { Typography, Tooltip, IconButton, Fab } from '@mui/material';
import Constants from '../../util/Constant';
import InfoIcon from '@mui/icons-material/Info';
import Register from '../Icons/Register';
import Operation from '../Icons/Operation';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
const LeftSideBar = ({ classes }) => {
    const [open, setOpen] = useState(true);
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData(Constants.nodeType, nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const toggleSidebar = () => {
        setOpen(!open);
    };

    const date = new Date();
    return (
        <>
            {!open && (
                <Tooltip title={'Add Component'} placement="right" onClick={toggleSidebar}>
                    <Fab className={'fab-sidebar'} color="primary">
                        <DashboardCustomizeIcon />
                    </Fab>
                </Tooltip>
            )}
            <div className={'left-side-bar ' + (!open ? 'closed ' : '') + classes.container}>
                <div className={classes.header + '  header'}>
                    <div className="container-title">
                        <Typography
                            color="textPrimary"
                            className="title"
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                            Add Component
                            <Tooltip
                                classes={{ tooltip: 'tooltip' }}
                                title="Dragging and dropping “Register” and “Operation” components into the workboard, and then making the connection between them!"
                            >
                                <InfoIcon className={classes.infoIcon} />
                            </Tooltip>
                        </Typography>
                        {open && (
                            <IconButton onClick={toggleSidebar}>
                                <CloseOutlinedIcon />
                            </IconButton>
                        )}
                    </div>
                </div>
                <div className="body">
                    <div className="list-item">
                        <div
                            className={'register ' + classes.register}
                            onDragStart={(event) => onDragStart(event, Constants.register.type)}
                            draggable
                        >
                            <div className="svg-content">
                                <Register />
                            </div>
                            <Typography className={'name ' + classes.registerText}>Register</Typography>
                        </div>
                        <div
                            className={'operation ' + classes.operation}
                            onDragStart={(event) => onDragStart(event, Constants.operation.type)}
                            draggable
                        >
                            <div className="svg-content">
                                <Operation />
                            </div>
                            <Typography className={'name ' + classes.operationText}> Operation</Typography>
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <Typography className="copy-right" color="textSecondary">
                        ©{date.getFullYear()}. A product by fuixlabs.com
                    </Typography>
                </div>
            </div>
        </>
    );
};

LeftSideBar.propTypes = {
    classes: PropTypes.object,
};
export default withStyles(st)(LeftSideBar);
