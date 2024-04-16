// Logged data. Send this to server.
log = {
    data: {
        keyboard: [],
        mouse: []
    }
}

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