import {createAction, createReducer, Action} from 'typesafe-actions';
import {uniqBy} from 'lodash-es';

import {IUserInfo, IUserInfoMutation, IDBFollowersMutation} from 'models/user.model';
import {SIGN_OUT_CLEAR} from 'store/auth/auth.ducks';

export const SET_SEARCH = '@users/SET_SEARCH';
export const SET_SEARCH_FOLLOWS = '@users/SET_SEARCH_FOLLOWS';
export const MUTATE_USERS = '@users/MUTATE_USERS';
export const MUTATE_FOLLOWERS = '@users/MUTATE_FOLLOWERS';
export const SET_FOLLOWS = '@users/SET_FOLLOWS';

///////////////////////////////////////
// STORE
///////////////////////////////////////
export interface IStore {
  search: string;
  userInfoMap: {
    [key: string]: IUserInfo;
  };
  searchFollows: IUserInfo[];
  follows: string[];
  followers: string[];
}

export const initialState: IStore = {
  search: '',
  searchFollows: [],
  userInfoMap: {},
  follows: [],
  followers: [],
};

///////////////////////////////////////
// Actions
///////////////////////////////////////
export const signOutClear = createAction(SIGN_OUT_CLEAR)();
export const setSearch = createAction(SET_SEARCH, (v: string) => v)();
export const setSearchFollows = createAction(SET_SEARCH_FOLLOWS, (v: IUserInfo[]) => v)();
export const mutateUsers = createAction(MUTATE_USERS, (v: IUserInfoMutation[]) => v)();
export const setFollows = createAction(SET_FOLLOWS, (v: string[]) => v)();
export const mutateFollowers = createAction(MUTATE_FOLLOWERS, (v: IDBFollowersMutation[]) => v)();

///////////////////////////////////////
// Reducers
///////////////////////////////////////
export default createReducer<IStore, Action>(initialState)
  .handleAction(signOutClear, () => ({
    ...initialState,
  }))
  .handleAction(setSearch, (state, {payload}) => ({
    ...state,
    search: payload,
  }))
  .handleAction(mutateUsers, (state, {payload}) => {
    const userInfoMap = {...state.userInfoMap};
    payload.forEach(({type, doc}) => {
      if (['added', 'modified'].includes(type)) {
        userInfoMap[doc.id] = doc;
      } else if (type === 'removed') {
        delete userInfoMap[doc.id];
      }
    });
    return {
      ...state,
      userInfoMap,
    };
  })
  .handleAction(mutateFollowers, (state, {payload}) => {
    const {followers = []} = state;
    payload.forEach(({type, doc}) => {
      if (type === 'added') {
        followers.push(doc.id);
      }
      if (type === 'removed') {
        const curIndex = followers.indexOf(doc.id);
        curIndex > -1 && followers.splice(curIndex, 1);
      }
    });
    return {
      ...state,
      followers: uniqBy([...followers], item => item),
    };
  })
  .handleAction(setSearchFollows, (state, {payload}) => ({
    ...state,
    searchFollows: payload,
  }))
  .handleAction(setFollows, (state, {payload}) => ({
    ...state,
    follows: payload,
  }));
