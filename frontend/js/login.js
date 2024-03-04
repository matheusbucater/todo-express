const emailValidation = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const pwdValidation = (pwd) => {
    const rules = {
        length: 8,
        lowerCase: /[a-z]/,
        upperCase: /[A-Z]/,
        numbers: /[0-9]/,
        symbols: /[^a-zA-Z0-9]/
    };

    const brokenRules = [];

    if (pwd.length < rules.length) {
        brokenRules.push("length");
    }

    if (!pwd.match(rules.lowerCase)) {
        brokenRules.push("lowerCase");
    }

    if (!pwd.match(rules.upperCase)) {
        brokenRules.push("upperCase");
    }

    if (!pwd.match(rules.numbers)) {
        brokenRules.push("numbers");
    }

    if (!pwd.match(rules.symbols)) {
        brokenRules.push("symbols");
    }

    return brokenRules;
}

window.onload = () => {
    const emailInput = document.getElementsByClassName("emailInput")[0]; 
    const emailInfo = document.getElementsByClassName("emailInfo")[0];
    const emailError = document.getElementsByClassName("emailError")[0];

    const pwdInput = document.getElementsByClassName("pwdInput")[0];
    const pwdInfo = document.getElementsByClassName("pwdInfo")[0];
    const pwdError = document.getElementsByClassName("pwdError")[0];

    emailInput.style.width = "email".length + "ch"; 
    pwdInput.style.width = "password".length + "ch";

    emailInput.addEventListener("input", ({target}) => {
        const { value } = target;

        emailError.innerText = "";
        target.style.width = value.length + "ch";

        if (value.trim() != "") {
            emailInfo.innerText = "[enter] to confirm email";
        }

        if (emailValidation(value.trim())) {
            emailInfo.classList.remove("emailInvalid");
            emailInfo.classList.add("emailConfirm");
        }

        if (!emailValidation(value.trim())) {
            emailError.innerText = "invalid email"; 
            emailInfo.classList.remove("emailConfirm");
            emailInfo.classList.add("emailInvalid");
        }
    });

    pwdInput.addEventListener("input", ({target}) => {
        const { value } = target;

        pwdError.innerText = "";
        target.style.width = value.length + "ch";

        if (value.trim() != "") {
            pwdInfo.innerText = "[enter] to confirm password";
        }

        const brokenRules = pwdValidation(value.trim());

        console.log(brokenRules);

        if (brokenRules.length === 0) {
            pwdInfo.classList.remove("pwdInvalid");
            pwdInfo.classList.add("pwdConfirm");
        }

        if (brokenRules.length > 0) {
            pwdInfo.classList.remove("pwdConfirm");
            pwdInfo.classList.add("pwdInvalid");
            pwdError.innerText = "invalid password";
        }

        if (!brokenRules.includes("length")) {
            const lengthRule = document.getElementsByClassName("pwdLength")[0];
            lengthRule.classList.remove("pwdRuleFail");
            lengthRule.classList.add("pwdRulePass");
        }
        if (!brokenRules.includes("lowerCase")) {
            const lowerCaseRule = document.getElementsByClassName("pwdLower")[0];
            lowerCaseRule.classList.remove("pwdRuleFail");
            lowerCaseRule.classList.add("pwdRulePass");
        }
        if (!brokenRules.includes("upperCase")) {
            const upperCaseRule = document.getElementsByClassName("pwdUpper")[0];
            upperCaseRule.classList.remove("pwdRuleFail");
            upperCaseRule.classList.add("pwdRulePass");
        }
        if (!brokenRules.includes("numbers")) {
            const numbersRule = document.getElementsByClassName("pwdNumber")[0];
            numbersRule.classList.remove("pwdRuleFail");
            numbersRule.classList.add("pwdRulePass");
        }
        if (!brokenRules.includes("symbols")) {
            const symbolsRule = document.getElementsByClassName("pwdSymbol")[0];
            symbolsRule.classList.remove("pwdRuleFail");
            symbolsRule.classList.add("pwdRulePass");
        }

        if (brokenRules.includes("length")) {
            const lengthRule = document.getElementsByClassName("pwdLength")[0];
            lengthRule.classList.remove("pwdRulePass");
            lengthRule.classList.add("pwdRuleFail");
        }
        if (brokenRules.includes("lowerCase")) {
            const lowerCaseRule = document.getElementsByClassName("pwdLower")[0];
            lowerCaseRule.classList.remove("pwdRulePass");
            lowerCaseRule.classList.add("pwdRuleFail");
        }
        if (brokenRules.includes("upperCase")) {
            const upperCaseRule = document.getElementsByClassName("pwdUpper")[0];
            upperCaseRule.classList.remove("pwdRulePass");
            upperCaseRule.classList.add("pwdRuleFail");
        }
        if (brokenRules.includes("numbers")) {
            const numbersRule = document.getElementsByClassName("pwdNumber")[0];
            numbersRule.classList.remove("pwdRulePass");
            numbersRule.classList.add("pwdRuleFail");
        }
        if (brokenRules.includes("symbols")) {
            const symbolsRule = document.getElementsByClassName("pwdSymbol")[0];
            symbolsRule.classList.remove("pwdRulePass");
            symbolsRule.classList.add("pwdRuleFail");
        }   

    });

    emailInput.addEventListener("blur", ({target}) => {
        if (target.value.trim() === "") {
            target.value = "email";
            document.getElementsByClassName("emailError")[0].innerText = "";
        }
        target.style.width = target.value.length + "ch";
        emailInfo.innerText = "";
    })

    emailInput.addEventListener("keypress", ({key, target}) => {
        if (key === "Enter" && emailValidation(target.value.trim())) {
            target.blur();
            document.getElementsByClassName("pwdInput")[0].focus();
        }
    });
}
