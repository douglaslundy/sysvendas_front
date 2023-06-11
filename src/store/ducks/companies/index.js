import { createAction, createReducer } from '@reduxjs/toolkit';

const INITIAL_STATE = {
    companies: [],
    company: {}
}


export const addCompany = createAction('ADD_COMPANY');
export const editCompany = createAction('EDIT_COMPANY');
export const addCompanies = createAction('ADD_COMPANIES');
export const showCompany = createAction('SHOW_COMPANY');
export const inactiveCompany = createAction('INACTIVE_COMPANY');


export default createReducer(INITIAL_STATE, {

    // addCompany  persiste no banco insere um elemento na lista companies
    [addCompany.type]: (state, action) => ({ companies: [action.payload, ...state.companies] }),

    // editCompany  persiste no banco uma atualização e altera o elemento na lista companies
    [editCompany.type]: (state, action) => ({ companies: [action.payload, ...state.companies.filter((com) => com.id !== action.payload.id)] }),

    // editCompany  persiste no banco uma atualização de inativação e remove o elemento na lista companies
    [inactiveCompany.type]: (state, action) => ({ companies: [...state.companies.filter((com) => com.id !== action.payload.id)] }),

    // addcompanies cria a lista de Companyes atraves de consulta no banco
    [addCompanies.type]: (state, action) => ({ companies: [...action.payload] }),


    [showCompany.type]: (state, action) => ({ ...state, company: action.payload }),
});

