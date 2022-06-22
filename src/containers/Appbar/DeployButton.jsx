import React, { useContext } from 'react';
import DeployButtonComponent from '../../components/Appbar/DeployButton';
import algosdk from 'algosdk';
import { apiSubmitTransactions } from '../../scripts/api';
import { formatJsonRpcRequest } from '@json-rpc-tools/utils';
import { signTxnWithTestAccount, deployAppCall } from './constants';
import { useSelector, shallowEqual } from 'react-redux';
import { Context } from '../../useContext';
function DeployButton(props) {
    const { IPFS } = useContext(Context);
    const walletConnect = useSelector((state) => {
        return state.walletConnect;
    }, shallowEqual);
    const onDeploy = async (elements, computeEngine) => {
        const { chain, connector, address } = walletConnect;
        if (!connector) {
            return;
        }

        try {
            const txnsToSign = await deployAppCall(chain, address, { elements, computeEngine }, IPFS);

            // toggle pending request indicator
            const flatTxns = txnsToSign.reduce((acc, val) => acc.concat(val), []);

            const walletTxns = flatTxns.map(({ txn, signers, authAddr, message }) => ({
                txn: Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString('base64'),
                signers, // TODO: put auth addr in signers array
                authAddr,
                message,
            }));

            // sign transaction
            const requestParams = [walletTxns];
            const request = formatJsonRpcRequest('algo_signTxn', requestParams);
            const result = await connector.sendCustomRequest(request);

            // console.log('Raw response:', result);

            const indexToGroup = (index) => {
                for (let group = 0; group < txnsToSign.length; group++) {
                    const groupLength = txnsToSign[group].length;
                    if (index < groupLength) {
                        return [group, index];
                    }

                    index -= groupLength;
                }

                throw new Error(`Index too large for groups: ${index}`);
            };

            const signedPartialTxns = txnsToSign.map(() => []);
            result.forEach((r, i) => {
                const [group, groupIndex] = indexToGroup(i);
                const toSign = txnsToSign[group][groupIndex];

                if (r == null) {
                    if (toSign.signers !== undefined && toSign.signers?.length < 1) {
                        signedPartialTxns[group].push(null);
                        return;
                    }
                    throw new Error(`Transaction at index ${i}: was not signed when it should have been`);
                }

                if (toSign.signers !== undefined && toSign.signers?.length < 1) {
                    throw new Error(`Transaction at index ${i} was signed when it should not have been`);
                }

                const rawSignedTxn = Buffer.from(r, 'base64');
                signedPartialTxns[group].push(new Uint8Array(rawSignedTxn));
            });
            const signedTxns = signedPartialTxns.map((signedPartialTxnsInternal, group) => {
                return signedPartialTxnsInternal.map((stxn, groupIndex) => {
                    if (stxn) {
                        return stxn;
                    }

                    return signTxnWithTestAccount(txnsToSign[group][groupIndex].txn);
                });
            });
            const signedTxnInfo = signedPartialTxns.map((signedPartialTxnsInternal, group) => {
                return signedPartialTxnsInternal.map((rawSignedTxn, i) => {
                    if (rawSignedTxn == null) {
                        return null;
                    }

                    const signedTxn = algosdk.decodeSignedTransaction(rawSignedTxn);
                    const txn = signedTxn.txn || algosdk.Transaction; //need check
                    const txID = txn.txID();
                    const unsignedTxID = txnsToSign[group][i].txn.txID();

                    if (txID !== unsignedTxID) {
                        throw new Error(
                            `Signed transaction at index ${i} differs from unsigned transaction. Got ${txID}, expected ${unsignedTxID}`
                        );
                    }

                    if (!signedTxn.sig) {
                        throw new Error(`Signature not present on transaction at index ${i}`);
                    }

                    return {
                        txID,
                        signingAddress: signedTxn.sgnr ? algosdk.encodeAddress(signedTxn.sgnr) : undefined,
                        signature: Buffer.from(signedTxn.sig).toString('base64'),
                    };
                });
            });
            // format displayed result
            // const formattedResult = {
            //   method: 'algo_signTxn',
            //   body: signedTxnInfo,
            // };
            return submitSignedTransaction(signedTxns, signedTxnInfo[0][0].txID);
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    };
    const submitSignedTransaction = async (signedTxns, txId) => {
        const { chain } = walletConnect;
        if (signedTxns == null) {
            throw new Error('Transactions to submit are null');
        }
        for (let index = 0; index < signedTxns.length; index++) {
            try {
                let signedTxn = signedTxns[index];
                // console.log('signedTxns', signedTxns);
                const appId = await apiSubmitTransactions(chain, signedTxn);
                return { txId, appId };
            } catch (err) {
                throw new Error(err);
                //console.error(`Error submitting transaction at index ${index}:`, err);
            }
        }
    };

    return <DeployButtonComponent onDeploy={onDeploy} {...props} />;
}

export default DeployButton;
