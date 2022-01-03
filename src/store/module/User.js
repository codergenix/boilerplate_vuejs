import axios from 'axios';
import CONFIG from '../../utils/config';
import Service from '../../utils/Service';
import moment from 'moment';

const state = {
    users: [],
    current:{},
    isSuccess: false,
    isUpdate: false,
    isDelete: false,
    isAdded: false,
    isFileAdded: false,
    isFileDelete: false,
    isError: false,
    isMessge: '',
    isModalvisible:false,
};

const getters = {
    alluser: (state) => {
        return state.users
    },
    getUserMessage:(state) => {
        return state.isMessge
    },
    getUserCurrent:(state) => {
        return state.current
    },
    getUserModalvisible:(state) => {
        return state.isModalvisible
    },
};

const actions = {
    async getUser({ commit }) {
        try {
            const response = await axios({
                method: 'GET',
                url: `${CONFIG.API_ENDPOINT}user`,
                headers: CONFIG.API_HEADER.headers
            });
            console.log('getUser axios.post >>', response);
            if (response.data.success) {
                commit('setUser', response.data.result);
            }
            else if (response.data.success == false) {
                state.isError = true;
                state.isMessge = `${response.data.error}`;
            }
        }
        catch (error) {
            state.isError = true;
            state.isMessge = `Actions [getUser] try-catch ${error}`;
        }
    },
    async addUser({ commit }, AddData) {
        try {
            AddData.CreatedBy = Service.getUserid();
            const response = await axios({
                method: 'POST',
                url: `${CONFIG.API_ENDPOINT}user/create`,
                data: AddData,
                headers: CONFIG.API_HEADER.headers
            });
            console.log('addUser axios.post >>', response);
            if (response.data.success) {
                commit('setAddUser', response.data.result);
            }
            else if (response.data.success == false) {
                state.isError = true;
                state.isMessge = `${response.data.error}`;
            }
        }
        catch (error) {
            state.isError = true;
            state.isMessge = `Actions [addUser] try-catch : ${error}`;
        }
    },
    async updateUser({ commit }, updatedata) {
        try {
            updatedata.UpdatedBy = Service.getUserid();
            const response = await axios({
                method: 'PUT',
                url: `${CONFIG.API_ENDPOINT}user/update`,
                data: updatedata,
                headers: CONFIG.API_HEADER.headers
            });
            console.log('updateUser axios.post >>', response);
            if (response.data.success) {
                commit('setUpdateUser', response.data.result);
            }
            else if (response.data.success == false) {
                state.isError = true;
                state.isMessge = `${response.data.error}`;
            }
        }
        catch (error) {
            state.isError = true;
            state.isMessge = `Actions [updateUser] try-catch : ${error}`;
        }
    },
    async deleteUser({ commit }, deletedata) {
        try {
            let deleteItem = {
                'id': deletedata.id,
                'UpdatedBy': Service.getUserid()
            }
            const response = await axios({
                method: 'DELETE',
                url: `${CONFIG.API_ENDPOINT}user/delete`,
                data: deleteItem,
                headers: CONFIG.API_HEADER.headers
            });
            console.log('deleteUser axios.post >>', response);
            if (response.data.success) {
                commit('setDeleteUser', deletedata);
            }
            else if (response.data.success == false) {
                state.isError = true;
                state.isMessge = `${response.data.error}`;
            }
        }
        catch (error) {
            state.isError = true;
            state.isMessge = `Actions [deleteUser] try-catch ${error}`;
        }
    },
    async addFileUser({ commit }, AddData) {
        try {
            const response = await axios({
                method: 'POST',
                url: `${CONFIG.API_ENDPOINT}userfiles/create`,
                data: AddData,
                headers: CONFIG.API_HEADER.headers
            });
            console.log('addFileUser axios.post >>', response);
            if (response.data.success) {
                commit('setaddFileUser', response.data.result);
            }
            else if (response.data.success == false) {
                state.isError = true;
                state.isMessge = `${response.data.error}`;
            }
        }
        catch (error) {
            state.isError = true;
            state.isMessge = `Actions [addFileUser] try-catch : ${error}`;
        }
    },
    async deleteFileUser({ commit }, deleteData) {
        try {
            let newdeletedata={
                "FileGUID": deleteData.FileGUID,
                "UpdatedBy": Service.getUserid()
            }
            const response = await axios({
                method: 'DELETE',
                url: `${CONFIG.API_ENDPOINT}userfiles`,
                data: newdeletedata,
                headers: CONFIG.API_HEADER.headers
            });
            console.log('deleteFileUser axios.post >>', response);
            if (response.data.success) {
                commit('setdeleteFileUser', deleteData);
            }
            else if (response.data.success == false) {
                state.isError = true;
                state.isMessge = `${response.data.error}`;
            }
        }
        catch (error) {
            state.isError = true;
            state.isMessge = `Actions [deleteFileUser] try-catch : ${error}`;
        }
    },
};

const mutations = {
    setUser(state, payload) {
        try {
            state.users = payload;
        }
        catch (error) {
            state.isError = true;
            state.isMessge = `Mutation [setUser] try-catch  ${error}`;
        }
    },
    setUpdateUser(state, payload) {
        try {
            let index = state.users.findIndex((opt) => opt.id == payload.id);
            if (index >=0) {
                state.users[index] = payload;
                state.isUpdate = true;
                state.isMessge = `User successfully updated`;
            }
        }
        catch (error) {
            state.isUpdate = false;
            state.isError = true;
            state.isMessge = `Mutation [setUpdateUser] try-catch ${error}`;
        }
    },
    setDeleteUser(state, payload) {
        try {
            let index = state.users.findIndex((opt) => opt.id == payload.id);
            if (index >=0) {
                state.users[index] = payload.result;
                state.users.splice(index, 1);
                state.isDelete = true;
                state.isMessge = `User successfully Deleted`;
            }
        }
        catch (error) {
            state.isDelete = false;
            state.isError = true;
            state.isMessge = `Mutation [setDeleteUser] try-catch  ${error}`;
        }
    },
    setAddUser(state, payload) {
        try {
            state.current = payload;
            state.users.push(payload);
            state.isAdded = true;
            state.isMessge = 'User successfully Added';
        }
        catch (error) {
            state.isAdded = false;
            state.isError = true;
            state.isMessge = `Mutation [setAddUser] try-catch ${error}`;
        }
    },
    setaddFileUser(state, payload) {
        try {
            let index = state.users.findIndex((opt) => opt.id == state.current.id);
            state.users[index].UserFiles.push(payload.result);
            state.isFileAdded = true;
            state.isMessge = 'UserFiles successfully Added';
        }
        catch (error){
            state.isFileAdded = false;
            state.isError = true;
            state.isMessge = `Mutation [setaddFileUser] try-catch ${error}`;
        }
    },
    setdeleteFileUser(state, payload) {
        try {
            let index = state.users.findIndex((opt) => opt.id == state.current.id);
            if (index >=0) {
                let newuserFile = state.current.UserFiles.filter((opt) => opt.FileGUID !== payload.FileGUID)
                state.current.UserFiles=newuserFile;
                state.users[index] = state.current;
                state.isFileDelete = true;
                state.isMessge = `UserFiles successfully Deleted`;
            }
        }
        catch (error) {
            state.isFileDelete = false;
            state.isError = true;
            state.isMessge = `Mutation [setdeleteFileUser] try-catch  ${error}`;
        }
    },
    //=======================
    setUserModalvisible: (state, payload) => {
        try {
            state.isModalvisible = payload ? payload : false;
        }
        catch (error) {
            state.isError = true;
            state.isMessge = `Mutation [setUserModalvisible] try-catch  ${error}`;
        }
    },
    setUserCurrent: (state, payload) => {
        try {
            state.current = payload ? payload : {};
        } catch (error) {
            state.isError = true;
            state.isMessge = `Mutation [setUserCurrent] try-catch  ${error}`;
        }
    },
    setUserStateReset: (state) => {
        try {
            state.users = [];
            state.current = {};
            state.isSuccess = false;
            state.isAdded = false;
            state.isUpdate = false;
            state.isDelete = false;
            state.isFileAdded = false;
            state.isFileDelete = false;
            state.isError = false;
            state.isMessge = '';
        } catch (error) {
            state.isError = true;
            state.isMessge = `Mutation [setUserStateReset] try-catch  ${error}`;
        }
    }, 
    setUserStateClear: (state, payload) => {
        try {
            state.isSuccess = payload ? payload.isSuccess : false;
            state.isAdded = payload ? payload.isAdded : false;
            state.isUpdate = payload ? payload.isUpdate : false;
            state.isDelete = payload ? payload.isDelete : false;
            state.isError = payload ? payload.error : false;
            state.isFileAdded = payload ? payload.isFileAdded : false;
            state.isFileDelete = payload ? payload.isFileDelete : false;
            state.isModalvisible = payload ? payload.isModalvisible : false;
            state.isMessge = payload ? payload.isMessge : '';
        } catch (error) {
            state.isError = true;
            state.isMessge = `Mutation [setUserStateClear] try-catch  ${error}`;
        }
    },
};

export const User = {
    state,
    getters,
    actions,
    mutations
};
