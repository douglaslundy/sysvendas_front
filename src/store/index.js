import { configureStore } from '@reduxjs/toolkit';

import clientReducer from './ducks/clients';
import layoutReducer from './ducks/Layout';


export default configureStore({
    reducer: {
        clients: clientReducer,
        layout: layoutReducer
    },
});