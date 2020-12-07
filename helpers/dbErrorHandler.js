"use strict";

const uniqueMessage = error => {
    let output;
    console.log("ERROR::::::", error.message);

    try {
        let fieldName = error.message.substring(
            error.message.lastIndexOf(".$") + 2,
            error.message.lastIndexOf("_1")
        );
        console.log("fieldName:::::", fieldName);
        output = fieldName.charAt(0).toUpperCase() +
            fieldName.slice(1) + " ya existe";
    } catch (ex) {
        output = "Campo único ya existe";
    }

    return output;
};

exports.errorHandler = error => {
    let message = "";

    if (error.code) {
        switch (error.code) {
            case 11000:
            case 11001:
                message = uniqueMessage(error);
                break;
            default:
                message = "Algo ha ido mal";
        }
    } else {
        for (let errorName in error.errorors) {
            if (error.errorors[errorName].message) message = error.errorors[errorName].message;
        }
    }
    return message;
};