import { createAction, createReducer } from '@reduxjs/toolkit';

const INITIAL_STATE = {
	categories: [],
	categorie: {}
}


export const addCategorie = createAction('ADD_CATEGORIE');
export const editCategorie = createAction('EDIT_CATEGORIE');
export const addCategories = createAction('ADD_CATEGORIES');
export const showCategorie = createAction('SHOW_CATEGORIE');
export const inactiveCategorie = createAction('INACTIVE_CATEGORIE');


export default createReducer(INITIAL_STATE, {

	// addCategorie  persiste no banco insere um elemento na lista categories
	[addCategorie.type]: (state, action) => ({ categories: [action.payload, ...state.categories] }),

	// editCategorie  persiste no banco uma atualização e altera o elemento na lista categories
	[editCategorie.type]: (state, action) => ({ categories: [action.payload, ...state.categories.filter((cat) => cat.id !== action.payload.id)] }),	

	// editCategorie  persiste no banco uma atualização de inativação e remove o elemento na lista categories
	[inactiveCategorie.type]: (state, action) => ({ categories: [...state.categories.filter((cat) => cat.id !== action.payload.id)] }),

	// addCategories cria a lista de categoriees atraves de consulta no banco
	[addCategories.type]: (state, action) => ({ categories: [...action.payload] }),

	[showCategorie.type]: (state, action) => ({ ...state, categorie: action.payload }),
});
