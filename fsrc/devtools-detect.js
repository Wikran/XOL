document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("contextmenu", (event) => {
        setTimeout(() => {
            if (window.outerWidth - window.innerWidth > 160 || 
                window.outerHeight - window.innerHeight > 160) {
                alert("Inspect is disabled!");
                location.reload(); // Reload to stop Inspect
            }
        }, 100);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "F12" || 
            (event.ctrlKey && event.shiftKey && event.key === "I") || 
            (event.ctrlKey && event.key === "U")) {
            event.preventDefault();
            alert("DevTools is disabled!");
        }
    });
});

