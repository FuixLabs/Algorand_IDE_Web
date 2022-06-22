import { Backdrop, Box, Fab, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Constants from '../../util/Constant';
import './styles/index.scss';
import CircularProgress from '@mui/material/CircularProgress';
import OutputModel from './OutputModel';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useDispatch } from 'react-redux';
import { settingsActions } from '../../redux/reducer/settings';
import PopoverContent from './FABPopoverContent';
import FireTransition from './FireTransition';
import { MAX_TOKEN_ARRAY_LENGTH } from '../../util/dappUtils';

Dapp.propTypes = {
    isImporting: PropTypes.bool,
    elements: PropTypes.array,
    isFireable: PropTypes.bool,
    tokenArrayLength: PropTypes.number,
    shouldAddHint: PropTypes.bool,
};
Dapp.defaultProps = {
    isImporting: false,
    elements: null,
    isFireable: false,
    shouldAddHint: false,
};

export default function Dapp(props) {
    const { elements, isFireable, tokenArrayLength, shouldAddHint } = props;
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [action, setAction] = useState('');
    const [currentElements, setCurrenElements] = useState([]);
    const [openFireableInfoModal, setOpenFireableInfoModal] = useState(false);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleFireableModal = () => {
        setOpenFireableInfoModal(!openFireableInfoModal);
    };

    const handleClickFab = (action) => {
        return (event) => {
            setAction(action);
            setAnchorEl(event.currentTarget);
        };
    };
    //on elements from redux change => update current elements
    useEffect(() => {
        if (!elements?.length) return;
        let _elements = elements.map((item) => {
            let _item = { ...item };
            if (!Constants.isConnection(item)) {
                _item.className = item.data.typeBlock;
            }
            return _item;
        });
        setCurrenElements(_elements);
    }, [elements]);

    useEffect(() => {
        document.title = 'Application Dashboard';
        dispatch(settingsActions.updateDappTheme());
    }, []);

    return (
        <Box className="dapp-container">
            <OutputModel elements={currentElements} />
            <Box className="floating-btn-container">
                <Fab
                    variant="extended"
                    size="medium"
                    color="primary"
                    aria-label="add-token"
                    onClick={handleClickFab('add')}
                >
                    <AddCircleIcon className="icon-margin" />
                    Add Token
                </Fab>
                <Fab
                    variant="extended"
                    size="medium"
                    color="primary"
                    aria-label="fire-transition"
                    onClick={toggleFireableModal}
                    disabled={!isFireable && !shouldAddHint}
                >
                    <RocketLaunchIcon className="icon-margin" />
                    Fire Operation(s)
                </Fab>
                <Fab size="medium" color="primary" aria-label="account" onClick={handleClickFab('account')}>
                    <AccountCircleIcon />
                </Fab>
                <PopoverContent action={action} anchorEl={anchorEl} elements={currentElements} onClose={handleClose} />
            </Box>
            {Boolean(tokenArrayLength > 0) && (
                <Tooltip title="If length of the Token Array reaches its limit, you will not able to add tokens or fire operations.">
                    <Box className="token-limit">
                        <Typography
                            fontWeight="medium"
                            color={tokenArrayLength + 100 > MAX_TOKEN_ARRAY_LENGTH ? 'warning.main' : 'default'}
                        >
                            Token Array Length: {tokenArrayLength}/{MAX_TOKEN_ARRAY_LENGTH}
                        </Typography>
                    </Box>
                </Tooltip>
            )}
            <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={props.isImporting}>
                <CircularProgress size={80} />
            </Backdrop>
            <FireTransition open={openFireableInfoModal} handleClose={toggleFireableModal} />
        </Box>
    );
}
