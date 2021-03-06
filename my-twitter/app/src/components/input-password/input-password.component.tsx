import React, {FC, useEffect, createRef} from 'react';
import {Input, Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import {TouchableOpacity, View} from 'react-native';

import {inputStyleProps} from 'constants/theme';
import {usePrevious, setTestId} from 'services/core/core.service';

export interface IProps {
  children: string;
  showPassword: boolean;
  disabled: boolean;
  placeholder: string;
  errorMessage?: string;
  id?: string;
}

export interface IHandlers {
  toggleShowPassword(): void;
  onChangeText(value: string): void;
  onEndEditing?(): void;
  onSubmitEditing?(): void;
}

export const InputPaswordComponent: FC<IProps & IHandlers> = props => {
  const {
    children,
    showPassword,
    disabled,
    toggleShowPassword,
    placeholder,
    onChangeText,
    errorMessage = '',
    onEndEditing,
    onSubmitEditing,
    id,
  } = props;
  const animRef = createRef<any>();
  const prevErrorMessage = usePrevious(errorMessage);

  useEffect(() => {
    if (animRef.current && errorMessage !== '' && prevErrorMessage !== errorMessage) {
      (animRef.current.shake as any)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  return (
    <Animatable.View ref={animRef} useNativeDriver={true} duration={200}>
      <Input
        {...inputStyleProps}
        disabled={disabled}
        value={children}
        leftIcon={<Icon name="lock-outline" type="material-community" size={24} />}
        rightIcon={
          <TouchableOpacity onPress={toggleShowPassword}>
            <Icon name={showPassword ? 'eye-outline' : 'eye-off-outline'} type="material-community" size={24} />
          </TouchableOpacity>
        }
        secureTextEntry={!showPassword}
        placeholder={placeholder}
        autoCompleteType="password"
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
        onSubmitEditing={onSubmitEditing}
        {...setTestId(id)}
      />
      <View style={inputStyleProps.errorContainer}>
        {errorMessage !== '' && (
          <Animatable.Text
            animation={'fadeInDown'}
            duration={200}
            useNativeDriver={true}
            style={inputStyleProps.errorStyle}
            {...setTestId(id, '_error')}>
            {errorMessage}
          </Animatable.Text>
        )}
      </View>
    </Animatable.View>
  );
};
