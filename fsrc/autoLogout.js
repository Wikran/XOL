// =======================
// autoLogout.js
// =======================

// Read configuration from <script> tag attributes
const scriptTag = document.currentScript;

const logoutMinutes = parseInt(scriptTag.getAttribute("data-logout-time")) || 20;   // default 20 min
const warningMinutes = parseInt(scriptTag.getAttribute("data-warning-time")) || 1; // default 1 min

// Convert to milliseconds
const logoutTime = logoutMinutes * 60 * 1000;
const warningTime = warningMinutes * 60 * 1000;

let lastActivity = Date.now();
let checkInterval;
let warningShown = false;

// ====== FUNCTIONS ======
function updateActivity() {
    lastActivity = Date.now();
    warningShown = false; // reset warning state if user is active again
}

function checkInactivity() {
    const now = Date.now();
    const inactiveTime = now - lastActivity;

    // Show warning if close to logout
    if (!warningShown && inactiveTime >= (logoutTime - warningTime) && inactiveTime < logoutTime) {
        warningShown = true;
        showWarningDialog();
    }

    // Logout if exceeded
    if (inactiveTime >= logoutTime) {
        logoutUser();
    }
}

function showWarningDialog() {
    DevExpress.ui.dialog.alert(
        `You will be logged out in ${warningMinutes} minute(s) due to inactivity. Please move your mouse or press a key to stay signed in.`,
        "Session Timeout Warning"
    );
}

function logoutUser() {
    DevExpress.ui.dialog.alert(
        "Session expired due to inactivity. Logging out...",
        "Session Ended"
    ).done(function () {
        localStorage.removeItem("userSession"); // Clear session if needed
        window.location.href = "index.html";    // Redirect to login page
    });
}

// ====== EVENT LISTENERS ======
// Only track mouse + keyboard activity
$(document).on("mousemove keydown", updateActivity);

// If you want to also track inside iframes:
$(document).on("load", "iframe", function () {
    $(this).contents().on("mousemove keydown", updateActivity);
});

// ====== START MONITORING ======
updateActivity(); // initialize
checkInterval = setInterval(checkInactivity, 30 * 1000); // check every 30s


// Old Version
// let logoutTimer;
// const logoutTime = 30 * 60 * 1000; // 30 minutes

// function resetLogoutTimer() {
//     clearTimeout(logoutTimer); // Clear previous timer
//     logoutTimer = setTimeout(logoutUser, logoutTime); // Start new timer
// }

// function logoutUser() {
//     alert("Session expired due to inactivity. Logging out...");
//     localStorage.removeItem("userSession"); // Clear session if needed
//     window.location.href = "index.html"; // Redirect to login page
// }

// // Detect user activity in the **main page**
// $(document).on("mousemove keydown click", resetLogoutTimer);

// // Detect user activity **inside any iframe**
// $(document).on("load", "iframe", function () {
//     $(this).contents().on("mousemove keydown click", resetLogoutTimer);
// });

// // Start the timer initially
// resetLogoutTimer();

