//check min and max length of the content
let lengthChecker = (content, min, max) => {
    if (!content) {
        return false; // Return error
    } else {
        if (content.length < min || content.length > max) {
            return false; 
        } else {
            return true; 
        }
    }
};

// check alphabet
let validAlpha = (content) => {
    if (!content) {
        return false; 
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(content); 
    }
};

//check numeric
let validNumeric = (content) => {
    if (!content) {
        return false;
    } else {
        const regExp = new RegExp(/^[0-9]+$/);
        return regExp.test(content);
    }
};

// Validate Function to check if valid e-mail format
let validateEmail = (email) => {
    if (!email) {
        return false; 
    } else {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email); 
    }
};