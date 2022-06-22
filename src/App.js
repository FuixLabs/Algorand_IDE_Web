import React, { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import indexRoute from './routes';
import muiTheme from './MuiTheme';
import { ThemeProvider } from '@mui/material/styles';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import UseContext from './useContext';
import Mess from './components/Snackbar';
import rootReducer from './redux/store';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { walletConnectActions } from './redux/reducer/walletConnect';
import { apiGetAccountAssets } from './scripts/api';
import walletConnectConstants from './redux/constants/walletConnect';
import { formatBigNumWithDecimals } from './scripts/util';
import './App.css';
const { UPDATE_ASSETS, UPDATE_DATA, RESET } = walletConnectConstants;
let interval = '';

const switchRoutes = (
    <Suspense fallback={<div />}>
        <Switch>
            {indexRoute.map((prop, key) => {
                return <Route path={prop.path} component={prop.component} key={key} />;
            })}
        </Switch>
    </Suspense>
);

const Content = () => {
    const { colorSettings, connector, chain } = useSelector((state) => {
        let { connector, chain } = state.walletConnect;
        return { colorSettings: state.settings.theme.colorSettings, connector, chain };
    }, shallowEqual);
    const dispatch = useDispatch();
    const _apiGetAccountAssets = (chain, address) => {
        if (interval) {
            clearInterval(interval);
        }
        apiGetAccountAssets(chain, address)
            .then((res) => {
                //just save Algo currency
                let assets = res && res.length ? [res.find((item) => item.unitName === 'Algo')] : [];
                assets.forEach((item) => {
                    item.amount = formatBigNumWithDecimals(item.amount, item.decimals);
                });
                dispatch(walletConnectActions[UPDATE_ASSETS]({ assets }));
                interval = setTimeout(() => _apiGetAccountAssets(chain, address), 15000);
            })
            .catch((err) => {
                // console.log('err', err);
            });
    };
    const subscribeToEvents = async () => {
        if (!connector) {
            return;
        }
        connector.on('session_update', async (error, payload) => {
            if (error) {
                throw error;
            }
            const { accounts } = payload.params[0];
            // console.log('session_update', payload);
            const address = accounts[0];
            dispatch(
                walletConnectActions[UPDATE_DATA]({
                    data: {
                        accounts,
                        address,
                    },
                })
            );
            _apiGetAccountAssets(chain, address);
        });
        connector.on('connect', (error, payload) => {
            if (error) {
                throw error;
            }
            // console.log('connect');
            const { accounts } = connector;
            const address = accounts[0];
            dispatch(
                walletConnectActions[UPDATE_DATA]({
                    data: {
                        accounts,
                        address,
                    },
                })
            );
            _apiGetAccountAssets(chain, address);
        });
        connector.on('disconnect', (error, payload) => {
            if (error) {
                throw error;
            }
            // console.log('disconnect');
            dispatch(walletConnectActions[RESET]());
        });
        if (connector.connected) {
            const { accounts } = connector;
            const address = accounts[0];
            _apiGetAccountAssets(chain, address);
        }
    };

    useEffect(() => {
        subscribeToEvents();
    }, [connector]);
    return (
        <ThemeProvider theme={muiTheme(colorSettings)}>
            <BrowserRouter>{switchRoutes}</BrowserRouter>
            <Mess />
        </ThemeProvider>
    );
};

function App() {
    return (
        <Provider store={rootReducer}>
            <UseContext>
                <Content />
            </UseContext>
        </Provider>
    );
}

export default App;
