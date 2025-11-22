// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// DOM Elements
const displayRemoteSetupFrame = document.getElementById("display-remote-setup")
const screenDarken = document.querySelector(".screen-darken")
const displayIdHint = document.getElementById("display-id-hint")
const displayIdInput = document.getElementById("display-id-input");
const startButton = document.getElementById("start-button");
const cancelButton = document.getElementById("cancel-button");
const errorMsg = document.getElementById("error-msg");
const loginLink = document.getElementById("login-link");
const imageElement = document.querySelector("#image img");
const promptCloseTimer = document.getElementById("prompt-close-timer")
const saveIdCheckbox = document.getElementById("save-id")

// State
let user = null;
let connectedDisplayId = null;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var stopPromptCloseCountdown = false

// Enable Start button when input has text
displayIdInput.addEventListener("input", () => {
    startButton.disabled = displayIdInput.value.trim() === "";
});

displayIdInput.addEventListener("focus", function() {
    stopPromptCloseCountdown = true
    promptCloseTimer.style.display = "none"
})

// Handle authentication state
onAuthStateChanged(auth, (currentUser) => {
    user = currentUser;
    if (user) {
        errorMsg.style.display = "none";
        loginLink.style.display = "none";
        setupDisplay()
    } else {
        errorMsg.style.display = "block";
        loginLink.style.display = "inline";
    }
});

// Start display setup
startButton.addEventListener("click", async () => {
    const displayId = displayIdInput.value.trim();
    if (!user || !displayId) {
        alert("You must log in and enter a valid ID.");
        return;
    }

    if (displayId.length > 16) {
        alert("ID must be less than 16 characters")
        return;
    }

    const displayRef = ref(db, `displays/${user.uid}/${displayId}`);

    try {
        const snapshot = await get(displayRef);

        if (snapshot.exists()) {
            alert("This display ID already exists. Please choose another.");
            return;
        }

        // Create a new display entry in Firebase
        await set(displayRef, {
            owner: user.uid,
            image: "../../../img/slideshow-images/ECC Placeholder.png",
            showDefault: true
        });

        if (saveIdCheckbox.checked) {
            localStorage.setItem("remote_display_id", displayId)
        } else {
            localStorage.removeItem("remote_display_id")
        }

        connectedDisplayId = displayId;
        monitorDisplay(displayRef);
        alert(`Display remote setup complete! Display ID: ${displayId}`);
        displayRemoteSetupFrame.style.display = "none";
        screenDarken.style.display = "none"
        displayIdHint.innerText = displayId
    } catch (error) {
        console.error("Error setting up display:", error);
        alert("Failed to set up display. Please try again.");
    }
});

// Cancel display setup
cancelButton.addEventListener("click", () => {
    displayIdInput.value = "";
    startButton.disabled = true;
    displayRemoteSetupFrame.style.display = "none"
    screenDarken.style.display = "none"
    stopPromptCloseCountdown = true
});

var previousReloadUUID = ""
var firstTimeLoad = true

// Monitor display for updates
function monitorDisplay(displayRef) {
    onValue(displayRef, (snapshot) => {
        const data = snapshot.val();

        if (!data) {
            console.error("No data found for display.");
            return;
        }

        const { image, showDefault, reload } = data;

        if (reload != previousReloadUUID && !firstTimeLoad) {
            window.location.reload()
        } else {
            previousReloadUUID = reload
            firstTimeLoad = false
        }

        // Display the appropriate image
        if (showDefault) {
            imageElement.src = "../../../img/slideshow-images/ECC Placeholder.png";
        } else {
            imageElement.src = image || "../../../img/slideshow-images/ECC Placeholder.png";
        }
    });
}

/* DISPLAY RELOAD ID CHECKER */

async function setupDisplay() {
    try {
        let displayId = localStorage.getItem("remote_display_id");
        if (displayId) {
            let time = 20;

            for (let i = time; i > 0; i--) {
                if (stopPromptCloseCountdown) {
                    return;
                }
                promptCloseTimer.innerText = `This prompt will close in ${i} seconds`;
                console.log("Ran Loop")
                await sleep(1000)
            }

            const displayRef = ref(db, `displays/${user.uid}/${displayId}`);
            const snapshot = await get(displayRef);

            if (snapshot.exists()) {
                connectedDisplayId = displayId;
                monitorDisplay(displayRef);
                console.log(`Display remote setup complete! Display ID: ${displayId}`);
            }
            displayRemoteSetupFrame.style.display = "none";
            screenDarken.style.display = "none";
            displayIdHint.innerText = displayId;
        }
    } catch (error) {
        console.error("Error setting up display after reload:", error);
    }
}