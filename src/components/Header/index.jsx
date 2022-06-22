import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import st from './styles/index';
import Appbar from '../Appbar';
import './styles/index.scss';

const RightSideBar = ({ classes, convert, isExample, toggleYoutubePlaylist }) => {
    return (
        <div className={'header-panel ' + classes.container}>
            <Appbar atWorkboard convert={convert} isExample={isExample} toggleYoutubePlaylist={toggleYoutubePlaylist} />
        </div>
    );
};

RightSideBar.propTypes = {
    classes: PropTypes.object,
    convert: PropTypes.func,
    isExample: PropTypes.bool,
    toggleYoutubePlaylist: PropTypes.func,
};
export default withStyles(st)(RightSideBar);
