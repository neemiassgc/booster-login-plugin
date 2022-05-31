const usernameField = document.querySelector("#P101_USERNAME");
const passwordField = document.querySelector("#P101_PASSWORD");
const loginButton = document.querySelector("#P101_LOGIN");


function storeLogin() {
    const {value: user} = usernameField
    const {value: password} = passwordField
    chrome.storage.local.set({loginAttempt: {user: user.toLowerCase(), password}})
}

function main() {
    usernameField.onkeyup = async ({target: {value}}) => {
        if (value.length >= 3) {
            const storage = await chrome.storage.local.get("logins")
            const filteredLogins = storage.logins.filter(({user}) => user.startsWith(value.toLowerCase()))

            if (filteredLogins.length === 1) {
                const {user, password} = filteredLogins[0]
                usernameField.value = user.toUpperCase();
                passwordField.value = password;
                storeLogin();
                loginButton.click();
            }
        }
    }

    usernameField.onchange = async ({target: {value}}) => {
        const storage = await chrome.storage.local.get("logins")
        const actualLogin = storage.logins.find(({user}) => user === value.toLowerCase())
        if (actualLogin) {
            passwordField.value = password;
            storeLogin();
            loginButton.click();
        }
    }

    loginButton.addEventListener("click", storeLogin)

    passwordField.onkeyup = ({key, code}) => {
        if (key === "Enter" || code === "Enter") storeLogin();
    }
}

main()