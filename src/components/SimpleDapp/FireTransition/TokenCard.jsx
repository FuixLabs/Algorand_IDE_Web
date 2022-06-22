import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import PropTypes from 'prop-types';

TokenCard.propTypes = {
    register: PropTypes.object,
    tokenArr: PropTypes.array,
};

function TokenCard({ register, tokenArr }) {
    return (
        <Box className="token-info" sx={{ bgcolor: 'background.form' }}>
            <Box className="register">
                <Chip label={register?.data?.label} />
            </Box>
            {register?.data?.type?.map((field, index) => (
                <Box
                    key={index}
                    className="field"
                    sx={{
                        borderBottom: 1,
                        borderBottomColor: 'text.hint',
                    }}
                >
                    <Typography color="textSecondary">
                        {field.description ? field.description + ' (' + field.value + ')' : field.value}:
                    </Typography>
                    <Typography className="field-value">{tokenArr[index]}</Typography>
                </Box>
            ))}
        </Box>
    );
}

export default TokenCard;
