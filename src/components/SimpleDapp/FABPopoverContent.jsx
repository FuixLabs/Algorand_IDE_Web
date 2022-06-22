import { Box, Typography, IconButton, Popover } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import WalletConnect from '../Appbar/WalletConnect';
import AddToken from './AddToken';
import './styles/Popover.scss';
PopoverContent.propTypes = {
    action: PropTypes.string,
    onClose: PropTypes.func,
    anchorEl: PropTypes.object,
};
export default function PopoverContent({ action, onClose, anchorEl }) {
    const getTitle = () => {
        switch (action) {
            case 'add':
                return 'Add New Token';
            case 'account':
                return 'Account';
            default:
                return '';
        }
    };

    const getContent = () => {
        switch (action) {
            case 'add':
                return <AddToken />;
            case 'account':
                return (
                    <Box sx={{ width: 350 }}>
                        <WalletConnect />
                    </Box>
                );
            default:
                return;
        }
    };

    return (
        <Popover
            id={'popover'}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            sx={{
                mt: 1,
                '& .MuiPopover-paper': {
                    border: 1,
                    borderColor: 'divider',
                    backgroundImage: 'unset',
                    borderRadius: 1,
                    mt: 1,
                    p: 4,
                },
            }}
        >
            <Box className="popover-container">
                <Box className="header">
                    <Typography className="title">{getTitle()}</Typography>
                    <IconButton className="button-close" variant="contained" onClick={onClose}>
                        <span className="material-icons">close</span>
                    </IconButton>
                </Box>
                {getContent()}
            </Box>
        </Popover>
    );
}
