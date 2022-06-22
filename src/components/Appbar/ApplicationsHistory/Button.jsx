import React from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import st from './styles/index';
import PropTypes from 'prop-types';
import HashIcon from '../../Icons/HashIcon';
const ButtonShow = ({ number, onClick, classes }) => {
    return (
        <Tooltip title="Applications history">
            <IconButton className="button-show-transaction" onClick={onClick}>
                <HashIcon />
                <div className={classes.info}>
                    <Typography>{number || 0}</Typography>
                </div>
            </IconButton>
        </Tooltip>
    );
};
ButtonShow.propTypes = {
    classes: PropTypes.object,
    number: PropTypes.number,
    onClick: PropTypes.func,
};
export default withStyles(st)(ButtonShow);
