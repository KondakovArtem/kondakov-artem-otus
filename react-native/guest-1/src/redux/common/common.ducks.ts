import {createReducer, createAction, Action} from 'typesafe-actions';
import auth from '@react-native-firebase/auth';
import {NavigationActions, NavigationContainerComponent, NavigationState} from 'react-navigation';
import {Dispatch} from 'redux';
import AsyncStorage from '@react-native-community/async-storage';

import {NavAliases, NAV_STATE_KEY} from '@app/model/navigation.model';
import {IUserInfo} from '@app/model/login.model';
import {GetStore} from '@app/redux/store';
import {getStorageFileUrl} from '@app/services/database/database.service';
import {takePhoto} from '@app/services/photo/photo.service';

export const ActionTypes = {
  SIGN_OUT_CLEAR: '@common/SIGN_OUT_CLEAR',
  FILL_USER_INFO: '@common/FILL_USER_INFO',
  NAVIGATE: '@common/NAVIGATE',
  SET_AVATAR: '@common/SET_AVATAR',
};

const {LOGIN_SCREEN, USER_PROFILE_SCREEN, APP_STACK} = NavAliases;

let _navigator: NavigationContainerComponent;
let authSubscription: () => void;

function navigate(routeName: string, params?: any) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

///////////////////////////////////////////
// STORE
///////////////////////////////////////////
export interface IStore {
  userUid: string;
  info?: IUserInfo;
}

const initialState: IStore = {
  userUid: '',
  info: undefined,
};

function resolveNavStateName(navState: NavigationState): string | undefined {
  if (!navState) return undefined;
  const {index, routes} = navState;
  if (routes && routes[index]) {
    return resolveNavStateName(routes[index]);
  }
  return (navState as any).routeName;
}

function getCurrentScreen() {
  return resolveNavStateName((_navigator.state as any).nav as NavigationState);
}

/////////////////////////////////////////////
/// ACTIONS
/////////////////////////////////////////////
const fullUserState = createAction(ActionTypes.FILL_USER_INFO, (data: {userUid: string; info: IUserInfo}) => data)();
const signOutClear = createAction(ActionTypes.SIGN_OUT_CLEAR, () => {})();
const setAvatar = createAction(ActionTypes.SET_AVATAR, (avatar: string) => avatar)();

export const Actions = {
  navigate: (screen: NavAliases) => () => {
    navigate(screen);
  },
  loadNavigationState: () => async (dispatch: Dispatch, getStore: GetStore) => {
    const jsonString = (await AsyncStorage.getItem(NAV_STATE_KEY)) as string;
    const data = JSON.parse(jsonString);
    Actions.initAuth()(dispatch, getStore);
    return data;
  },
  persistNavigationState: (navState: NavigationState) => async () => {
    try {
      await AsyncStorage.setItem(NAV_STATE_KEY, JSON.stringify(navState));
    } catch (err) {
      // handle the error according to your needs
    }
  },
  setTopLevelNavigator: (navigatorRef: NavigationContainerComponent) => async () => {
    _navigator = navigatorRef;
  },
  checkIsAuth: () => (dispatch: Dispatch, getStore: GetStore) => {
    const {currentUser} = auth();
    const {common} = getStore();
    const {userUid} = common;
    if (currentUser && currentUser.uid === userUid) {
      return true;
    }
    return false;
  },
  initAuth: () => async (dispatch: Dispatch, getStore: GetStore) => {
    if (!authSubscription) {
      authSubscription = auth().onUserChanged(async currentUser => {
        const {common} = getStore();
        const {userUid} = common;
        const screen = getCurrentScreen();

        if (!currentUser) {
          if (userUid !== '' || screen !== LOGIN_SCREEN) {
            dispatch({type: ActionTypes.SIGN_OUT_CLEAR});
            Actions.navigate(LOGIN_SCREEN)();
          }
        } else {
          if (currentUser.uid !== userUid) {
            dispatch({
              type: ActionTypes.FILL_USER_INFO,
              payload: {
                userUid: currentUser.uid,
                info: {
                  initial: currentUser.email?.substr(0, 2).toUpperCase(),
                  avatar: await getStorageFileUrl(`${currentUser.uid}/avatar`),
                } as IUserInfo,
              },
            });
          }
          if (screen === LOGIN_SCREEN) {
            Actions.navigate(APP_STACK)();
          }
        }
      });
    }
  },
  showProfile: () => async () => {
    Actions.navigate(USER_PROFILE_SCREEN)();
  },
  onTakeAvatar: () => async (dispatch: Dispatch, getStore: GetStore) => {
    const {common} = getStore();
    const {userUid} = common;
    const newAvatar = await takePhoto(userUid, 'avatar');
    if (newAvatar) {
      dispatch(setAvatar(newAvatar));
    }
  },
};

/////////////////////////////////////////////
/// REDUCERS
/////////////////////////////////////////////
export const reducer = createReducer<IStore, Action>(initialState)
  .handleAction(fullUserState, (state, {payload}) => ({...state, ...payload}))
  .handleAction(signOutClear, state => ({
    ...state,
    ...initialState,
  }))
  .handleAction(setAvatar, (state, {payload}) => ({
    ...state,
    info: {
      ...(state.info as IUserInfo),
      avatar: payload,
    },
  }));
