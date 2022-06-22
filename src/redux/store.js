import { configureStore } from '@reduxjs/toolkit';
import contract from './reducer/contract';
import message from './reducer/message';
import model from './reducer/model';
import settings from './reducer/settings';
import walletConnect from './reducer/walletConnect';
import dapp from './reducer/dapp';
export default configureStore({
    reducer: {
        contract,
        message,
        model,
        settings,
        walletConnect,
        dapp,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
