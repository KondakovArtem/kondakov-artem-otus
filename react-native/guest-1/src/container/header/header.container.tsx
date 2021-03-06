import React from 'react';
import {connect} from 'react-redux';
import {Text} from 'react-native';

import {IConfiguredStore} from '@app/redux/store';
import {Actions as headerActions} from '@app/redux/header/header.ducks';
import {Actions as guestActions} from '@app/redux/guests/guests.ducks';
import {HeaderComponent} from '@app/components/header/header.component';
import {IProps as IComponentProps, IHandlers as IComponentHandlers} from '@app/components/header/header.component';
import {commonStyles} from '@app/services/style/style.service';

export const HeaderContainer = connect<IComponentProps, IComponentHandlers, {}, IConfiguredStore>(
  state => {
    const {header, guests} = state;
    const {inputValue} = header;
    const {list: guestList, filter} = guests;

    let guestTotal = guestList.length;
    guestList.forEach(guest => {
      guestTotal += guest.withPartner ? 1 : 0;
    });
    return {
      inputValue,
      guestFilter: filter,
      guestTotal,
      titleComponent: () => (
        <Text style={commonStyles.appBarTitle}>{`Guests list ${guestTotal ? `(${guestTotal})` : ''}`}</Text>
      ),
    };
  },
  {
    setInputValue: headerActions.setInputValue,
    onAddGuest: headerActions.addNewGuest,
    updateGuestFilter: guestActions.updateGuestFilter,
  },
)(HeaderComponent);
