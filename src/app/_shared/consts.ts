import { FieldTypes } from './models/field-types.enum';

export const HTTP_ERROR_EVENT = 'http-error';
export const HTTP_SUCCESS_EVENT = 'http-success';
export const SUCCESS_EVENT = '[EVENT] Success';
export const ERROR_EVENT = '[EVENT] Error';
export const BIG_POPUP_WIDTH = `1200px`;
export const BIG_POPUP_HEIGHT = '690px';
export const SMALL_POPUP_WIDTH = `700px`;
export const GRID_ROW_HEIGHT = 240;
export const EXCEPTED_FIELDS_FROM_AUTOCOMPLETE = [
  FieldTypes.CONSENT_SECTION,
  FieldTypes.TEXT_BLOCK,
  FieldTypes.FILE_UPLOADER,
  FieldTypes.REPEATING_SECTION
];
