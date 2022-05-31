const URL = "https://apex.savegnago.com.br"

chrome.tabs.onUpdated.addListener(async (_, __, tab) => {
  if (!tab.url.includes(URL)) return;

  const storage = await chrome.storage.local.get(["loginAttempt", "logins"])
  
  if (!storage?.loginAttempt) return;

  const {user, password} = storage.loginAttempt

  if (tab.title === "Menu" && tab.status === "complete") {
    chrome.storage.local.set({loginAttempt: null})
    if (storage.logins.some(login => login.user === user)) return;
    storage.logins.push({user, password})
    chrome.storage.local.set({logins: storage.logins})
    return
  }

  if (tab.status === "complete") {
    const indexToRemove = storage.logins.findIndex(login => login.user === user)
    if (indexToRemove !== -1) storage.logins.splice(indexToRemove, 1)
    chrome.storage.local.set({logins: storage.logins})
    chrome.storage.local.set({loginAttempt: null})
  }
})