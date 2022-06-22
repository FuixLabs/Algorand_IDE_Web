import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import './styles/FireableDetails.scss';
import TokenCard from './TokenCard';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';

FireableDetails.propTypes = {
    fireTransitionArray: PropTypes.array,
    onBack: PropTypes.func,
};

function FireableDetails({ fireTransitionArray, onBack }) {
    const elements = useShallowEqualSelector((state) => state.dapp.pElements);
    const computeEngine = useShallowEqualSelector((state) => {
        return state.dapp.computeEngine;
    });

    const getRegister = useCallback((registerId) => {
        const eId = computeEngine?.indexToPlaceId?.[registerId];
        return elements?.find((item) => item.id === eId) || {};
    });

    const getOperationName = (index) => {
        const operationId = computeEngine?.indexToTransitionId[index];
        return elements.find((element) => operationId === element.id)?.data?.label || 'Operation';
    };

    const renderToken = (index, tokenItem) => {
        const register = getRegister(tokenItem.placeId);
        const tokenArr = tokenItem.token.substring(1, tokenItem.token.length - 1).split(',');
        //remove quote on string value. example: 'ex' => ex
        for (let i = 0; i < tokenArr.length; i++) {
            if (tokenArr[i][0] === "'" && tokenArr[i][tokenArr[i].length - 1] === "'")
                tokenArr[i] = tokenArr[i].substring(1, tokenArr[i].length - 1);
        }
        return <TokenCard key={index} register={register} tokenArr={tokenArr} />;
    };

    return (
        <Box className="fireable-info">
            {fireTransitionArray?.map((fireableTransition, index) => (
                <Box key={index}>
                    <Box
                        sx={{ color: fireableTransition.outToken ? 'primary.main' : 'warning.main' }}
                        className="transition-title"
                    >
                        {fireableTransition.outToken
                            ? `Fireable ${getOperationName(fireableTransition.operationId)}`
                            : `Unexpected Error`}
                        <Box
                            className="line"
                            sx={{ bgcolor: fireableTransition.outToken ? 'primary.main' : 'warning.main' }}
                        ></Box>
                    </Box>
                    <Box className="transition">
                        {fireableTransition.outToken ? (
                            <>
                                <Box className="col">
                                    <Typography className="title">In Token(s):</Typography>
                                    <Box className="list-container">
                                        {fireableTransition.inToken.map((inPlace, index) => {
                                            return renderToken(index, inPlace);
                                        })}
                                    </Box>
                                </Box>
                                <Box className="col">
                                    <Typography className="title">Out Token(s):</Typography>
                                    <Box className="list-container">
                                        {fireableTransition.outToken.map((outPlace, index) => {
                                            return renderToken(index, outPlace);
                                        })}
                                    </Box>
                                </Box>
                            </>
                        ) : (
                            <Box className="error-info" sx={{ bgcolor: 'background.form' }}>
                                <Typography>
                                    This transaction will not change the model. However, it has to be executed to
                                    continue firing other operations.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

export default FireableDetails;
