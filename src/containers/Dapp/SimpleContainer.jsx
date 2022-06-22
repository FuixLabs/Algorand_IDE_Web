import React, { useRef, useEffect, useState } from 'react';
import Dapp from '../../components/SimpleDapp';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { updateChain, fetchModel } from '../../redux/actions/dapp';
import { searchForTransactionsByAppId, getGlobalState } from '../../scripts/api';
const { LIBRARY_APP_ID_TESTNET /* , LIBRARY_APP_ID_MAINNET */ } = require('../../contract/src/converter/Constants');
import {
    getId,
    base64ToStr,
    tealArgs,
    deepClone,
    getTArrayAndIArray,
    checkTArrayLimitAfterFiring,
    parseOnchainToken,
    getTransactionType,
} from '../../util/dappUtils';
import { fetchApplicationInfo, fetchTransactions, updateComputeEngineState } from '../../redux/actions/dapp';
const {
    generateOutputAfterAddCall,
    generateOutputAfterFireCall,
    ComputeEngineConvertor,
} = require('../../contract/src');
const { ComputeEngine } = require('../../contract/utils/offchainService');
import PropTypes from 'prop-types';

import { messageActions } from '../../redux/reducer/message';
import { dappSliceActions } from '../../redux/reducer/dapp';

DappContainer.propTypes = {
    chain: PropTypes.string,
};

function DappContainer({ chain }) {
    const { id } = useParams();
    const [tokenArrayLength, setTokenArrayLength] = useState(0);
    /* used to store and retrieve newest data (block of latest transaction) inside interval function */
    const lastTxnBlockRef = useRef();
    const dispatch = useDispatch();
    let lastType = '';
    const transactions = useShallowEqualSelector((state) => {
        return state.dapp.transactions;
    });
    const lastTransaction = useShallowEqualSelector((state) => {
        return state.dapp.lastTransaction;
    });
    const createTransaction = useShallowEqualSelector((state) => {
        return state.dapp.createTransaction;
    });
    const computeEngine = useShallowEqualSelector((state) => {
        return state.dapp.computeEngine;
    });
    const pElements = useShallowEqualSelector((state) => {
        return state.dapp.pElements;
    });
    const isFireable = useShallowEqualSelector((state) => {
        return state.dapp.isFireable;
    });
    const shouldAddHint = useShallowEqualSelector((state) => {
        return state.dapp.shouldAddHint;
    });
    const isLastTxnAddHint = useShallowEqualSelector((state) => {
        return state.dapp.isLastTxnAddHint;
    });
    const [isImporting, setIsImporting] = useState(true);

    // latest transaction id which was computed
    // to avoid re-computing the same latest state of computeEngine
    const [lastTxId, setLastTxId] = useState('');

    const updateCurrentModel = (generatedComputeEngine) => {
        try {
            const elements = deepClone(pElements);
            const Markings = generatedComputeEngine.computeEngine.Markings;
            const indexToPlaceId = generatedComputeEngine.computeEngine.indexToPlaceId;
            Markings.forEach((markingsStr, index) => {
                /* find element position for writing new markings from computeEngine.Markings */
                const elementIndex = elements.findIndex((element) => element.id === indexToPlaceId[index]);
                if (elementIndex < -1) return;

                /* parse markings of a register */
                const type = elements[elementIndex].data.type;
                const newMarkings = [];

                const markingsArr = markingsStr
                    .substring(1, markingsStr.length - 1) // remove [ and ] that wrap markings list
                    .split('],[');

                /*
                    if there is no tokens, markingsArr = [''] due to the split function.
                    The condition below to check if markings array is not empty
                */
                if (markingsArr[0].trim() !== '')
                    markingsArr.forEach((tokenString) => {
                        const token = tokenString.split(',');
                        const parsedToken = [];
                        token.forEach((field, index) => {
                            switch (type[index].value) {
                                case 'INT':
                                    parsedToken.push(parseInt(field));
                                    break;
                                case 'BOOLEAN':
                                    parsedToken.push(field === 'True' ? true : false);
                                    break;
                                case 'STRING':
                                    parsedToken.push(field.substring(1, field.length - 1));
                                    break;
                                default:
                                    parsedToken.push(field);
                            }
                        });
                        newMarkings.push({ total: '1', id: getId(), tokens: parsedToken });
                    });

                /* update new markings to output model */
                const newNode = deepClone(elements[elementIndex]);
                newNode.data.markings = newMarkings;
                elements[elementIndex] = newNode;
            });
            dispatch(updateComputeEngineState(elements, generatedComputeEngine.computeEngine));

            updateFireable(generatedComputeEngine);
        } catch (error) {
            console.log(error);
        }
    };

    const updateFireable = (generatedComputeEngine) => {
        const getGlobalStatePromise = getGlobalState(chain, id);
        getGlobalStatePromise.then((res) => {
            const computeEngineConverter = new ComputeEngineConvertor(deepClone(generatedComputeEngine.computeEngine));
            setTokenArrayLength(computeEngineConverter.tokensToArguments()?.length);
            dispatch(dappSliceActions.updateGlobalState(res));

            const hintIndex = res.hintIndex ? res.hintIndex : 0;
            const numberOfHint = res.numberOfHint ? res.numberOfHint : 0;

            let isFire = hintIndex < numberOfHint;

            /* 
            if hintIndex = 0 & numberOfHint > 0
                there is 2 cases:
                - case 1: there are fire transitions, but not fire any yet.
                - case 2: all the transitions was fired
                to check which case:
                - if last transition was fire transaction -> case 2.
            */
            if (isLastTxnAddHint) {
                lastType = 'add_hint';
            }
            if (hintIndex === 0 && numberOfHint > 0) {
                if (lastType === 'fire_transition') isFire = false;
            }

            if (
                generatedComputeEngine.fireableTransition &&
                Object.keys(generatedComputeEngine.fireableTransition).length > 0
            ) {
                const limitCheck = checkTArrayLimitAfterFiring(
                    generatedComputeEngine.fireableTransition,
                    computeEngineConverter.tokensToArguments()?.length
                );
                isFire = limitCheck && isFire;

                // all hint onchain was fired but there is still fireable transition
                // recommend user to add hint to continue firing
                dispatch(
                    dappSliceActions.updateShouldAddHint(Boolean(limitCheck && !isFire && lastType !== 'add_hint'))
                );
            }
            dispatch(dappSliceActions.updateFireable(isFire));
        });
    };

    useEffect(() => {
        if (isLastTxnAddHint) {
            const computeEngineService = new ComputeEngine(computeEngine);
            updateFireable({
                computeEngine: deepClone(computeEngine),
                fireableTransition: computeEngineService.findCanFireTransition(),
            });
        }
    }, [isLastTxnAddHint, shouldAddHint]);

    /* on dapp ui mounting: set chain - get app data: importing model */
    useEffect(() => {
        dispatch(updateChain(chain));
        // 1. find the create transaction.
        searchForTransactionsByAppId({ appId: id, chain, limit: 1 }).then((res) => {
            const { transactions } = res;
            const firstTxn = transactions?.[0] || {};

            // store create txn info, used for application overview modal. TODO: store only id
            dispatch(dappSliceActions.updateCreateTxn(firstTxn));

            // fetch model from ipfs url (note) => update/import computeEngine to redux state
            try {
                setIsImporting(true);
                if (!firstTxn.note) throw Error('No note found.');
                dispatch(
                    fetchModel(firstTxn.note, () => {
                        setIsImporting(false);
                    })
                );
            } catch (error) {
                setIsImporting(false);
                dispatch(
                    messageActions['SHOW_MESSAGE']({
                        severity: 'info',
                        message: 'Cannot import the model.',
                    })
                );
            }
        });
    }, []);

    /* fetch for application info from chain, id */
    useEffect(() => {
        dispatch(fetchApplicationInfo(chain, id));

        dispatch(fetchTransactions(chain, id));
        // fetch application's transactions every 5 seconds to update latest state of computeEngine
        const interval = setInterval(() => {
            dispatch(fetchTransactions(chain, id, lastTxnBlockRef.current));
        }, 5000);
        return () => {
            clearInterval(interval);
        };
    }, [id]);

    // updating computeEngine state based on data onchain
    useEffect(() => {
        if (!lastTransaction || lastTransaction?.id === lastTxId || !computeEngine) return;

        //save id of the latest transition was computed
        setLastTxId(lastTransaction.id);
        lastTxnBlockRef.current = lastTransaction['confirmed-round'];

        // if app has just created, check if there is any pre-added tokens that is fireable
        if (lastTransaction.id === createTransaction.id) {
            const computeEngineService = new ComputeEngine(computeEngine); //computeEngine service
            const computeEngineConverter = new ComputeEngineConvertor(computeEngine);
            const fireableTransition = computeEngineService.findCanFireTransition();
            dispatch(
                dappSliceActions.updateFireable(
                    fireableTransition &&
                        Object.keys(fireableTransition).length > 0 &&
                        checkTArrayLimitAfterFiring(
                            fireableTransition,
                            computeEngineConverter.tokensToArguments()?.length
                        )
                )
            );
        }

        //search latest tx of Library App which is called from this app.
        //TODO: add mainnet library app id if any
        searchForTransactionsByAppId({
            chain,
            appId: LIBRARY_APP_ID_TESTNET /* chain === 'testnet' ? LIBRARY_APP_ID_TESTNET : LIBRARY_APP_ID_MAINNET */,
            targetBlock: lastTransaction['confirmed-round'],
        }).then((res) => {
            const lastInteractedTx = res.transactions.find((tx) => tx.group === lastTransaction.group);
            if (!lastInteractedTx) return;

            /* teal args to computeEngine */
            const computeEngineConvertor = new ComputeEngineConvertor(computeEngine);
            const { tArray, iArray } = getTArrayAndIArray(transactions, lastTransaction);

            const tealArgsComputeEngine = tealArgs({
                computeEngineConvertor,
                computeEngine,
                tArray,
                iArray,
            });

            //last interaction type: [add_token, fire_transition]
            const type = getTransactionType(lastInteractedTx);
            lastType = type;

            if (type === 'add_token') {
                /* get and parsed added token on last tx */
                const tokenStr = base64ToStr(lastInteractedTx?.['application-transaction']?.['application-args']?.[1]);
                const { registerId, parsedToken } = parseOnchainToken(tokenStr, computeEngine.placeToColor);
                /* generate computeEngine after add token */
                const generatedComputeEngine = generateOutputAfterAddCall(deepClone(tealArgsComputeEngine), [
                    registerId,
                    parsedToken,
                ]);
                generatedComputeEngine.computeEngine = {
                    ...generatedComputeEngine.computeEngine,
                    indexToPlaceId: computeEngine.indexToPlaceId,
                    uidToNodeId: computeEngine.uidToNodeId,
                    indexToTransitionId: computeEngine.indexToTransitionId,
                };

                /* update current computeEngine, fireable, and model state  */
                updateCurrentModel(generatedComputeEngine);
            }

            if (type === 'fire_transition') {
                /* get a list of fire transactions call lib app */
                const fireTxns = res.transactions.filter((item) => item.group === lastTransaction.group);

                let generatedComputeEngine = {
                    computeEngine,
                };
                // first time/txn: calc tArr, iArr based on data onchain
                let { tArray, iArray } = getTArrayAndIArray(transactions, lastTransaction);
                let isNotErrorCounter = 0;
                fireTxns.map((txn) => {
                    // get and parse fireableTransition info from txn NOTE
                    const fireStr = base64ToStr(txn.note);
                    const lastFireTransition = JSON.parse(fireStr);

                    const isFailed = txn.logs?.[1] && Boolean(base64ToStr(txn.logs[1]) === 'failed');
                    if (isFailed) return;

                    const computeEngineConvertor = new ComputeEngineConvertor(generatedComputeEngine.computeEngine);
                    // const computeEngineService = new ComputeEngine(generatedComputeEngine.computeEngine);

                    // console.log(str2bytes(base64ToStr(txn.logs[0])));

                    // next times/txns: calc tArr, iArr based on data offchain
                    if (isNotErrorCounter > 0) {
                        tArray = computeEngineConvertor.tokensToArguments();
                        iArray = computeEngineConvertor.indexArrayToArguments();
                    }

                    /* generate computeEngine after fire token and override info needed for parsing tokens */
                    const tealArgsComputeEngine = tealArgs({
                        computeEngineConvertor,
                        computeEngine: generatedComputeEngine.computeEngine,
                        tArray,
                        iArray,
                    });

                    generatedComputeEngine = generateOutputAfterFireCall(
                        deepClone({ ...tealArgsComputeEngine, fireableTransition: lastFireTransition })
                    );
                    generatedComputeEngine.computeEngine = deepClone({
                        ...generatedComputeEngine.computeEngine,
                        indexToPlaceId: computeEngine.indexToPlaceId,
                        uidToNodeId: computeEngine.uidToNodeId,
                        indexToTransitionId: computeEngine.indexToTransitionId,
                    });
                    isNotErrorCounter++;
                });
                /* update current computeEngine, fireable, and model state  */
                if (isNotErrorCounter > 0) {
                    updateCurrentModel(generatedComputeEngine);
                } else {
                    findLatestComputeEngineState();
                }
            }
        });
    }, [transactions, computeEngine, lastTransaction]);

    function findLatestComputeEngineState() {
        const computeEngineConvertor = new ComputeEngineConvertor(computeEngine);
        const { tArray, iArray } = getTArrayAndIArray(transactions, lastTransaction);
        const tealArgsComputeEngine = tealArgs({
            computeEngineConvertor,
            computeEngine,
            tArray,
            iArray,
        });
        const generatedComputeEngine = {
            computeEngine: {
                ...tealArgsComputeEngine.computeEngine,
                indexToPlaceId: computeEngine.indexToPlaceId,
                uidToNodeId: computeEngine.uidToNodeId,
                indexToTransitionId: computeEngine.indexToTransitionId,
            },
        };
        const computeEngineService = new ComputeEngine(generatedComputeEngine.computeEngine);
        const fireableTransition = computeEngineService.findCanFireTransition();
        generatedComputeEngine.fireableTransition = fireableTransition;
        updateCurrentModel(generatedComputeEngine);
    }

    return (
        <Dapp
            appId={id}
            isImporting={isImporting}
            elements={pElements}
            isFireable={isFireable}
            tokenArrayLength={tokenArrayLength}
            shouldAddHint={shouldAddHint}
        />
    );
}

export default DappContainer;
