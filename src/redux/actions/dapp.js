import axios from 'axios';
import { lookupApplications, searchForTransactionsByAppId, decodeGlobalState } from '../../scripts/api';
import messageConstants from '../constants/message';
import { dappSliceActions } from '../reducer/dapp';
import { messageActions } from '../reducer/message';
const { SHOW_MESSAGE } = messageConstants;

export const fetchApplicationInfo = (chain, appId, callback) => {
    return (dispatch) => {
        //start fetching
        dispatch(dappSliceActions.fetchApplication(true));
        return lookupApplications(chain, appId)
            .then((response) => {
                if (!response.application) return;
                const { application } = response;
                const baseUrl = `https://${chain === 'mainnet' ? '' : 'testnet.'}algoexplorer.io`;
                const filtered = {
                    applicationId: Number(appId),
                    block: application['created-at-round'],
                    blockUrl: baseUrl + '/block/' + application['created-at-round'],
                    creator: application.params.creator,
                    deleted: application.deleted ? 'True' : 'False',
                    numByleSlice: application.params['global-state-schema']['num-byte-slice'].toString(),
                    numUint: application.params['global-state-schema']['num-uint'].toString(),
                    link: `${baseUrl}/application/${appId}`,
                };
                dispatch(dappSliceActions.fetchApplicationSuccess(filtered));

                const globalState = application?.params?.['global-state'];
                if (globalState) dispatch(dappSliceActions.updateGlobalState(decodeGlobalState(globalState)));

                if (callback) callback(filtered);
            })
            .catch((error) => {
                //fetch failed
                dispatch(dappSliceActions.fetchApplication(false));
                dispatch(
                    messageActions[SHOW_MESSAGE]({
                        severity: 'error',
                        message: 'No application found. Please check the chain or application id.',
                        autoHideDuration: 30000,
                    })
                );
                if (callback) callback(null, error);
            });
    };
};

export const fetchTransactions = (chain, appId, minRound) => {
    return (dispatch) => {
        return searchForTransactionsByAppId({ chain, appId, minRound })
            .then((response) => {
                const { transactions } = response;
                if (transactions.length === 0) throw Error('Transactions not found.');
                dispatch(dappSliceActions.fetchTransactionsSuccess(transactions));
            })
            .catch((error) => {
                console.log('Error transactions', error);
            });
    };
};

export const updateFireable = (payload) => {
    return dappSliceActions.updateFireable(payload);
};

export const fetchModel = (transactionNote, callback) => {
    let requestUrl = Buffer.from(transactionNote, 'base64').toString('utf-8');
    return (dispatch) => {
        return axios
            .get(requestUrl)
            .then((response) => {
                const { data } = response;
                const { elements, computeEngine } = data;
                dispatch(
                    dappSliceActions.updateComputeEngineState({
                        elements,
                        computeEngine,
                    })
                );
                callback();
            })
            .catch((error) => {
                dispatch(
                    messageActions[SHOW_MESSAGE]({
                        severity: 'error',
                        message: 'Import failed.',
                    })
                );
            });
    };
};

export const updateChain = (chain) => {
    return dappSliceActions.updateChain(chain);
};

export const updateComputeEngineState = (elements, computeEngine) => {
    return dappSliceActions.updateComputeEngineState({
        elements,
        computeEngine,
    });
};
