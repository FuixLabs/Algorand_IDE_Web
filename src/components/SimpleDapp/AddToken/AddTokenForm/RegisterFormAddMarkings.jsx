import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import st from '../../../RightSideBar/styles/RegisterForm';

import {
    Typography,
    Button,
    TextField,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    FormHelperText,
} from '@mui/material';
import '../../../RightSideBar/styles/AddMarkings.scss';
import useShallowEqualSelector from '../../../../redux/customHook/useShallowEqualSelector';
import { useDispatch, useSelector } from 'react-redux';
import { messageActions } from '../../../../redux/reducer/message';
import messageConstants from '../../../../redux/constants/message';
import { fetchTransactions } from '../../../../redux/actions/dapp';
import { clientForChain, addTokenAppCall } from '../../../../scripts/api';
import {
    processTransactionErrorMessage,
    MAX_TOKEN_ARRAY_LENGTH,
    deepClone,
    MAX_HINT,
    checkTArrayLimitAfterFiring,
    tealArgs,
} from '../../../../util/dappUtils';
const {
    pad,
    ComputeEngineConvertor,
    generateOutputAfterAddCall,
    generateOutputAfterFireCall,
} = require('../../../../contract/src');

const { ComputeEngine } = require('../../../../contract/utils/offchainService');

const { SHOW_MESSAGE } = messageConstants;

import { renderType } from '../../../../scripts/util';

const AddMarkingsForm = ({ node, setShow, classes, hide }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [token, setToken] = useState([]);
    const [error, setError] = useState([]);
    const dispatch = useDispatch();
    const connector = useShallowEqualSelector((state) => {
        return state.walletConnect.connector;
    });
    const address = useSelector((state) => {
        return state.walletConnect.address;
    });
    const computeEngine = useShallowEqualSelector((state) => {
        return state.dapp.computeEngine;
    });
    const lastTransaction = useShallowEqualSelector((state) => {
        return state.dapp.lastTransaction;
    });
    const applicationId = useShallowEqualSelector((state) => {
        return state.dapp.applicationInfo?.applicationId;
    });
    const chain = useSelector((state) => {
        return state.dapp.chain;
    });

    useEffect(() => {
        if (hide) {
            setToken([]);
            setError([]);
        }
    }, [hide]);

    const handleInputChange = (index) => {
        return (event) => {
            const newToken = token ? [...token] : [];
            newToken[index] = event?.target?.value;
            setToken(newToken);
            const newError = error ? [...error] : [];
            newError[index] = '';
            setError(newError);
        };
    };

    const calcHArrayAfterAdd = (registerId, token) => {
        if (!computeEngine) return null;

        /* teal args to computeEngine */
        let computeEngineConvertor = new ComputeEngineConvertor(computeEngine);
        let tArray = computeEngineConvertor.tokensToArguments();
        let iArray = computeEngineConvertor.indexArrayToArguments();

        const tealArgsComputeEngine = tealArgs({
            computeEngineConvertor,
            computeEngine,
            tArray,
            iArray,
        });

        let generatedData = generateOutputAfterAddCall(deepClone(tealArgsComputeEngine), [registerId, token]);
        generatedData.computeEngine = deepClone({
            ...generatedData.computeEngine,
            indexToPlaceId: computeEngine.indexToPlaceId,
            uidToNodeId: computeEngine.uidToNodeId,
            indexToTransitionId: computeEngine.indexToTransitionId,
        });

        let computeEngineService = new ComputeEngine(generatedData.computeEngine);
        let fireableTransition = computeEngineService.findCanFireTransition();

        const hArray = [];
        while (fireableTransition && Object.values(fireableTransition)?.length && hArray.length < MAX_HINT) {
            computeEngineConvertor = new ComputeEngineConvertor(generatedData.computeEngine);

            // if tarray reach limit, stop adding new hint
            if (!checkTArrayLimitAfterFiring(fireableTransition, computeEngineConvertor.tokensToArguments()?.length))
                break;
            const hint = computeEngineConvertor.firableTransitionToHintArray(fireableTransition);
            hArray.push(hint);
            tArray = computeEngineConvertor.tokensToArguments();
            iArray = computeEngineConvertor.indexArrayToArguments();
            const tealArgsComputeEngine = tealArgs({
                computeEngineConvertor,
                computeEngine: generatedData.computeEngine,
                tArray,
                iArray,
            });

            generatedData = generateOutputAfterFireCall(deepClone({ ...tealArgsComputeEngine, fireableTransition }));
            generatedData.computeEngine = deepClone({
                ...generatedData.computeEngine,
                indexToPlaceId: computeEngine.indexToPlaceId,
                uidToNodeId: computeEngine.uidToNodeId,
                indexToTransitionId: computeEngine.indexToTransitionId,
            });
            fireableTransition = generatedData.fireableTransition;
        }
        if (!hArray.length) return null;
        return computeEngineConvertor.toListHArray(hArray);
    };

    const save = async () => {
        if (!address?.length) {
            dispatch(
                messageActions[SHOW_MESSAGE]({
                    message: `Make sure you're connecting to the wallet to perform this action`,
                    severity: 'warning',
                })
            );
            return;
        }

        try {
            setIsAdding(true);

            /* process and validate data */
            let hasError = false;
            const _error = [...error];
            const addToken = [];
            node.data.type.forEach((item, index) => {
                // common error case: empty or not choose
                if (!token?.[index] || !String(token[index]).trim()) {
                    _error[index] = 'This field is required.';
                    hasError = true;
                    addToken[index] = null;
                    return;
                }

                // specific type case
                switch (item.value) {
                    case 'INT':
                        if (
                            // only numbers allowed. avoid case [numb]e[numb]
                            !/^[0-9]*$/.test(token[index]) ||
                            Number(token[index]) < 0 ||
                            Number(token[index]) > Math.pow(2, 32) - 1
                        ) {
                            _error[index] = 'Value is invalid. The number must be in range from 0 to 2^32 - 1';
                            hasError = true;
                        } else {
                            addToken[index] = parseInt(token[index]);
                        }
                        break;
                    case 'BOOLEAN':
                        addToken[index] = token[index] === 'True' ? true : false;
                        break;
                    case 'STRING':
                        //only letters, numbers and underscores allowed.
                        if (!/^[A-Za-z0-9 _]*$/.test(token[index])) {
                            hasError = true;
                            _error[index] = 'Value is invalid. Only letters, numbers, underscores and spaces allowed.';
                        }
                        if (token[index].length > 64) {
                            hasError = true;
                            _error[index] = 'This value must be less than 64 characters.';
                        }
                        addToken[index] = token[index];
                        break;
                }
            });

            if (hasError) {
                setIsAdding(false);
                return setError(_error);
            }

            if (!computeEngine || !lastTransaction) {
                throw Error('ComputeEngine is not ready');
            }

            const client = clientForChain(chain);

            /* add token */
            const computeEngineConvertor = new ComputeEngineConvertor(computeEngine);
            const index = computeEngine.indexToPlaceId.findIndex((item) => item === node.id);
            const newToken = `${pad(index, 1)}${computeEngineConvertor.tokensToArguments([addToken])}`;
            const tArray = computeEngineConvertor.tokensToArguments();

            // check token array limit.
            if (newToken.length - 1 + tArray.length > MAX_TOKEN_ARRAY_LENGTH) {
                dispatch(
                    messageActions[SHOW_MESSAGE]({
                        severity: 'error',
                        message: 'Cannot add new token. The Token Array has reached its limit.',
                        autoHideDuration: 10000,
                    })
                );
                return setIsAdding(false);
            }

            const appArgsAdd = [newToken, tArray, computeEngineConvertor.indexArrayToArguments()];
            const listHArray = calcHArrayAfterAdd(index, addToken);
            if (listHArray) appArgsAdd.push(listHArray);

            const txnId = await addTokenAppCall(client, applicationId, address, appArgsAdd, connector, chain);
            // fetch the new txns to update latest state of computeEngine
            dispatch(fetchTransactions(chain, applicationId, lastTransaction?.['confirmed-round']));

            /* reflect changes on ui */
            setIsAdding(false);
            setToken([]);
            setTimeout(() => {
                dispatch(
                    messageActions[SHOW_MESSAGE]({
                        message: 'Add token successfully!',
                        severity: 'success',
                    })
                );
                setShow();
            }, 10);
        } catch (err) {
            console.log(err);
            setIsAdding(false);
            dispatch(
                messageActions[SHOW_MESSAGE]({
                    message: processTransactionErrorMessage(err.message, 'Add token failed! '),
                    severity: 'error',
                })
            );
        }
    };

    if (hide) return '';
    return (
        <div className="add-markings-form" data-test="test__container-form">
            <Grid container spacing={4} className="grid-container">
                <Grid item lg={5} md={5} sm={5} xs={12} className="left-gird">
                    <Typography color="primary" className="title-form">
                        NUMBER OF MESSAGE
                    </Typography>
                    <TextField
                        value={1}
                        className={classes.borderInput + ' total'}
                        label="No."
                        fullWidth
                        type="number"
                        min="1"
                        data-test="test__input-total"
                        disabled={true}
                    />
                </Grid>
                <Grid item lg={7} md={7} sm={7} xs={12}>
                    <Typography color="primary" className="title-form">
                        MESSAGE
                    </Typography>
                    <div className="list-input">
                        {node.data.type.map((item, index) => {
                            if (!item || !item.value) return '';
                            return item.value !== 'BOOLEAN' ? (
                                <TextField
                                    key={index}
                                    value={token?.[index] || ''}
                                    className={classes.borderInput}
                                    label={renderType(item.value, item.description)}
                                    onChange={handleInputChange(index)}
                                    fullWidth
                                    error={Boolean(error[index])}
                                    helperText={error[index]}
                                    data-test="test__input-type"
                                />
                            ) : (
                                <FormControl fullWidth key={index}>
                                    <InputLabel> {renderType(item.value, item.description)}</InputLabel>
                                    <Select
                                        id="demo-simple-select"
                                        value={String(token?.[index])}
                                        onChange={handleInputChange(index)}
                                        className={classes.borderInput}
                                        MenuProps={{ classes: { paper: classes.select } }}
                                        fullWidth
                                        data-test="test__select-type"
                                        error={Boolean(error[index])}
                                        label={renderType(item.value, item.description)}
                                    >
                                        {token?.[index]?.length > 0 ? (
                                            ''
                                        ) : (
                                            //default item case undefined
                                            <MenuItem>
                                                <em>None</em>
                                            </MenuItem>
                                        )}

                                        <MenuItem value={'True'}>True</MenuItem>
                                        <MenuItem value={'False'}>False</MenuItem>
                                    </Select>
                                    <FormHelperText sx={{ color: 'error.main' }}>{error[index] || ''}</FormHelperText>
                                </FormControl>
                            );
                        })}
                    </div>
                </Grid>
            </Grid>
            <div className="switch">
                <Button
                    onClick={save}
                    variant="contained"
                    color="primary"
                    className="button-save"
                    data-test="test__button-save"
                    disabled={isAdding}
                >
                    {isAdding ? <CircularProgress color="primary" /> : 'Save'}
                </Button>
            </div>
        </div>
    );
};

AddMarkingsForm.propTypes = {
    node: PropTypes.object,
    classes: PropTypes.object,
    hide: PropTypes.bool,
    setShow: PropTypes.func,
};
export default withStyles(st)(AddMarkingsForm);
