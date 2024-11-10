let socketID = '';

const socket = io("/");
socket.on("connect", () => {
    socketID = socket.id;
    fetch(`/api/user/socket?token=${localStorage.getItem('accessToken')}&socket_id=${socket.id}`).then(res => {});
});


function sendSOS() {
    navigator.geolocation.getCurrentPosition(curPosition);
    function curPosition(position) {
        socket.emit("crash", {victim: localStorage.getItem("accessToken"), date: new Date(), location: [position.coords.latitude, position.coords.longitude]});
        fetch("/api/report", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                victim: localStorage.getItem("accessToken"),
                location: [position.coords.latitude, position.coords.longitude]
            }),
        }).then(res => res.json()).then(data => {
            if (data.success) {
                fetch(`/api/user?token=${localStorage.getItem("accessToken")}`).then(res => res.json()).then(data => {
                    const message = `${data.name} may have been involved in accident. They've listed this number as their emergency contact under the relation "${data.emergency_contact.relation}". Here's their live location: https://maps.google.com/?q=${position.coords.latitude, position.coords.longitude}. Powered by Mapcident`
                    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=uTdl6sn01RLrBQbNkS25ywPC4I7OGmiFhMvpAZEKex9Wjfa3HUHEBVdkzrOexFQKWgThDIb3sGUZYSJc&route=v3&sender_id=ANSHUL&message=${message}.&language=english&flash=0&numbers=${data.emergency_contact.phone_number}`
                    fetch(url).then(res => res.json()).then(data => {
                        console.log(data)
                        if (data.return) {
                            console.log("DONE!!")
                        }
                    })
                })
            }
        })
    }
    document.getElementsByTagName("body")[0].innerHTML = `<img id="main-icon" src="https://media.discordapp.net/attachments/872743735388172318/929399126456676352/unknown.png">
<div id="main">
<h1>SOS</h1>
<h6>SOS alert sent to nearby users! While they arrive we are also</h6>
<img id="inside-img" src="https://media.discordapp.net/attachments/872743735388172318/929414530595962940/unknown.png">
<a href="/dashboard"><img id="cancel-btn" style="margin-top: 18vw" src="https://media.discordapp.net/attachments/872743735388172318/929414669175779379/unknown.png"></a>
<h5 id="end-sos">End SOS</h5>
</div>`;
}

let sosHasHappened = false;

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (minutes == "01" && seconds == "30" && sosHasHappened == false) {
            sendSOS()
            sosHasHappened = true;
        }

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

window.onload = function () {
    fetch(`/api/user?token=${localStorage.getItem("accessToken")}`).then(res => res.json()).then(data => {
        let display = document.querySelector('#time');
        startTimer(data.alert_time, display);
    })
};