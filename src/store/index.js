import { configureStore } from '@reduxjs/toolkit';

import layoutReducer from './ducks/Layout';
import clientReducer from './ducks/clients';
import categorieReducer from './ducks/categories';
import productReducer from './ducks/products'


export default configureStore({
    reducer: {
        clients: clientReducer,
        layout: layoutReducer, 
        categories: categorieReducer,
        products: productReducer,
    },
});