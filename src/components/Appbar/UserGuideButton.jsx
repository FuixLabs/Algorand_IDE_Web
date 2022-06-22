import React from 'react';
import { MenuItem, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import ButtonDropdown from '../ButtonDropdown';
import HelpIcon from '@mui/icons-material/Help';
import Divider from '@mui/material/Divider';
const ITEMS = [
    {
        icon: 'summarize',
        text: 'Docs & Tutorial',
        key: 'docs',
    },
    {
        icon: 'model_training',
        text: 'Model Example',
        key: 'modal',
    },
];
const UserGuideButton = ({ toggleYoutubePlaylist }) => {
    const handleClick = (key) => {
        switch (key) {
            case 'modal':
                window.open('/example', '_blank');
                break;
            case 'docs':
                toggleYoutubePlaylist();
            default:
                break;
        }
    };
    const renderMenuItems = () => {
        return ITEMS.map((item, index) =>
            item.divider ? (
                <Divider className="divider" key={index} />
            ) : (
                <MenuItem key={index} onClick={() => handleClick(item.key)} className="menu-item-dropdown">
                    <span className="material-icons">{item.icon}</span>
                    <Typography>{item.text}</Typography>
                </MenuItem>
            )
        );
    };
    return (
        <ButtonDropdown renderMenuItems={renderMenuItems}>
            <HelpIcon />
            <span> User Guide</span>
        </ButtonDropdown>
    );
};
UserGuideButton.propTypes = { toggleYoutubePlaylist: PropTypes.func };
export default UserGuideButton;
