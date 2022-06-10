import { createAction, createReducer } from '@reduxjs/toolkit';

const INITIAL_STATE = {
	productsCart: [],
	productCart: {}
}


export const addProductCart = createAction('ADD_PRODUCT_CART');
export const editProductCart = createAction('EDIT_PRODUCT_CART');
export const addProductsCart = createAction('ADD_PRODUCTS_CART');
export const showProductCart = createAction('SHOW_PRODUCT_CART');
export const removeProductCart = createAction('REMOVE_PRODUCT_CART');
export const cleanProductsCart = createAction('CLEAN_PRODUCT_CART');


export default createReducer(INITIAL_STATE, {

	// addProductCart  persiste no banco insere um elemento na lista products
	[addProductCart.type]: (state, action) => ({ productsCart: [action.payload, ...state.productsCart] }),

	// editProductCart  persiste no banco uma atualização e altera o elemento na lista products
	[editProductCart.type]: (state, action) => ({ productsCart: [action.payload, ...state.productsCart.filter((prod) => prod.id !== action.payload.id)] }),

	// editProductCart  persiste no banco uma atualização de inativação e remove o elemento na lista products
	[removeProductCart.type]: (state, action) => ({ productsCart: [...state.productsCart.filter((prod) => prod.id !== action.payload.id)] }),

	// addProductsCart cria a lista de productes atraves de consulta no banco
	[addProductsCart.type]: (state, action) => ({ productsCart: [...action.payload] }),


	// [addMessage.type]: (state, action) => ({...state, messages: [ ...state.messages, action.payload ]}),
	// [removeMessage.type]: (state, action) => ({...state, messages: state.messages.filter((msg) => msg !== action.payload )}),

	// [showProductCart.type]: (state, action) => ({productCart: [action.payload]}),
	// levei um tempo para entender a logica deste reduce, eu nao estava retornando nele o estado atual com ...state
	// eu retornava soemnte o producteShow, assim eu zerava o estado e apagava array array de productes, pois eu retornava um state somente com producte show 
	[showProductCart.type]: (state, action) => ({ ...state, productCart: action.payload }),

	[cleanProductsCart.type]: (state, action) => ({ productsCart: [] })
});

