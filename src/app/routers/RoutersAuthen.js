import asyncComponent from '../components/_asynComponent';

// import AsyncHome from '../components/Home';
// import AsyncAbout from '../components/About';
// import AsyncCatagories from '../components/Catagories';
// import AsyncProducts from '../components/Products';
// import AsyncMyComApi from '../components/myComApi';

import AsyncSetToken from '../components/_deApp/setToken';
import AsyncSetWhiteList from '../components/_deApp/setWhiteList';
// const AsyncSetToken = asyncComponent(() => import('../components/_deApp/setToken'));
// const AsyncSetWhiteList = asyncComponent(() => import('../components/_deApp/setWhiteList'));

const routersAuthen = [
    {
        title: 'Set Token',
        path: '/',
        component: AsyncSetToken,
        exact: true
    },
    {
        title: 'Set WhiteList',
        path: '/whitelist',
        component: AsyncSetWhiteList,
        exact: true
    }
];

export default routersAuthen;
