import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import videoList from './videoList';
import { Typography } from '@mui/material';
import './PlayerModal.scss';

PlayerModal.propTypes = {
    open: PropTypes.bool,
    onToggleModal: PropTypes.func,
};

function PlayerModal({ onToggleModal, open }) {
    const [videoIndex, setVid] = useState(0);

    const handleChangeVideo = (index) => {
        return () => setVid(index);
    };

    const playNext = () => {
        if (videoIndex + 1 < videoList.length) setVid(videoIndex + 1);
    };

    return (
        <>
            <Modal open={open}>
                <Box className="container">
                    <Box
                        sx={{
                            bgcolor: 'dialog.backgroundColor',
                            boxShadow: 24,
                        }}
                        className="content"
                    >
                        <Box className="left-content">
                            <iframe width="100%" height="100%" frameBorder="0" src={videoList[videoIndex].videoUrl} />
                        </Box>
                        <Box className="right-content">
                            {videoList.map((item, index) => (
                                <Box
                                    key={item.id}
                                    className="list-item"
                                    sx={{
                                        bgcolor: item.id === videoList[videoIndex].id ? 'action.hover' : 'inherit',
                                        '&:hover': {
                                            bgcolor: 'action.hover',
                                        },
                                    }}
                                    onClick={handleChangeVideo(index)}
                                >
                                    <Box component="img" src={item.imgUrl} />
                                    <Typography
                                        sx={{
                                            color:
                                                item.id === videoList[videoIndex].id ? 'primary.main' : 'textPrimary',
                                        }}
                                        className="text"
                                    >
                                        {index + 1}. {item.title}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    <IconButton className="close-button" onClick={onToggleModal} size="large">
                        <Box component="span" className="material-icons" sx={{ fontSize: 28, color: 'white' }}>
                            close
                        </Box>
                    </IconButton>
                </Box>
            </Modal>
        </>
    );
}

export default PlayerModal;
