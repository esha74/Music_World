import { Routes } from '@angular/router';
import { Addform } from './componenent/addform/addform';
import { Editform } from './componenent/editform/editform';
import { Listdata } from './componenent/listdata/listdata';
import { Login } from './componenent/login/login';
import { Register } from './componenent/register/register';
import { Home } from './componenent/home/home';
import { Userlist } from './componenent/userlist/userlist';
import { AuthGuard } from './auth-guard';
import { AccessDeniedComponent } from './componenent/access-denied-component/access-denied-component';
import { Subscription } from './componenent/subscription/subscription';
import { VerifyEmail } from './componenent/verify-email/verify-email';
import { ForgotPassword } from './componenent/forgot-password/forgot-password';
import { ResetPassword } from './componenent/reset-password/reset-password';
import { EditProfile } from './componenent/edit-profile/edit-profile';
import { SetPassword } from './componenent/set-password/set-password';
import { Adduserform } from './componenent/adduserform/adduserform';
import { ChangePassword } from './componenent/change-password/change-password';
import { Activitylog } from './componenent/activitylog/activitylog';



export const routes: Routes = [

    {
        path: 'home', component: Home,
    }, {
        path: 'users', component: Userlist, canActivate: [AuthGuard]

    },
    {
        path: 'edit-profile/:id',
        component: EditProfile,
    },
    { path: 'add-user', component: Adduserform },
    { path: 'set-password', component: SetPassword }
    ,
    {
        path: 'verify-email', component: VerifyEmail  // Add this for OTP verification
    },
    {
        path: 'forgot-password', component: ForgotPassword

    },
    {
        path: 'reset-password', component: ResetPassword
    },
    {
        path: 'change-password',
        component: ChangePassword,
    }
    , {
        path: 'activity-log', component: Activitylog

    },
    {
        path: 'add', component: Addform, canActivate: [AuthGuard]
    },
    {
        path: 'edit/:id', component: Editform, canActivate: [AuthGuard]
    },
    {
        path: 'list', component: Listdata,

    },
    {
        path: 'login', component: Login
    },
    {
        path: 'register', component: Register
    }, {
        path: 'subscribe', component: Subscription

    },
    {
        path: '', redirectTo: '/login', pathMatch: 'full'
    },
    { path: '**', component: AccessDeniedComponent }

];
