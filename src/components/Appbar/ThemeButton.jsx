import React from 'react';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import ButtonDropdown from '../ButtonDropdown';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import st from './styles/ThemeButton';
import { withStyles } from '@mui/styles';
import colorThemes from '../../themes';
import settingsConstants from '../../redux/constants/settings';
import { settingsActions } from '../../redux/reducer/settings';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
const { UPDATE_THEME } = settingsConstants;
const ThemeButton = ({ classes }) => {
    const theme = useSelector((state) => state.settings.theme, shallowEqual);
    const dispatch = useDispatch();
    const handleClick = (theme) => {
        dispatch(settingsActions[UPDATE_THEME]({ theme }));
    };
    const renderMenuItems = () => {
        return (
            <div className={classes.container}>
                <Typography className="title">Select Color Theme</Typography>
                <div className={classes.listTheme}>
                    {colorThemes.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className={
                                    classes.item +
                                    ' ' +
                                    (item.disabled ? 'disabled' : '') +
                                    ' ' +
                                    (theme.id === item.id ? 'active' : '')
                                }
                                onClick={() => handleClick(item)}
                            >
                                <img src={item.icon} />
                                <Typography className="text">{item.text}</Typography>
                                {theme.id === item.id ? (
                                    <div className={classes.checked}>
                                        <span className="material-icons">done</span>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };
    return (
        <ButtonDropdown renderMenuItems={renderMenuItems}>
            <FormatPaintIcon /> Theme
        </ButtonDropdown>
    );
};
ThemeButton.propTypes = { classes: PropTypes.object };
export default withStyles(st)(ThemeButton);
