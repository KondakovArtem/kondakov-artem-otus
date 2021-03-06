/* eslint-disable no-template-curly-in-string */
import {template} from 'lodash-es';

// Non Authorized Access
export type TNavAlias = string;
export const AUTH_STACK: TNavAlias = '/authStack';
export const LOGIN_SCREEN: TNavAlias = '/login';
export const SIGN_UP_SCREEN: TNavAlias = '/singup';
export const LOADING_SCREEN: TNavAlias = '/loading';

// Authorized Access
export const EMAIL_VERIFICATION: TNavAlias = '/emailverification';
export const APP_STACK: TNavAlias = '/appstack';
export const TAB_STACK: TNavAlias = '/apptabs';
export const USER_PROFILE_SCREEN: TNavAlias = '/settings';
export const USER_PROFILE_EDIT_SCREEN: TNavAlias = '/editsettings';
export const USER_INFO_SCREEN: TNavAlias = '/user/:id';
export const MAIN_SCREEN: TNavAlias = '/';
export const EXPLORE_SCREEN: TNavAlias = '/explore';
export const NEW_POST_SCREEN: TNavAlias = '/newpost';
export const FOLLOW_SCREEN: TNavAlias = '/follows';

export const NonAuthNavAliases: TNavAlias[] = [LOGIN_SCREEN, SIGN_UP_SCREEN];

export const NavAliases: TNavAlias[] = [
  AUTH_STACK,
  LOGIN_SCREEN,
  SIGN_UP_SCREEN,
  EMAIL_VERIFICATION,
  APP_STACK,
  TAB_STACK,
  USER_PROFILE_SCREEN,
  USER_PROFILE_EDIT_SCREEN,
  MAIN_SCREEN,
  EXPLORE_SCREEN,
  NEW_POST_SCREEN,
  LOADING_SCREEN,
  FOLLOW_SCREEN,
];

// Окна приложения
export const AppNavAliases: TNavAlias[] = [
  AUTH_STACK,
  USER_PROFILE_SCREEN,
  USER_PROFILE_EDIT_SCREEN,
  MAIN_SCREEN,
  EXPLORE_SCREEN,
  TAB_STACK,
  NEW_POST_SCREEN,
  FOLLOW_SCREEN,
];

// Окна требующие авторизации пользователя
export const AuthNavAliases: TNavAlias[] = [...AppNavAliases, EMAIL_VERIFICATION];

export const NavPath = {
  USERINFO: template('user/${uid}'),
};
