import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import messageConstants from '../../../redux/constants/message';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import {
    deepClone,
    processTransactionErrorMessage,
    tealArgsAndOverride,
    tealArgs,
    MAX_HINT,
    checkTArrayLimitAfterFiring,
} from '../../../util/dappUtils';
import FireableInformationModal from './FireableInformationModal';
import { clientForChain, submitSignedTransactions, signFireTransitionTxns, addHintAppCall } from '../../../scripts/api';
const { SHOW_MESSAGE } = messageConstants;
import { messageActions } from '../../../redux/reducer/message';
import { fetchTransactions } from '../../../redux/actions/dapp';
import PropTypes from 'prop-types';
const { ComputeEngineConvertor, generateOutputAfterFireCall } = require('../../../contract/src');
const { ComputeEngine } = require('../../../contract/utils/offchainService');
import { str2bytes } from '../../../contract/src/converter/ComputeEngine';

ModalContainer.propTypes = {
    handleClose: PropTypes.func,
};

function ModalContainer(props) {
    const [firingChainList, setFiringChainList] = useState([]);
    const [firing, setFiring] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    /* status state used for triggering to re-render components */
    const [status, setStatus] = useState(null);
    const firingChainStatus = useRef(null);

    const dispatch = useDispatch();
    const connector = useShallowEqualSelector((state) => {
        return state.walletConnect.connector;
    });
    const address = useSelector((state) => {
        return state.walletConnect.address;
    });
    const chain = useSelector((state) => {
        return state.dapp.chain;
    });
    const applicationId = useShallowEqualSelector((state) => {
        return state.dapp.applicationInfo?.applicationId;
    });
    const computeEngine = useShallowEqualSelector((state) => {
        return state.dapp.computeEngine;
    });
    const lastTransaction = useShallowEqualSelector((state) => {
        return state.dapp.lastTransaction;
    });
    const isFireable = useShallowEqualSelector((state) => {
        return state.dapp.isFireable;
    });
    const shouldAddHint = useShallowEqualSelector((state) => {
        return state.dapp.shouldAddHint;
    });
    const globalState = useShallowEqualSelector((state) => {
        return state.dapp.globalState;
    });
    const isLastTxnAddHint = useShallowEqualSelector((state) => {
        return state.dapp.isLastTxnAddHint;
    });

    const handleAddHint = async () => {
        setIsAdding(true);

        try {
            /* 1. calc hArray  */
            let generatedData = {
                computeEngine: deepClone(computeEngine),
            };
            let computeEngineConvertor = new ComputeEngineConvertor(generatedData.computeEngine);
            let computeEngineService = new ComputeEngine(generatedData.computeEngine);
            let fireableTransition = computeEngineService.findCanFireTransition();

            const hArray = [];
            while (fireableTransition && Object.values(fireableTransition)?.length && hArray.length < MAX_HINT) {
                computeEngineConvertor = new ComputeEngineConvertor(generatedData.computeEngine);
                // if tarray reach limit, stop adding new hint
                if (
                    !checkTArrayLimitAfterFiring(fireableTransition, computeEngineConvertor.tokensToArguments()?.length)
                )
                    break;
                const hint = computeEngineConvertor.firableTransitionToHintArray(fireableTransition);
                hArray.push(hint);

                const tealArgsComputeEngine = tealArgs({
                    computeEngineConvertor,
                    computeEngine: generatedData.computeEngine,
                    tArray: computeEngineConvertor.tokensToArguments(),
                    iArray: computeEngineConvertor.indexArrayToArguments(),
                });

                generatedData = generateOutputAfterFireCall(
                    deepClone({ ...tealArgsComputeEngine, fireableTransition })
                );
                generatedData.computeEngine = deepClone({
                    ...generatedData.computeEngine,
                    indexToPlaceId: computeEngine.indexToPlaceId,
                    uidToNodeId: computeEngine.uidToNodeId,
                    indexToTransitionId: computeEngine.indexToTransitionId,
                });
                fireableTransition = generatedData.fireableTransition;
            }

            if (!hArray.length) throw Error('No fireable transitions.');
            /* 1. calc hArray - end */

            const client = clientForChain(chain);
            const appArgs = [str2bytes('store_hint'), str2bytes(computeEngineConvertor.toListHArray(hArray))];
            const txnId = await addHintAppCall(client, applicationId, address, appArgs, connector, chain);
            dispatch(fetchTransactions(chain, applicationId, lastTransaction?.['confirmed-round']));
            dispatch(
                messageActions[SHOW_MESSAGE]({
                    message: `Request successfully. List of firing chains will be updated after a while.`,
                    severity: 'success',
                })
            );
        } catch (error) {
            dispatch(
                messageActions[SHOW_MESSAGE]({
                    message: `Request failed`,
                    severity: 'error',
                })
            );
        }

        setIsAdding(false);
    };

    const updateStatus = (index, status) => {
        const chainStatus = [...firingChainStatus.current];
        chainStatus[index] = status;
        firingChainStatus.current = chainStatus;
        setStatus(chainStatus);
    };
    const onFire = async () => {
        if (!address?.length) {
            dispatch(
                messageActions[SHOW_MESSAGE]({
                    message: `Make sure you're connecting to the wallet to perform this action`,
                    severity: 'warning',
                })
            );
            return;
        }

        let hintIndex = globalState.hintIndex ? globalState.hintIndex : 0;

        try {
            setFiring(true);
            const client = clientForChain(chain);
            const signedInfo = [];

            let lastFiredSuccessIndex = -1;
            for (let i = 0; i < firingChainList.length; i++) {
                if (firingChainStatus.current?.[i] === 'success') {
                    lastFiredSuccessIndex = i;
                } else break;
            }

            const numberOfRequests =
                lastFiredSuccessIndex >= 0
                    ? firingChainList.length - lastFiredSuccessIndex - 1
                    : firingChainList.length;
            dispatch(
                messageActions[SHOW_MESSAGE]({
                    message: `${numberOfRequests} request(s) will be sent. Please open your wallet and approve.`,
                    severity: 'info',
                })
            );

            for (let i = lastFiredSuccessIndex + 1; i < firingChainList.length; i++) {
                updateStatus(i, 'approval_pending');
                try {
                    const [signedTxns, signedTxnInfo] = await signFireTransitionTxns(
                        client,
                        applicationId,
                        address,
                        [firingChainList[i].tArray, firingChainList[i].iArray],
                        firingChainList[i].fireTransitionArray,
                        connector,
                        chain,
                        hintIndex
                    );
                    signedInfo[i] = [signedTxns, signedTxnInfo];
                    updateStatus(i, 'signed');
                } catch (error) {
                    updateStatus(i, 'error');
                    dispatch(
                        messageActions[SHOW_MESSAGE]({
                            message: processTransactionErrorMessage(error.message),
                            severity: 'error',
                        })
                    );
                    break;
                }
            }

            let isError = false;
            for (let i = lastFiredSuccessIndex + 1; i < signedInfo.length; i++) {
                if (isError) break;
                try {
                    updateStatus(i, 'firing');
                    const [signedTxns, signedTxnInfo] = signedInfo[i];
                    await submitSignedTransactions(signedTxns, signedTxnInfo[0][0].txID, chain);
                    updateStatus(i, 'success');
                } catch (error) {
                    updateStatus(i, 'error');
                    dispatch(
                        messageActions[SHOW_MESSAGE]({
                            message: processTransactionErrorMessage(error.message) || 'Fire transition failed.',
                            severity: 'error',
                        })
                    );
                    isError = true;
                    for (let j = i + 1; j < firingChainList.length; j++) {
                        updateStatus(j, 'pending');
                    }
                }
            }
            setFiring(false);
            dispatch(fetchTransactions(chain, applicationId, lastTransaction?.['confirmed-round']));
            if (!isError) {
                if (signedInfo.length === firingChainList.length)
                    dispatch(
                        messageActions[SHOW_MESSAGE]({
                            message: 'Fire successfully.',
                            severity: 'success',
                        })
                    );
            }
        } catch (error) {
            setFiring(false);
        }
    };

    const getHintArrayList = () => {
        const keys = globalState ? Object.keys(globalState) : [];
        const fireArray = [];
        keys.forEach((key) => {
            const keyByte = str2bytes(key);
            if (keyByte.length > 2) return;
            const no = keyByte[0] * 256 + keyByte[1];
            fireArray[no] = globalState[key];
        });
        return fireArray;
    };

    useEffect(() => {
        if (!isFireable || !computeEngine) return;
        if (firing) return;

        /* 1. get hint info from globalstate */
        let hintIndex = globalState?.hintIndex ? globalState.hintIndex : 0;
        const numberOfHint = globalState?.numberOfHint ? globalState.numberOfHint : 0;
        if (hintIndex >= numberOfHint) return;
        const hintArrayList = getHintArrayList();

        /* 2. prepare teal args computeEngine */
        const Variables = deepClone(computeEngine.Variables);
        const Expressions = deepClone(computeEngine.Expressions);
        const Guards = deepClone(computeEngine.Guards);
        let computeEngineConvertor = new ComputeEngineConvertor(computeEngine);
        let tArray = computeEngineConvertor.tokensToArguments();
        let iArray = computeEngineConvertor.indexArrayToArguments();
        const bArray = computeEngineConvertor.variablesToArguments();
        const binding = str2bytes(bArray);
        const gArray = computeEngineConvertor.guardsToGArray();
        const eArray = computeEngineConvertor.expressionToEArray();
        const fireablePlaceId = computeEngineConvertor.fireablePlaceIdToArguments();
        const placeToColor = computeEngine.placeToColor;

        /* 3. from hint -> fire transition -> generate offchain to get [args: tArray, iArray] of each chain */
        let computeEngineService = new ComputeEngine(computeEngine);
        let fireableTransition = null;
        try {
            fireableTransition =
                hintIndex < numberOfHint
                    ? computeEngineService.hintToFireTransition(hintArrayList[hintIndex], binding)
                    : null;
        } catch (error) {
            fireableTransition = { outToken: false };
        }
        const chainList = [];
        const chainStatus = [];
        let chainIndex = 0;
        let fireTransitionArray = [];
        let storeTArray = tArray,
            storeIArray = iArray;

        while (hintIndex < numberOfHint && chainList.length <= MAX_HINT / 5) {
            fireTransitionArray.push(fireableTransition);

            tArray = computeEngineConvertor.tokensToArguments();
            iArray = computeEngineConvertor.indexArrayToArguments();

            /* get tArray n iArray of computeEngine before firing a chain (5 operations) - used for fire call function */
            if (fireTransitionArray.length === 1) {
                storeIArray = iArray;
                storeTArray = tArray;
            }

            let generatedData = null;
            if (fireableTransition.outToken) {
                try {
                    const tealArgsComputeEngine = tealArgsAndOverride({
                        computeEngineConvertor,
                        tArray,
                        bArray,
                        iArray,
                        gArray,
                        eArray,
                        fireablePlaceId,
                        placeToColor,
                        Variables,
                        Expressions,
                        Guards,
                    });

                    generatedData = generateOutputAfterFireCall(
                        deepClone({ ...tealArgsComputeEngine, fireableTransition })
                    );
                    generatedData.computeEngine = deepClone({
                        ...generatedData.computeEngine,
                        indexToPlaceId: computeEngine.indexToPlaceId,
                        uidToNodeId: computeEngine.uidToNodeId,
                        indexToTransitionId: computeEngine.indexToTransitionId,
                    });
                } catch (error) {
                    console.log('error generate', error);
                }
            }

            if (generatedData?.computeEngine) {
                computeEngineService = new ComputeEngine(generatedData.computeEngine);
                computeEngineConvertor = new ComputeEngineConvertor(generatedData.computeEngine);
            }

            hintIndex++;
            try {
                fireableTransition =
                    hintIndex < numberOfHint
                        ? computeEngineService.hintToFireTransition(hintArrayList[hintIndex], binding)
                        : null;
            } catch (error) {
                fireableTransition = { outToken: false };
            }

            if (fireTransitionArray.length === 5 || !fireableTransition || !Object.values(fireableTransition)?.length) {
                chainList.push({
                    chainIndex,
                    fireTransitionArray,
                    tArray: storeTArray,
                    iArray: storeIArray,
                });
                chainStatus.push('pending');

                fireTransitionArray = [];
                chainIndex++;
            }
        }
        setFiringChainList(chainList);
        firingChainStatus.current = chainStatus;
        setStatus(chainStatus);
    }, [isFireable]);

    return (
        <FireableInformationModal
            {...props}
            firingChainList={firingChainList}
            onFire={onFire}
            firingChainStatus={firingChainStatus.current}
            firing={firing}
            shouldAddHint={shouldAddHint}
            isAdding={isAdding}
            onAddHint={handleAddHint}
            isLastTxnAddHint={isLastTxnAddHint}
        />
    );
}

export default ModalContainer;
