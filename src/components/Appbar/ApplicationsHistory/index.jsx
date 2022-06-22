import React, { useState } from 'react';
import ButtonShow from './Button';
import Dialog from './Dialog';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import './styles/index.scss';
const ApplicationsHistory = ({ transactions = [] }) => {
    const [open, setOpen] = useState(false);
    const walletConnect = useSelector((state) => {
        return state.walletConnect;
    }, shallowEqual);
    const { chain, address } = walletConnect;

    const toggleModal = () => {
        setOpen(!open);
    };
    return address ? (
        <>
            <ButtonShow onClick={toggleModal} number={transactions.length} />
            <Dialog open={open} onClose={toggleModal} transactions={transactions} chain={chain} address={address} />
        </>
    ) : (
        ''
    );
};
ApplicationsHistory.propTypes = {
    transactions: PropTypes.array,
};
export default ApplicationsHistory;
