import React, { useState, useEffect } from 'react';
import { clientForChainIndexer } from '../../scripts/api';
import { useSelector, shallowEqual } from 'react-redux';
import ApplicationsHistory from '../../components/Appbar/ApplicationsHistory';
const ApplicationsHistoryContainer = () => {
    const [transactions, setTransactions] = useState([]);
    const walletConnect = useSelector((state) => {
        return state.walletConnect;
    }, shallowEqual);
    const { chain, address, deployChange } = walletConnect;
    const [interval, _setInterval] = useState('');
    useEffect(() => {
        if (!address) {
            setTransactions([]);
        }
        async function fetchData() {
            await fetchApplications(address);
            if (interval) {
                clearInterval(interval);
            }
            _setInterval(setInterval(() => fetchApplications(address), 15000));
        }
        fetchData();
    }, [address, chain, deployChange]);

    const fetchApplications = async (_address) => {
        if (_address) {
            let client = clientForChainIndexer(chain);
            try {
                const res = await client.lookupAccountByID(_address).do();
                if (_address === address) {
                    return setTransactions(
                        res && res.account && res.account['created-apps']
                            ? res.account['created-apps'].sort((a, b) => b['created-at-round'] - a['created-at-round'])
                            : []
                    );
                }
                setTransactions([]);
            } catch (err) {
                // console.log(err);
                setTransactions([]);
            }
        } else {
            setTransactions([]);
        }
    };

    return <ApplicationsHistory transactions={transactions} />;
};
ApplicationsHistoryContainer.propTypes = {};
export default ApplicationsHistoryContainer;
