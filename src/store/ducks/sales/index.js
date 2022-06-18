import { createAction, createReducer } from '@reduxjs/toolkit';

const INITIAL_STATE = {
	sales: [],
	salesPerClient: [],
	sale: {}
}

// export const addSale = createAction('ADD_SALE');
export const editSale = createAction('EDIT_SALE');
export const addSales = createAction('ADD_SALES');
export const addSalesPerClient = createAction('ADD_SALES_PER_CLIENT');
export const showSale = createAction('SHOW_SALE');


export default createReducer(INITIAL_STATE, {

	// [addSale.type]: (state, action) => ({ sales: [action.payload, ...state.sales] }),

	[editSale.type]: (state, action) => ({ sales: [action.payload, ...state.sales.filter((sale) => sale.id !== action.payload.id)] }),	

	[addSales.type]: (state, action) => ({ sales: [...action.payload] }),

	[addSalesPerClient.type]: (state, action) => ({ salesPerClient: [...action.payload] }),

	[showSale.type]: (state, action) => ({ ...state, sale: action.payload }),
});

