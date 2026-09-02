import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { login, signup, getToken } from '@/services/authApi';
import { ApiError } from '@/services/httpClient';

export interface AuthUser {
  id: number;
  email: string;
  username: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  // Становится true после того как StoreProvider один раз попытался
  // восстановить сессию из localStorage — до этого нельзя решать,
  // авторизован пользователь или нет (иначе защищённые страницы будут
  // на мгновение редиректить залогиненных пользователей).
  authChecked: boolean;
  loginStatus: 'idle' | 'loading' | 'failed';
  loginError: string | null;
  signupStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  signupError: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  authChecked: false,
  loginStatus: 'idle',
  loginError: null,
  signupStatus: 'idle',
  signupError: null,
};

function persistAuth(
  user: AuthUser,
  accessToken: string,
  refreshToken: string,
) {
  localStorage.setItem('sm_user', JSON.stringify(user));
  localStorage.setItem('sm_access', accessToken);
  localStorage.setItem('sm_refresh', refreshToken);
}

function persistAccessToken(accessToken: string) {
  localStorage.setItem('sm_access', accessToken);
}

export function clearPersistedAuth() {
  localStorage.removeItem('sm_user');
  localStorage.removeItem('sm_access');
  localStorage.removeItem('sm_refresh');
}

export const loginThunk = createAsyncThunk<
  { user: AuthUser; accessToken: string; refreshToken: string },
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const loginData = await login(email, password);
    const tokens = await getToken(email, password);
    const user: AuthUser = {
      id: loginData._id,
      email: loginData.email,
      username: loginData.username,
    };
    persistAuth(user, tokens.access, tokens.refresh);
    return { user, accessToken: tokens.access, refreshToken: tokens.refresh };
  } catch (err) {
    console.error('Ошибка входа:', err);
    if (err instanceof ApiError) return rejectWithValue(err.message);
    return rejectWithValue('Не удалось выполнить вход');
  }
});

export const signupThunk = createAsyncThunk<
  void,
  { email: string; password: string; username: string },
  { rejectValue: string }
>('auth/signup', async ({ email, password, username }, { rejectWithValue }) => {
  try {
    await signup(email, password, username);
  } catch (err) {
    console.error('Ошибка регистрации:', err);
    if (err instanceof ApiError) return rejectWithValue(err.message);
    return rejectWithValue('Не удалось зарегистрироваться');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateAuth(
      state,
      action: PayloadAction<{
        user: AuthUser;
        accessToken: string;
        refreshToken: string;
      } | null>,
    ) {
      state.authChecked = true;
      if (!action.payload) return;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    // Вызывается функцией обновления токена (withReAuth) после того как
    // по refresh-токену был получен новый access-токен.
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      persistAccessToken(action.payload);
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      clearPersistedAuth();
    },
    resetSignupStatus(state) {
      state.signupStatus = 'idle';
      state.signupError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loginStatus = 'loading';
        state.loginError = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loginStatus = 'idle';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loginStatus = 'failed';
        state.loginError = action.payload ?? 'Не удалось выполнить вход';
      })
      .addCase(signupThunk.pending, (state) => {
        state.signupStatus = 'loading';
        state.signupError = null;
      })
      .addCase(signupThunk.fulfilled, (state) => {
        state.signupStatus = 'succeeded';
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.signupStatus = 'failed';
        state.signupError = action.payload ?? 'Не удалось зарегистрироваться';
      });
  },
});

export const { hydrateAuth, setAccessToken, logout, resetSignupStatus } =
  authSlice.actions;
export default authSlice.reducer;
