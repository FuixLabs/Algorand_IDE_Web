import React from 'react';
import PropTypes from 'prop-types';
import './styles/index.scss';
import { withStyles } from '@mui/styles';
import st from './styles/AddGuard';
import { Typography } from '@mui/material';

const AddGuard = ({ title, classes, children }) => {
    return (
        <div className={'header ' + classes.borderColor}>
            <Typography color="textPrimary" className="title" data-test="test__title">
                {title}
            </Typography>
            {children}
        </div>
    );
};

AddGuard.propTypes = {
    title: PropTypes.string,
    classes: PropTypes.object,
    children: PropTypes.object,
};
export default withStyles(st)(AddGuard);
