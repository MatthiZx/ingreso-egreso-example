import * as fromUI from '../shared/ui.reducer';
import { ActionReducerMap } from '@ngrx/store';

import * as fromAuth from '../auth/auth.reducer';

export interface AppState{
    ui: fromUI.State;
    auth: fromAuth.AuthState;
}

export const appReducers: ActionReducerMap<AppState> = {
    ui: fromUI.uiRaducer,
    auth: fromAuth.authReducer    
}