import React from 'react';
import { Button, Menu, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import './styles/index.scss';
const ButtonDropdown = ({ children, renderMenuItems }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Button onClick={handleClick} color="secondary">
                <Typography color="textPrimary" className="button-dropdown-text">
                    {children}
                </Typography>
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                classes={{
                    paper: 'paper-dropdown',
                }}
            >
                {renderMenuItems()}
            </Menu>
        </>
    );
};
ButtonDropdown.propTypes = {
    renderMenuItems: PropTypes.func,
    children: PropTypes.any,
};
export default ButtonDropdown;
