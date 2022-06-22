import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Paper, Button, Typography, IconButton, Box } from '@mui/material';
import './styles/Confirm.scss';
import Chip from '@mui/material/Chip';
const ModalShowConflictVariable = ({ open, handleClose, variableConflict }) => {
    return (
        <Modal open={open} onClose={handleClose} className="dialog conflict-dialog">
            <Paper className="content">
                <div className="header-dialog">
                    <Typography className="title" color="textPrimary">
                        Conflict Warning
                    </Typography>
                    <IconButton className="button-close" variant="contained" onClick={handleClose}>
                        <span className="material-icons">close</span>
                    </IconButton>
                </div>
                <div className="body-dialog">
                    <Typography color="textSecondary">
                        The connection cannot be made because the model will contain namesake variables which is
                        invalid. The variables are listed as following:
                    </Typography>
                    <Box sx={{ padding: '12px 0px', flex: 1, overflow: ' auto' }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {variableConflict.map((item) => {
                                return item.variables.map((_item) => (
                                    <Chip
                                        sx={{ margin: '4px 8px', maxWidth: 'calc(100% - 16px)', fontWeight: 600 }}
                                        key={_item}
                                        label={_item}
                                    ></Chip>
                                ));
                            })}
                        </Box>
                    </Box>
                    <Typography color="textSecondary">Please try to differentiate their names.</Typography>
                </div>
                <div className="footer-dialog">
                    <Button className="button-yes" variant="contained" color="primary" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </Paper>
        </Modal>
    );
};

ModalShowConflictVariable.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    variableConflict: PropTypes.array,
};

export default ModalShowConflictVariable;
