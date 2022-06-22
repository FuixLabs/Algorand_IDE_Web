import React from 'react';
import PropTypes from 'prop-types';
import { Button, Box, IconButton, Modal, Typography, Popover } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { withStyles } from '@mui/styles';
import st from './styles/HelpModal';
import './styles/HelpModal.scss';
import Constants from './Constants';
const Title = ({ text }) => (
    <Typography component="h4" className="title">
        {text}
    </Typography>
);
Title.propTypes = {
    text: PropTypes.string,
};
const Des = ({ des, type, ex, classes }) => {
    return (
        <Box component={type === 'list' ? 'ul' : 'div'}>
            {des.map((item, index) => {
                return (
                    <Typography
                        color="textSecondary"
                        className="des"
                        component={type === 'list' ? 'li' : 'p'}
                        key={index}
                    >
                        {item}
                    </Typography>
                );
            })}
            {ex
                ? ex.map((item, index) => (
                      <Typography key={index} className={classes.ex}>
                          {item}
                      </Typography>
                  ))
                : ''}
        </Box>
    );
};
Des.propTypes = {
    des: PropTypes.array,
    type: PropTypes.string,
    ex: PropTypes.array,
    classes: PropTypes.any,
};
const Data = ({ data, classes }) => {
    return (
        <>
            <Title text={data.title} />
            <Des des={data.description} type={data.typeDes} ex={data.ex} classes={classes} />
        </>
    );
};
Data.propTypes = {
    data: PropTypes.object,
    classes: PropTypes.object,
};
const HelpModal = ({ onClose, open, classes }) => {
    let content = Constants.content;
    return (
        <Modal
            classes={{ root: 'help-modal' }}
            BackdropProps={{
                classes: {
                    root: 'backdrop',
                },
            }}
            open={open}
            onClose={onClose}
        >
            <div className={'content ' + classes.content}>
                <div className="header">
                    <Typography color="textPrimary" className="title">
                        Help Center
                    </Typography>
                    <IconButton onClick={onClose} className="button-close">
                        <CancelIcon />
                    </IconButton>
                </div>
                <div className="body">
                    {content.map((item, index) => {
                        return <Data key={index} data={item} classes={classes} />;
                    })}
                </div>
            </div>
        </Modal>
    );
};
HelpModal.propTypes = {
    classes: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
};
export default withStyles(st)(HelpModal);
