import moment from 'moment';
const loginexpire = () => {
    let currentday = moment().format('YYYY-MM-DD');
    let logintime = localStorage.getItem('VUElogintime');
    if (moment(logintime).isBefore(currentday)) {
        logout();
    }
    return true;
}
const loginCheck = () => {
    if(localStorage.VUEislogin){
        loginexpire();
    }
    return localStorage.getItem('VUEislogin');
}
const getUserid = () => {
    return localStorage.getItem('VUEuserId');
}
const getUserData = () => {
    return JSON.parse(localStorage.getItem('VUEuserdata'));
}

const logout = async () => {
    //await localStorage.clear();
    await localStorage.setItem('VUElogintime', '');
    await localStorage.setItem('VUEislogin','');
    await localStorage.setItem('VUEtoken', '');
    await localStorage.setItem('VUEuserId', '');
    await localStorage.setItem('VUEuserdata', '');
    await window.location.reload(false);
    return true;
}

const Service = { getUserid,loginCheck,getUserData,logout };
export default Service;