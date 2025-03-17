import { createSlice } from '@reduxjs/toolkit';

const conversationSlice = createSlice({
    name: 'conversation',
    initialState: {
        conversations: null,
    },
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload;
        },
        clearConversations: (state) => {
            state.conversations = null;
        },
    },
});

export const { setConversations, clearConversations } = conversationSlice.actions;
export default conversationSlice.reducer;
