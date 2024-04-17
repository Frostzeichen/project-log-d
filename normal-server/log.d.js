const data = (object, mode = "none") => {
    if (mode == "print") {
        object.data.mouse.forEach(pixel => console.log(`
X: ${pixel.pixel.x}
Y: ${pixel.pixel.y}
Timestamp: ${pixel.timestamp}
        `));
        object.data.keyboard.forEach(key => console.log(`
Key: ${key.key}
Timestamp: ${key.timestamp}
        `));
    }
    return object.data;
}

const divert = (log, route) => {
    fetch(route, {
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

const keyboard = (object) => {
    return object.data.keyboard;
}

const mouse = (object) => {
    return object.data.mouse;
}

module.exports = {
    data: data,
    keyboard: keyboard,
    mouse: mouse,
    divert: divert
}