import { createStore } from 'vuex';
// ---
import auth from '@/store/auth.module';
import profile from './profile.module';
import users from './users.module';
// -----
export default createStore({
  modules: {
    auth,
    users,
    profile,
  },
  strict: true,
});
