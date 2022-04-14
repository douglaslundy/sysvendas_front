import { createAction, createReducer } from '@reduxjs/toolkit';

const INITIAL_STATE = {
	products: [],
	product: {}
}


export const addProduct = createAction('ADD_PRODUCT');
export const editProduct = createAction('EDIT_PRODUCT');
export const addProducts = createAction('ADD_PRODUCTS');
export const showProduct = createAction('SHOW_PRODUCT');
export const inactiveProduct = createAction('INACTIVE_PRODUCT');


export default createReducer(INITIAL_STATE, {

	// addProduct  persiste no banco insere um elemento na lista products
	[addProduct.type]: (state, action) => ({ products: [action.payload, ...state.products] }),

	// editProduct  persiste no banco uma atualização e altera o elemento na lista products
	[editProduct.type]: (state, action) => ({ products: [action.payload, ...state.products.filter((prod) => prod.id !== action.payload.id)] }),	

	// editProduct  persiste no banco uma atualização de inativação e remove o elemento na lista products
	[inactiveProduct.type]: (state, action) => ({ products: [...state.products.filter((prod) => prod.id !== action.payload.id)] }),

	// addProducts cria a lista de productes atraves de consulta no banco
	[addProducts.type]: (state, action) => ({ products: [...action.payload] }),


	// [addMessage.type]: (state, action) => ({...state, messages: [ ...state.messages, action.payload ]}),
	// [removeMessage.type]: (state, action) => ({...state, messages: state.messages.filter((msg) => msg !== action.payload )}),

	// [showProduct.type]: (state, action) => ({product: [action.payload]}),
	// levei um tempo para entender a logica deste reduce, eu nao estava retornando nele o estado atual com ...state
	// eu retornava soemnte o producteShow, assim eu zerava o estado e apagava array array de productes, pois eu retornava um state somente com producte show 
	[showProduct.type]: (state, action) => ({ ...state, product: action.payload }),
});

