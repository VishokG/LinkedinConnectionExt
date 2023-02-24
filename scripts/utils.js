import { STOPPED, STARTED, RED, GREEN, STOP_CONNECTING, START_CONNECTING, LINKEDIN_URL_1, LINKEDIN_URL_2 } from "./constants.js";

//Fetch currently opened tab in Google Chrome
export const getCurrentTab = async () => {
    let queryOptions = {
        active: true,
        windowId: chrome.windows.WINDOW_ID_CURRENT,
    };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
};

//Fetch current state from session storage
export const getCurrentState = async () => {
	return await chrome.storage.session.get(["condition"]).then(result => result);
}

//Change state
export const setCurrentState = async (obj) => {
	await chrome.storage.session.set(obj).then(() => {
		console.log("Value is set to " + obj);
	});
}

//Change the style of the button when the connection cycle is started or stopped
export const updateButtonStyle = (action) => {
	let text = STOP_CONNECTING;
	let color = RED;
	if(action == 1) {
		text = START_CONNECTING;
		color = GREEN;
	}

	document.getElementById("connectButton").innerText = text
	document.getElementById("connectButton").style.backgroundColor = color;
}

//Update the counter of number of connections sent
export const updatePopupCounter = () => {
	const currConnections = document.querySelector(".inside-circle").innerText;
	document.querySelector(".inside-circle").innerText = ("" + (Number(currConnections) + 1));
	document.querySelector(".circle .fill").style.transform = `rotate(${(Number(currConnections) + 1)*4}deg)`
}

//Content script which has code to be run on the Linkedin tab
const runScript = (id) => {
	chrome.scripting.executeScript({
		target: { tabId: id },
		files: ["scripts/content.js"],
	});
}

//Injects the content script on the present Linkedin page
//1. Checks whether PRESENT Tab Has Valid URL
//2. Depending on current state Either injects code or not
export const injectContentScript = async (tab) => {
    const { id, url } = tab;
    if (url.indexOf(LINKEDIN_URL_1) > -1 || url.indexOf(LINKEDIN_URL_2) > -1) {
		const currState = await getCurrentState();
		console.log(currState.condition);
        if (currState.condition === STOPPED) {
			await setCurrentState({condition: STARTED})
			runScript(id);
        } else {
			await setCurrentState({ condition: STOPPED});
		}

        console.log(`Loading: ${url}`);
    }
};