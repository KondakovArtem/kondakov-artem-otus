import {NavigationContainerComponent, NavigationActions, NavigationState, NavigationRoute} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

import {NAV_STATE_KEY, NavAliases, NAV_STATE_VERSION} from 'models/navigation.model';
import {NAV_VERSION} from 'constants/common';

let _navigator: NavigationContainerComponent;
let isNavLoaded = false;

export const navUtils = {
  setTopLevelNavigator: (navigatorRef: NavigationContainerComponent) => {
    if (navigatorRef) {
      _navigator = navigatorRef;
    }
  },
  persistNavigationState: async (navState: NavigationState) => {
    try {
      await AsyncStorage.setItem(NAV_STATE_KEY, JSON.stringify(navState));
      await AsyncStorage.setItem(NAV_STATE_VERSION, NAV_VERSION);
    } catch (err) {}
  },
  loadNavigationState: async () => {
    isNavLoaded = false;
    const version = (await AsyncStorage.getItem(NAV_VERSION)) as string;
    if (!version || version !== NAV_VERSION) {
      isNavLoaded = true;
      return;
    }
    const jsonString = (await AsyncStorage.getItem(NAV_STATE_KEY)) as string;

    let data: any = JSON.parse(jsonString) as NavigationState;
    const savedNavAliases = navUtils.collectNavAliases(data);
    const missingScreenInSaved = savedNavAliases.find(alias => !NavAliases.includes(alias));
    isNavLoaded = true;
    return missingScreenInSaved ? undefined : data;
  },
  navigate: (routeName: string, params?: any) => {
    if ((_navigator.state as any).nav == null) {
      return;
    }
    _navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      }),
    );
  },
  back: () => {
    _navigator.dispatch(NavigationActions.back());
  },
  resolveScreenAlias: (navState: NavigationState): string | undefined => {
    if (!navState) {
      return undefined;
    }
    const {index, routes} = navState;
    if (routes && routes[index]) {
      return navUtils.resolveScreenAlias(routes[index]);
    }
    return (navState as any).routeName;
  },
  collectNavAliases: (navState: NavigationState | NavigationRoute, res: string[] = []) => {
    if (!navState) {
      return res;
    }
    const {routes, routeName} = navState as NavigationRoute;
    routeName && res.push(routeName);
    if (routes && routes.length) {
      routes.forEach(route => {
        navUtils.collectNavAliases(route, res);
      });
    }
    return res;
  },
  getCurrentScreen: () => {
    return navUtils.resolveScreenAlias((_navigator.state as any).nav as NavigationState);
  },
  onNavigationInited: async () => {
    return new Promise(resolve => {
      function checkNavigation() {
        if (!_navigator || !(_navigator.state as any).nav || !isNavLoaded) {
          setTimeout(checkNavigation, 100);
        } else {
          resolve();
        }
      }
      checkNavigation();
    });
  },
};
