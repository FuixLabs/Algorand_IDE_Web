import React, { createContext, useReducer, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { create } from 'ipfs-http-client';
export const Context = createContext();
const reactFlowInstanceReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_INSTANCE':
            state = action.ref;
            return state;
        default:
            return state;
    }
};
const reactFlowInstanceInit = {};
const UseContext = ({ children }) => {
    const [_IPFS, setIPFS] = useState('');
    const [_reactFlowInstanceReducer, dispatch] = useReducer(reactFlowInstanceReducer, reactFlowInstanceInit);
    useEffect(() => {
        initIPFS();
    }, []);

    const initIPFS = async () => {
        const node = await create('https://ipfs.infura.io:5001/api/v0');
        setIPFS(node);
    };
    return (
        <Context.Provider
            value={{
                IPFS: _IPFS,
                reactFlow: {
                    state: _reactFlowInstanceReducer,
                    dispatch,
                },
            }}
        >
            {children}
        </Context.Provider>
    );
};

UseContext.propTypes = {
    children: PropTypes.object,
    context: PropTypes.any,
};

export default UseContext;
