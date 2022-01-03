import axios from 'axios';
import CONFIG from '../../utils/config';
import moment from 'moment';
const state = {
    loginUser: [],
    isLogin: false,
    isError: false,
    isMessge:''
};
const getters = {
    getLoginMessage:(state) => {
        return state.isMessge
    },
};
const actions = {
    async checklogin({ commit }, payload) {
        try {
            const response = await axios({
                method: 'POST',
                url: `${CONFIG.API_ENDPOINT}login`,
                data: payload,
            });
            console.log('checklogin axios.post >>', response);
            if (response.data.success) {
                commit('setlogin', response.data);
            }
            else if (response.data.success == false) {
                state.isLogin = false;
                state.isError = true;
                state.isMessge = `${response.data.error}`;
            }
        }
        catch (error) {
            state.isLogin = false;
            state.isError = true;
            state.isMessge = `actions [checklogin] try-catch  ${error}`;
        }
    }
};

const mutations = {
    setlogin(state, payload) {
        try {
            state.loginUser = payload;
            state.isLogin = true;
            state.isMessge = `login is Successfully`;
            localStorage.setItem('VUElogintime', moment().format('YYYY-MM-DD'));
            localStorage.setItem('VUEislogin', true);
            localStorage.setItem('VUEtoken', payload.token);
            localStorage.setItem('VUEuserId', payload.result.id);
            localStorage.setItem('VUEuserdata', JSON.stringify(payload.result));
        }
        catch (error) {
            state.isLogin = false;
            state.isError = true;
            state.isMessge = `Mutation [setlogin] try-catch ${error}`;
        }
    },
    setLoginStateClear: (state, payload) => {
        state.isLogin = payload ? payload.isLogin : false;
        state.isError = payload ? payload.error : false;
        state.isMessge = payload ? payload.isMessge : '';
    },
};

export const Login = {
    state,
    getters,
    actions,
    mutations
};