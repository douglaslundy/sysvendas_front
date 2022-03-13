import { createAction, createReducer } from '@reduxjs/toolkit';

const INITIAL_STATE = {
    messages: [],
    alertMessages:[],
    isOpenModal: false, 
    isOpenAlert: false,
    titleAlert: "Cliente Cadastrado com sucesso!",
    subTitleAlert: "Clique em ok para fechar!"
};


export const addMessage = createAction('ADD_MESSAGE');
export const removeMessage = createAction('REMOVE_MESSAGE');

export const addAlertMessage = createAction('ADD_ALERT_MESSAGE');
export const removeAlertMessage = createAction('REMOVE_ALERT_MESSAGE');

export const turnModal = createAction('IS_OPEN_MODAL');

export const turnAlert = createAction('IS_OPEN_ALERT');

export const changeTitleAlert = createAction('CHANGE_TITLE_ALERT');

export const changeSubTitleALert = createAction('CHANGE_SUB_TITLE_ALERT');

export default createReducer(INITIAL_STATE, {
   [addMessage.type]: (state, action) => ({...state, messages: [ ...state.messages, action.payload ]}),
   [removeMessage.type]: (state, action) => ({...state, messages: state.messages.filter((msg) => msg !== action.payload )}),

   [addAlertMessage.type]: (state, action) => ({...state, alertMessages: [...state.alertMessages, action.payload ]}),
   [removeAlertMessage.type]: (state, action) => ({...state, alertMessages: state.alertMessages.filter((msg) => msg !== action.payload )}),
   
   [turnModal.type] : (state, action) => ({...state, isOpenModal: ( !state.isOpenModal)}),

   [turnAlert.type] : (state, action) => ({...state, isOpenAlert: ( !state.isOpenAlert)}),

   [changeTitleAlert.type] : (state, action) => ({...state, titleAlert: action.payload}),

   [changeSubTitleALert.type] : (state, action) => ({...state, subTitleAlert: action.payload})
});


























// Codigo abaixo foi subistituido com a refatoração utilizando @reduxjs/toolkit
// const INITIAL_STATE = {
//     showMessage: false
// };

// export default (state = INITIAL_STATE, action) => {
//     switch (action.type) {
//         case 'SHOW_MESSAGE':
//             return { ...state, showMessage: true };
//         case 'HIDE_MESSAGE':
//             return { ...state, showMessage: false };
//         default:
//             return state;
//     }
// }

// export const Types = {
//     SHOW_MESSAGE: 'SHOW_MESSAGE'
// }

// export const showMessage = () => {
//     return {
//         type: 'SHOW_MESSAGE'
//     };
// };

// export const hideMessage = () => {
//     return {
//         type: 'HIDE_MESSAGE'
//     };
// };