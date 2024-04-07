import React from "react";
import CreateAccountPage from './../loginPage/createAccountPage/CreateAccountPage';
import './accountManage.css';

function AccountManage(){

    return(
        <>
        <div >
        <CreateAccountPage isUpdateAccount={true}></CreateAccountPage>
        </div>
        </>
    );
}

export default AccountManage;