import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const saveToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const deleteToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error deleting token:', error);
  }
};

export const saveUserData = async (userData: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(USER_KEY, userData);
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

export const getUserData = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(USER_KEY);
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const deleteUserData = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch (error) {
    console.error('Error deleting user data:', error);
  }
};

