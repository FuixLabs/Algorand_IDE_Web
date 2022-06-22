import React from 'react';
import PropTypes from 'prop-types';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/system';

CopyPopover.propTypes = {
    copyValue: PropTypes.any,
    color: PropTypes.string,
};
CopyPopover.defaultProps = {
    copyValue: '',
    color: '',
};

const CopyIcon = styled('span')({
    color: 'text.primary',
    fontSize: 16,
});

function CopyPopover(props) {
    const { copyValue = '' } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'copied-popover' : undefined;

    const colorSx = props.color ? { color: props.color } : {};

    return (
        <>
            <Tooltip title={id ? '' : 'Copy'} placement="bottom-start">
                <IconButton
                    onClick={(e) => {
                        handleClick(e);
                        if (Boolean(navigator.clipboard)) {
                            navigator.clipboard.writeText(copyValue);
                        }
                        setTimeout(handleClose, 1000);
                    }}
                    aria-label="copy"
                >
                    <CopyIcon sx={colorSx} className="material-icons">
                        content_copy
                    </CopyIcon>
                </IconButton>
            </Tooltip>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                sx={{
                    mt: 1,
                }}
            >
                <Typography sx={{ p: 1, fontSize: 12 }}>Copied.</Typography>
            </Popover>
        </>
    );
}

export default CopyPopover;
