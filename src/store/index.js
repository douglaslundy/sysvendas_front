import { configureStore } from '@reduxjs/toolkit';

import layoutReducer from './ducks/Layout';
import companyReducer from './ducks/companies';
import clientReducer from './ducks/clients';
import categorieReducer from './ducks/categories';
import productReducer from './ducks/products';
import unitReducer from './ducks/units';
import userReducer from './ducks/users';
import authReducer from './ducks/auth';
import cartReducer from './ducks/cart';
import saleReducer from './ducks/sales';
import budgetReducer from './ducks/budget';
import logReducer from './ducks/logs';


export default configureStore({
    reducer: {
        companies: companyReducer,
        clients: clientReducer,
        layout: layoutReducer,
        categories: categorieReducer,
        products: productReducer,
        units: unitReducer,
        users: userReducer,
        auth: authReducer,
        cart: cartReducer,
        sales: saleReducer,
        budgets: budgetReducer,
        logs: logReducer
    },
});