/**
 * Reducer для управления состоянием BloggerInfo
 * Централизует логику обновления формы редактирования блогера
 */

import type { EditData } from "@/types/profile";

/**
 * Состояние формы редактирования блогера
 */
export interface BloggerInfoState {
  categories: (string | number)[]; // Поддержка как названий, так и ID
  legalForm: "ИП" | "профдоход" | "договор подряда" | "ООО" | "";
  restrictedTopics: (string | number)[]; // Поддержка как названий, так и ID
  contactUrl: string;
  gender: "мужчина" | "женщина" | "пара" | "паблик" | "";
  barterAvailable: boolean;
  martRegistry: boolean;
}

/**
 * Actions для обновления состояния
 */
export type BloggerInfoAction =
  | { type: "SET_CATEGORIES"; payload: (string | number)[] }
  | { type: "SET_LEGAL_FORM"; payload: string }
  | { type: "SET_RESTRICTED_TOPICS"; payload: (string | number)[] }
  | { type: "SET_CONTACT_URL"; payload: string }
  | { type: "SET_GENDER"; payload: string }
  | { type: "SET_BARTER_AVAILABLE"; payload: boolean }
  | { type: "SET_MART_REGISTRY"; payload: boolean }
  | { type: "RESET_TO_INITIAL"; payload: BloggerInfoState }
  | { type: "LOAD_FROM_FORM_DATA"; payload: Partial<EditData> };

/**
 * Создает начальное состояние из formData
 */
export const createInitialState = (formData: EditData): BloggerInfoState => ({
  categories: formData.topics || [],
  legalForm: formData.work_format || "",
  restrictedTopics: formData.banned_topics || [],
  contactUrl: formData.contact_link || "",
  gender: formData.gender_type || "",
  barterAvailable: formData.barter_available ?? false,
  martRegistry: formData.mart_registry ?? false,
});

/**
 * Reducer для BloggerInfo
 */
export const bloggerInfoReducer = (
  state: BloggerInfoState,
  action: BloggerInfoAction,
): BloggerInfoState => {
  switch (action.type) {
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };

    case "SET_LEGAL_FORM":
      return {
        ...state,
        legalForm: action.payload as BloggerInfoState["legalForm"],
      };

    case "SET_RESTRICTED_TOPICS":
      return { ...state, restrictedTopics: action.payload };

    case "SET_CONTACT_URL":
      return { ...state, contactUrl: action.payload };

    case "SET_GENDER":
      return {
        ...state,
        gender: action.payload as BloggerInfoState["gender"],
      };

    case "SET_BARTER_AVAILABLE":
      return { ...state, barterAvailable: action.payload };

    case "SET_MART_REGISTRY":
      return { ...state, martRegistry: action.payload };

    case "RESET_TO_INITIAL":
      return action.payload;

    case "LOAD_FROM_FORM_DATA":
      return createInitialState(action.payload as EditData);

    default:
      return state;
  }
};

/**
 * Конвертирует состояние reducer в формат EditData для сохранения
 */
export const stateToEditData = (
  state: BloggerInfoState,
): Partial<EditData> => ({
  topics: state.categories,
  work_format: state.legalForm,
  banned_topics: state.restrictedTopics,
  contact_link: state.contactUrl,
  gender_type: state.gender,
  barter_available: state.barterAvailable,
  mart_registry: state.martRegistry,
});
