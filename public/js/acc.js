if (window.DeviceMotionEvent) {
    window.addEventListener("devicemotion", motion, false);
} else {
    console.log("DeviceMotionEvent is not supported");
}

const accData = {
    x: 0,
    y: 0,
    z: 0,
}

let fell = false;

function motion(event) {
    const eAx = event.accelerationIncludingGravity.x
    const eAy = event.accelerationIncludingGravity.y
    const eAz = event.accelerationIncludingGravity.z
    if (eAz >= 30) {
        fell = true;
    }
    if (fell) {
        window.location.href = '/alert'
    }
    if (accData.x === eAx && accData.y === eAy && accData.z === eAz) {
        if (fell) {
            window.location.href = '/alert'
        }
        return;
    } else {
        accData.x = eAx;
        accData.y = eAy;
        accData.z = eAz;
    }
}