import { setCookie } from "./cookie.js";
import { login } from "./handlers.js";

const emailValidation = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
//
// const pwdValidation = (pwd) => {
//     const rules = {
//         length: 8,
//         lowerCase: /[a-z]/,
//         upperCase: /[A-Z]/,
//         numbers: /[0-9]/,
//         symbols: /[^a-zA-Z0-9]/
//     };
//
//     return {
//         "pwdLength": pwd.length >= rules.length,
//         "pwdLower": rules.lowerCase.test(pwd),
//         "pwdUpper": rules.upperCase.test(pwd),
//         "pwdNumber": rules.numbers.test(pwd),
//         "pwdSymbol": rules.symbols.test(pwd)
//     };
// }
//
window.onload = () => {
    const emailInput = document.getElementsByClassName("emailInput")[0]; 
    const emailInfo = document.getElementsByClassName("emailInfo")[0];
    const emailError = document.getElementsByClassName("emailError")[0];

    const pwdInput = document.getElementsByClassName("pwdInput")[0];
    const pwdInfo = document.getElementsByClassName("pwdInfo")[0];
    const pwdError = document.getElementsByClassName("pwdError")[0];

    if (emailInput.value.trim() != "") {
        emailInput.style.width = emailInput.value.length + "ch";
    }

    if (pwdInput.value.trim() != "") {
        pwdInput.style.width = pwdInput.value.length + "ch";
    }

    emailInput.focus();

    emailInput.addEventListener("focus", ({target}) => {
        emailInput.style.width = target.value.length + "ch";
    })

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

        if (value.trim() != "" || value.trim().length >= 8) {
            pwdInfo.innerText = "[enter] to confirm password";
        } else {
            pwdInfo.innerText = "";
        }

        // const rules = pwdValidation(value.trim());
        // const anyRuleFails = Object.values(rules).some((rule) => !rule);
        //
        // if (anyRuleFails) {
        //     pwdInfo.classList.remove("pwdConfirm");
        //     pwdInfo.classList.add("pwdInvalid");
        //     pwdError.innerText = "invalid password";
        // } else {
        //     pwdInfo.classList.remove("pwdInvalid");
        //     pwdInfo.classList.add("pwdConfirm");
        // }
        //
        // for (const [rule, rulePass] of Object.entries(rules)) {
        //     const ruleElement = document.getElementsByClassName(`${rule}`)[0];
        //     if (rulePass) {
        //         ruleElement.classList.remove("pwdRuleFail");
        //         ruleElement.classList.add("pwdRulePass");
        //     } else {
        //         ruleElement.classList.remove("pwdRulePass");
        //         ruleElement.classList.add("pwdRuleFail");
        //     }
        // }
    });

    emailInput.addEventListener("blur", ({target}) => {
        if (target.value.trim() === "") {
            document.getElementsByClassName("emailError")[0].innerText = "";
            target.style.width = "email".length + "ch";
        } else {
            target.style.width = target.value.length + "ch";
        }
        emailInfo.innerText = "";
    })

    pwdInput.addEventListener("blur", ({target}) => {
        if (target.value.trim() === "") {
            document.getElementsByClassName("pwdError")[0].innerText = "";
            target.style.width = "password".length + "ch";
        } else {
            target.style.width = target.value.length + "ch";
        }
        pwdInfo.innerText = "";
    })

    emailInput.addEventListener("keypress", ({key, target}) => {
        if (key === "Enter" && emailValidation(target.value.trim())) {
            target.blur();
            document.getElementsByClassName("pwdInput")[0].focus();
        }
    });

    pwdInput.addEventListener("keypress", async ({key, target}) => {
        if (key === "Enter") {
            if (target.value.trim() === "") {
               pwdError.innerText = "password required"; 
            } else {
                const response = await login({ email: emailInput.value.trim(), password: pwdInput.value.trim() });
                if (response.status === 400) {
                    pwdError.innerText = "invalid email or password";
                    target.blur();
                }
                if (response.status === 201) {
                    setCookie("token", response.headers.get("X-Access-Token"), 1);
                    window.location.href = "./index.html";
                }
            }
        }
    });
}
