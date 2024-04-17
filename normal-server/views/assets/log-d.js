// Logged data. Send this to server.
log = {
    page: window.location.pathname,
    timestamp: 0,
    data: { // TODO: Make classes out of these two.
        keyboard: [],
        mouse: []
    }
}

const submitLog = (log) => {
    log.timestamp = Date.now();

    fetch("/log.d/receive", {
        method: "post",
        headers: { // Required headers. See Postman documentation "user to normal".
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        mode: 'cors',
        body: JSON.stringify(log),
        keepalive: true // Keep alive until after window close. See: https://stackoverflow.com/questions/63157089/sending-post-request-with-fetch-after-closing-the-browser-with-beforeunload
    });
}

// On page load.
window.addEventListener("load", (page) => {
    // fetch("/test");
});

// On leaving page / moving to different page.
window.addEventListener("visibilitychange", (page) => {
    submitLog(log);
});

// Before page close.
window.addEventListener("beforeunload", (page) => {
    submitLog(log);
});

// Keyboard logger.
document.addEventListener("keydown", (keyboard) => {
    log.data.keyboard[log.data.keyboard.length] = {
        key: keyboard.key,
        timestamp: Date.now()
    }

    // For manual testing purposes only.
    // TODO: Remove on production.
    if (keyboard.key == "Enter") {
        log.data.keyboard.forEach(data => console.log(data))
        log.data.mouse.forEach(data => console.log(data))
        log.data.keyboard = []
        log.data.mouse = []
    }
});

// Stores last mouse position.
lastMousePosition = {
    x: 0,
    y: 0
}

// Mouse logger.
document.addEventListener("mousemove", (mouse) => {
    if (Math.abs(lastMousePosition.x - mouse.offsetX) > 5 || Math.abs(lastMousePosition.y - mouse.offsetY) > 5) { // If mouse moves x or y px away from last saved position, trigger.
        // Updates last saved mouse position.
        lastMousePosition.x = mouse.offsetX;
        lastMousePosition.y = mouse.offsetY;

        // Saves mouse position to data.
        log.data.mouse[log.data.mouse.length] = {
            pixel: {
                x: mouse.offsetX,
                y: mouse.offsetY
            },
            timestamp: Date.now()
        }
    }
});