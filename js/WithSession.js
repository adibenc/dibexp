import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BaseService from "../../services/BaseService";
import { singletonData } from "../../util/singleton";
import { cl } from "../../util/util";

// with session high order component @adib-enc
export default function WithSession(props) {
    const { triggerClasses, triggerText, children } = props
    const { session } = useSelector((store) => store);
    const dispatch = useDispatch();

    function setup(){
        // cl("session")
        singletonData.setSession(session);
        BaseService.accessToken = session.token
    }

    // handle redir 2 login if unauthorized
    useEffect(() => {
        setup()
        
        return () => {
        };
    });

    // const comp = <WrappedComponent session={session} dispatch={ (e) => {return dispatch(e)} } />;
    
    if(session.token){
        children.props = props

        if(props.rule){
            return ("ok")
        }else{
            return ({children});
        }
    }else{
        if(window.location.pathname != "/login"){
            window.location.href = "/login"
            return 
        }
    }
}
