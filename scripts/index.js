const validateUsername = username => {
    if(username.length < 8) {
        
        document.getElementById("username").value = "";
        document.getElementById("invalid-username").style.visibility = "visible";
        return false;
    }
    username = username.toLowerCase();
    
    for(let i=0 ; i<username.length ; i++){
        if((username[i]>='a' && username[i]<='z') || (username[i]>='0' && username[i]<='9') || username[i] === '_'){
            continue;
        }
        else{
            document.getElementById("username").value = "";
            document.getElementById("invalid-username").style.visibility = "visible";
            return false;
        }
    }
    document.getElementById("invalid-username").style.visibility = "hidden";
    return true;
}

const validatePassword = password => {
    if(password.length < 8) {
        document.getElementById("password").value = "";
        document.getElementById("invalid-password").style.visibility = "visible";
        return false;
    }

    // for(let i=0 ; i<password.length ; i++){
    //     if((password[i]>='a' && password[i]<='z') || (password[i]>='0' && password[i]<='9') || password[i] === '_'){
    //         continue;
    //     }
    //     else{
    //         document.getElementById("password").value = "";
    //         document.getElementById("invalid-password").style.visibility = "visible";
    //         return false;
    //     }
    // }

    document.getElementById("invalid-password").style.visibility = "hidden";
    return true;
}

const validate = () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    

    // validateUsername(username);
    // validatePassword(password);

    const validU = validateUsername(username) 
    const validP = validatePassword(password);

    if(validU && validP) {
        alert("Registration Successfull....");
        return true;
    }
    return false;

}

const changeTheme = () => {
    const root = document.querySelector(':root');
    const styles = getComputedStyle(document.body)


    const bg = styles.getPropertyValue('--font-color');
    const font = styles.getPropertyValue('--bg-color');
    root.style.setProperty('--bg-color', bg)
    root.style.setProperty('--font-color', font)
}