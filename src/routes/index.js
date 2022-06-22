import { lazy } from 'react';
const MainnetDapp = lazy(() => import('../containers/Dapp/Mainnet'));
const TestnetDapp = lazy(() => import('../containers/Dapp/Testnet'));
const Main = lazy(() => import('../components/WorkBoard/index'));
const indexRoutes = [
    {
        path: '/mainnet/application/:id',
        component: MainnetDapp,
    },
    {
        path: '/testnet/application/:id',
        component: TestnetDapp,
    },
    {
        path: `/`,
        component: Main,
    },
];

export default indexRoutes;
