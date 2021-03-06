import React, {FC} from 'react';
import {View, StatusBar, TouchableOpacity, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import * as Animatable from 'react-native-animatable';
import {Text, SocialIcon} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as MagicMove from 'react-native-magic-move';

import {IConfiguredStore} from 'store';
import authActions from 'store/auth/auth.actions';
import {InputPaswordComponent} from 'components/input-password/input-password.component';
import {InputComponent} from 'components/input/input.component';
import {statusBackground, commonStyles, COMMON_DURATION} from 'constants/theme';
import {LoginHeaderComponent} from 'components/login-header/login-header.component';
import {FullWidthButtonComponent} from 'components/full-width-button/full-width-button.component';
import {setTestId} from 'services/core/core.service';

interface IProps {
  showPassword: boolean;
  username: string;
  password: string;
  isFetching: boolean;
  errors: {
    [key: string]: string;
  };
}
interface IHandlers {
  toggleShowPassword: () => void;
  setPassword: (pwd: string) => void;
  setUsername: (username: string) => void;
  signIn: () => void;
  signInGoogle: () => void;
  toSignUp: () => void;
}

const styles = StyleSheet.create({
  conatiner: {
    alignItems: 'center',
    flex: 2,
    justifyContent: 'space-evenly',
  },
  keyboardAware: {
    flexGrow: 1,
  },
  googleButton: {
    marginTop: 30,
  },
  footer: {
    flexDirection: 'row',
    padding: 10,
  },
  signUpLink: {
    fontWeight: 'bold',
  },
});

export const LoginScreenComponent: FC<IProps & IHandlers> = ({
  showPassword,
  toggleShowPassword,
  username,
  password,
  setPassword,
  setUsername,
  isFetching,
  signIn,
  signInGoogle,
  toSignUp,
  errors,
}) => {
  const checkButtonDisabled = () => !(password !== '' && username !== '' && !isFetching);

  return (
    <MagicMove.Scene>
      <StatusBar backgroundColor={statusBackground} barStyle="light-content" />
      <KeyboardAwareScrollView contentContainerStyle={styles.keyboardAware}>
        <LoginHeaderComponent />
        <Animatable.View
          style={styles.conatiner}
          animation={'zoomIn'}
          useNativeDriver={true}
          duration={COMMON_DURATION}>
          <View style={commonStyles.inputContainer}>
            <InputComponent
              id="email"
              disabled={isFetching}
              leftIcon={{name: 'email-outline', type: 'material-community'}}
              placeholder={'Email'}
              onChangeText={setUsername}
              errorMessage={errors.username}
              onSubmitEditing={signIn}>
              {username}
            </InputComponent>

            <InputPaswordComponent
              id="password"
              disabled={isFetching}
              onChangeText={setPassword}
              placeholder={'Password'}
              showPassword={showPassword}
              toggleShowPassword={toggleShowPassword}
              errorMessage={errors.password}
              onSubmitEditing={signIn}>
              {password}
            </InputPaswordComponent>

            <SocialIcon
              {...setTestId('signInWithGoogleButton')}
              disabled={isFetching}
              style={styles.googleButton}
              title="Sign in with Google"
              button
              type="google"
              onPress={signInGoogle}
            />
          </View>
          <FullWidthButtonComponent
            id="signInButton"
            loading={isFetching}
            disabled={checkButtonDisabled()}
            onPress={signIn}>
            Login
          </FullWidthButtonComponent>
          <View style={styles.footer}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={toSignUp}>
              <Text
                {...setTestId('signUpLink')}
                accessibilityLabel="signUpLink"
                nativeID="signUpLink"
                style={styles.signUpLink}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </KeyboardAwareScrollView>
    </MagicMove.Scene>
  );
};

export const LoginScreen = connect<IProps, IHandlers, {}, IConfiguredStore>(
  ({authData}) => {
    const {login} = authData;
    return {
      ...login,
    };
  },
  {
    setUsername: authActions.setUsername,
    setPassword: authActions.setPassword,
    toggleShowPassword: authActions.toggleShowPassword,
    signIn: authActions.signIn,
    signInGoogle: authActions.signInGoogle,
    toSignUp: authActions.toSignUp,
  },
)(LoginScreenComponent);
