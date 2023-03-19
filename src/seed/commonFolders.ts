
export const INBOX_FIELD_NAME  = 'inbox_id';  //inward
export const OUTBOX_FIELD_NAME = 'folder_id'; //outward

/**
 * PLACEs are equal COMMON_FOLDER_IDs; all above id numbers are means a user defined folder
 */
export enum PLACE {
  trash  = 0, //out from basket (invisible)
  outbox = 1, //out
  draft  = 2, //out
  basket = 3, //out basket
  inbox  = 4, //in
  
  last        // undefined or bad, must be last
};

export const USER_FOLDERS_START_ID = PLACE.last;
