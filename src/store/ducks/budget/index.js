import { createAction, createReducer } from '@reduxjs/toolkit';

const INITIAL_STATE = {
	budgets: [],
	budgetsPerClient: [],
	budget: {}
}

// export const addBudget = createAction('ADD_BUDGET');
export const editBudget = createAction('EDIT_BUDGET');
export const addBudgets = createAction('ADD_BUDGETS');
export const addBudgetsPerClient = createAction('ADD_BUDGETS_PER_CLIENT');
export const showBudget = createAction('SHOW_BUDGET');


export default createReducer(INITIAL_STATE, {

	// [addBudget.type]: (state, action) => ({ budgets: [action.payload, ...state.budgets] }),

	[editBudget.type]: (state, action) => ({ budgets: [action.payload, ...state.budgets.filter((budget) => budget.id !== action.payload.id)] }),	

	[addBudgets.type]: (state, action) => ({ budgets: [...action.payload] }),

	[addBudgetsPerClient.type]: (state, action) => ({ budgetsPerClient: [...action.payload] }),

	[showBudget.type]: (state, action) => ({ ...state, budget: action.payload }),
});

