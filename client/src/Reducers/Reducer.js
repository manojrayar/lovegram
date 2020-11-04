export const initialState=null;

export const UserReducer=(state,action)=>{
    
    if(action.type==="USER"){
        return action.payload
    }
    if(action.type==="CLEAR"){
        return null
    }
    if(action.type==="UPDATE"){
        return action.payload
    }
    if(action.type==="PROFILE"){
        return action.payload
    }
    return state
    
}