import { getCurrentTab, getCurrentState, setCurrentState, 
updateButtonStyle, updatePopupCounter, injectContentScript } from "./utils.js";

import { STOPPED } from "./constants.js";

//Gives access to Chrome Extension storage. Using this to maintain and detect change in state
//(TRUSTED_AND_UNTRUSTED_CONTEXTS level allows access to storage via content scripts)
chrome.storage.session.setAccessLevel({accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS"});


//Sets initial state to STOPPED
const initialState = { condition: STOPPED}
setCurrentState(initialState);



//EVENT LISTENERS
//This listener waits for a message from the content script to change the counter on the popup
chrome.runtime.onMessage.addListener(updatePopupCounter);



//This listener waits for a click on button to initate sending connections
document.getElementById("connectButton").addEventListener("click", async () => {
	const state = await getCurrentState();
	if(state.condition === STOPPED) {
		updateButtonStyle(0);
	} else {
		updateButtonStyle(1);
	}
    getCurrentTab().then(async (tab) => {
        await injectContentScript(tab);
    });
});