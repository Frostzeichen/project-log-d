class Logd {
    divert = (log, route) => {
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

    data = (object, mode = "none") => {
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
    
    keyboard = (object) => {
        return object.data.keyboard;
    }
    
    mouse = (object) => {
        return object.data.mouse;
    }
    
    migrateQuery = (object) => {
        let data = [];
    
        let inputs = "INSERT INTO inputs (route, utime, timezone) VALUE (?, ?, ?);";
        data.push(object.page);
        data.push(object.timestamp);
        data.push(object.timezone);
        
        let keyboard_inputs = "SET @last_id = LAST_INSERT_ID(); INSERT INTO keyboard_inputs (input_id, button, utime) VALUE ";
        for (let i = 0; i < object.data.keyboard.length; i++) {
            keyboard_inputs += "(@last_id, ?, ?)";
            if (i < object.data.keyboard.length - 1) {
                keyboard_inputs += `,`;
            } else keyboard_inputs += ";";
            data.push(object.data.keyboard[i].key);
            data.push(object.data.keyboard[i].timestamp);
        }
    
        let mouse_inputs = "INSERT INTO mouse_inputs (input_id, x_position, y_position, utime) VALUE ";
        for (let i = 0; i < object.data.mouse.length; i++) {
            mouse_inputs += "(@last_id, ?, ?, ?)";
            if (i < object.data.mouse.length - 1) {
                mouse_inputs += `,`;
            } else mouse_inputs += ";";
            data.push(object.data.mouse[i].pixel.x);
            data.push(object.data.mouse[i].pixel.y);
            data.push(object.data.mouse[i].timestamp);
        }
    
        return {
            query: `${inputs} ${object.data.keyboard.length > 0 ? keyboard_inputs : ""} ${object.data.mouse.length > 0 ? mouse_inputs : ""}`,
            data: data
        }
    }

    constructor () {
    }
}

module.exports = new Logd;