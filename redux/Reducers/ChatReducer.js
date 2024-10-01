import { ALL_CHATS, ALL_NOTIFICATIONS, USER_CHATS } from "../Type";

const initialState = {
  chatAll: [],
  userChats: [],
  allNotifications: [],
};
function ChatReducer(state = initialState, action) {
  switch (action.type) {
    case ALL_CHATS:
      return { ...state, chatAll: action.payload };
    case USER_CHATS:
      return { ...state, userChats: action.payload };
    case ALL_NOTIFICATIONS:
      return { ...state, allNotifications: action.payload };
    default:
      return state;
  }
}
export default ChatReducer;
