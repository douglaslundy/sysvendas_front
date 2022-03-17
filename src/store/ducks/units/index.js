import { createAction, createReducer } from '@reduxjs/toolkit';

const INITIAL_STATE = {
	units: [],
	unit: {}
}


export const addUnit = createAction('ADD_UNIT');
export const editUnit = createAction('EDIT_UNIT');
export const addUnits = createAction('ADD_UNITS');
export const showUnit = createAction('SHOW_UNIT');
export const inactiveUnit = createAction('INACTIVE_UNIT');


export default createReducer(INITIAL_STATE, {

	// addUnit  persiste no banco insere um elemento na lista units
	[addUnit.type]: (state, action) => ({ units: [action.payload, ...state.units] }),

	// editUnit  persiste no banco uma atualização e altera o elemento na lista units
	[editUnit.type]: (state, action) => ({ units: [action.payload, ...state.units.filter((cat) => cat.id !== action.payload.id)] }),	

	// editUnit  persiste no banco uma atualização de inativação e remove o elemento na lista units
	[inactiveUnit.type]: (state, action) => ({ units: [...state.units.filter((cat) => cat.id !== action.payload.id)] }),

	// addUnits cria a lista de unites atraves de consulta no banco
	[addUnits.type]: (state, action) => ({ units: [...action.payload] }),

	[showUnit.type]: (state, action) => ({ ...state, unit: action.payload }),
});
