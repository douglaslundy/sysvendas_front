import { configureStore } from '@reduxjs/toolkit';

import layoutReducer from './ducks/Layout';
import clientReducer from './ducks/clients';
import categorieReducer from './ducks/categories';
import productReducer from './ducks/products';
import unitReducer from './ducks/units';
import userReducer from './ducks/users';
import authReducer from './ducks/auth';


export default configureStore({
    reducer: {
        clients: clientReducer,
        layout: layoutReducer, 
        categories: categorieReducer,
        products: productReducer,
        units: unitReducer,
        users: userReducer,
        auth: authReducer 
    },
});