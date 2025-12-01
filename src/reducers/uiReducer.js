//상태를 초기화 할 때 사용할 초기값
export const initialUIState = {
  //현재 선택된 카테고리
  currentCategory: "일상",
  editingPost: null,
  isCreatingPost: false,
  isEditingProfile: false,
};

export function uiReducer(state, action) {
  switch (action.type) {
    case "SET_CATEGORY":
      return {
        ...state,
        currentCategory: action.payload,
        isCreatingPost: false,
        editingPost: null,
      };

    case "NEW_POST":
      return {
        ...state,
        isCreatingPost: true,
        editingPost: null,
      };

    case "EDIT_POST":
      return {
        ...state,
        isCreatingPost: false,
        editingPost: action.payload,
      };

    case "CANCEL_EDIT":
      return {
        ...state,
        isCreatingPost: false,
        editingPost: null,
      };

    case "OPEN_PROFILE":
      return {
        ...state,
        isEditingProfile: true,
      };

    case "CLOSE_PROFILE":
      return {
        ...state,
        isEditingProfile: false,
      };

    default:
      return state;
  }
}
