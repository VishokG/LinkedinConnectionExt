if(document.readyState === "complete") {
    (async () => {

        //An asynchronous timer (Required to pause within a for loop)
        const sleep = (time) => {
            return new Promise(resolve => setTimeout(resolve, time))
        }
    
        //Check whether button has been clicked in Popup
        const fetchCondition = async () => {
            return await chrome.storage.session.get(["condition"]).then(result => result.condition);
        }
    
        const randomIntFromInterval = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
    
    
        //Capturing the required elements within the Linkedin Search page
        const people = document.getElementsByClassName("reusable-search__entity-result-list list-style-none").item(0);
        const connectButtons_firstClick = people.querySelectorAll("button");
    
    
        //Running the code for the 10 results present on the page
        for(let i = 0; i < 10; i++) {
    
            let condition = await fetchCondition();
            if(condition == "STOPPED") break;
    
            if(connectButtons_firstClick.item(i).innerText === "Connect") {
                let randTime = randomIntFromInterval(5000, 10000);
                await sleep(randTime);

                let condition = await fetchCondition();
                if(condition == "STOPPED") break;
                //Click First Connect button
                connectButtons_firstClick.item(i).click();

                await sleep(500);
                const connectDialogBox = document.getElementById("artdeco-modal-outlet");
                const dialogButtons = connectDialogBox.querySelectorAll("button");
                const finalConnectButton = dialogButtons.item(2);
                await sleep(1000);
                
                condition = await fetchCondition();
                if(condition == "STOPPED") break;
                finalConnectButton.click();
    
                await chrome.runtime.sendMessage({message: "Connection Complete"});
            }
        }
    }) ();
}