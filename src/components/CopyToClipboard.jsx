import React from 'react';
import PropTypes from 'prop-types';
import { useClipboard } from 'use-clipboard-copy';
import { Button } from '@mui/material';
import styles from './styles/CopyToClipboardStyles';
import { withStyles } from '@mui/styles';

CopyToClipboard.propTypes = {
    text: PropTypes.string,
    classes: PropTypes.object,
    children: PropTypes.object,
    onClick: PropTypes.func,
};

function CopyToClipboard(props) {
    let { text, classes, children, onClick, ...other } = props;
    const clipboard = useClipboard();
    const handleClick = React.useCallback(
        (e) => {
            clipboard.copy(text);
            if (onClick) {
                onClick(e);
            }
        },
        [clipboard, text, onClick]
    );
    return (
        <Button className={classes.iconButton} onClick={handleClick} {...other}>
            {children}
        </Button>
    );
}

export default withStyles(styles)(CopyToClipboard);
