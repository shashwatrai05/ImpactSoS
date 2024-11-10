function render(user) {
    document.getElementById('dname').innerHTML = user.name + '!';
    document.getElementById('name').innerHTML = user.name
    document.getElementById('gp').innerHTML = user.gender + ', ' + user.phone_number
    document.getElementById('epn').innerHTML = user.emergency_contact.phone_number
    document.getElementById('at').innerHTML = user.alert_time + 's'
    // document.getElementById('karma').innerHTML = user.karma
    user.past_records.slice().reverse().forEach((record) => {
        document.getElementById('past-records').innerHTML += `<div class="record">
        <div class="top-record">
            <p>${record.date} ${record.month}<br><span style="font-weight: 400; color: #474747;">${record.day}</span></p>
            <p style="font-size: 6vw; font-weight: 400; color: #474747;margin-top: 4vw">${record.totalTime}</p>
        </div>
        <div class="bottom-record">
        </div>
    </div>`
    })
}

window.onload = () => {
    if (localStorage.getItem('accessToken') === null) {
        window.location.href = '/register';
    } else {
        console.log("coming here")
        fetch(`/dashinfo?accessToken=${localStorage.getItem('accessToken')}`, { method: "GET" })
        .then(async (response) => {
            const data = await response.json();
            if (data.success === true) {
                render(data.user)
            } else {
                window.location.href = '/register'
            }
        })
        .catch((err) => {console.log(err)});
    }
}