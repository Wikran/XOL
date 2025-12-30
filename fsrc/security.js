(function () {
    let loggedOut = false; // Prevent multiple logouts

    function logoutUser() {
        if (loggedOut) return; // Stop execution if already logged out

        alert("DevTools detected! Logging out...");

        // Clear storage
        localStorage.clear();
        sessionStorage.clear();

        // Clear cookies
        document.cookie.split(";").forEach(function (c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        loggedOut = true; // Prevent multiple triggers

        // Logout and redirect parent if in iframe
        if (window.parent) {
            window.parent.location.href = "about:blank";
        } else {
            window.location.href = "about:blank";
        }
    }

    // ** Detect Right-Click + "Inspect" **
    document.addEventListener("contextmenu", function (event) {
        let previousTime = performance.now();

        setTimeout(() => {
            let newTime = performance.now();
            if (newTime - previousTime > 300) { // Delay caused by opening DevTools
                logoutUser();
            }
        }, 250);
    });

})();









