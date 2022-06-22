import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import DeployButton from '../../containers/Appbar/DeployButton';
import ApplicationsHistory from '../../containers/Appbar/ApplicationsHistory';
import { Link } from 'react-router-dom';
import FileButton from './FileButton/index';
import ThemeButton from './ThemeButton';
import UserGuideButton from './UserGuideButton';
import { Divider, Button, Typography } from '@mui/material';
// import logoQ from '../../images/logo_q.svg';
import LogoQ from '../Icons/LogoQ';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import './styles/index.scss';

Appbar.propTypes = {
    title: PropTypes.string,
    showAccount: PropTypes.bool,
    network: PropTypes.string,
    atWorkboard: PropTypes.bool,
    convert: PropTypes.func,
    toggleTransactionActivity: PropTypes.func,
    isExample: PropTypes.bool,
    toggleYoutubePlaylist: PropTypes.func,
};

Appbar.defaultProps = {
    toggleTransactionActivity: null,
    title: '',
    showAccount: false,
    network: '',
    atWorkboard: false,
    convert: () => {},
};

function Appbar(props) {
    const { title, atWorkboard, convert, isExample, toggleYoutubePlaylist } = props;
    return (
        <AppBar
            position="sticky"
            sx={{
                height: 60,
                justifyContent: 'center',
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.sidebar',
                boxShadow: 'unset',
            }}
        >
            <Toolbar
                variant="dense"
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    bgcolor: 'background.sidebar',
                    height: 70,
                }}
            >
                <div className="left-toolbar">
                    <Link to="/">
                        {/* <Box
                            component="img"
                            src={logoQ}
                            sx={{ maxHeight: 4 / 5, pr: showAccount ? { md: 8, xs: 0 } : 0 }}
                        /> */}
                        <LogoQ />
                    </Link>
                    {atWorkboard ? (
                        <>
                            <Divider orientation="vertical" className="divider" />
                            <FileButton />
                            <Divider orientation="vertical" className="divider" />
                            <ThemeButton />
                            <Divider orientation="vertical" className="divider" />
                            <UserGuideButton isExample={isExample} toggleYoutubePlaylist={toggleYoutubePlaylist} />
                            <Divider orientation="vertical" className="divider" />
                        </>
                    ) : (
                        ''
                    )}
                </div>
                <Typography
                    color="white"
                    sx={{
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        p: 1,
                    }}
                    data-test="test__title"
                >
                    {title}
                </Typography>
                <div className="right-toolbar">
                    {atWorkboard && <ApplicationsHistory convert={convert} />}
                    {atWorkboard && <DeployButton convert={convert} disabled={false} />}
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Appbar;
