import asyncComponent from '../components/_asynComponent';

// import AsyncHome from '../components/Home';
// import AsyncAbout from '../components/About';
// import AsyncCatagories from '../components/Catagories';
// import AsyncProducts from '../components/Products';
// import AsyncMyComApi from '../components/myComApi';

const AsyncHome = asyncComponent(() => import('../components/Home'));

const routersAuthen = [
    {
        title: 'Home',
        path: '/',
        component: AsyncHome,
        exact: true
    }
];

export default routersAuthen;
