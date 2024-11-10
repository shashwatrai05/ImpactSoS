let currentPage = 1;
let user = {
    name: '',
    phone_number: '',
    gender: '',
    blood_group: '',
    emergency_contact: {
        name: '',
        relation: '',
        phone_number: ''
    },
    alert_time: 10
}

function render() {
    const p1 = document.getElementById('p1');
    const p2 = document.getElementById('p2');
    const p3 = document.getElementById('p3');

    p1.style.display = 'none';
    p2.style.display = 'none';
    p3.style.display = 'none';

    document.getElementById('step-number').innerHTML = currentPage;
    if (currentPage === 1) {
        p1.style.display = "block";
        p2.style.display = "none";
        p3.style.display = "none";
    } else if (currentPage === 2) {
        p1.style.display = "none";
        p2.style.display = "block";
        p3.style.display = "none";
    } else if (currentPage === 3) {
        p1.style.display = "none";
        p2.style.display = "none";
        p3.style.display = "block";
    }
}

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('continue')) {
        if (currentPage === 3) {
            let minutes = document.querySelector('[name="first-minute"]').value + document.querySelector('[name="second-minute"]').value
            let seconds = document.querySelector('[name="first-second"]').value + document.querySelector('[name="second-second"]').value
            seconds = Number(minutes)*60 + Number(seconds)
            user.alert_time = seconds
            console.log(user)
            fetch("/register", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            })
            .then(async (response) => {
                const data = await response.json();
                if (data.success === true) {
                    localStorage.setItem('accessToken', data.accessToken);
                    window.location.href = '/dashboard';
                } else {
                    window.location.href = '/register'
                }
            })
            .catch((err) => {console.log(err)});
        } else {
            if (currentPage === 1) {
                user.name = document.querySelector('[name="u-name"]').value;
                user.phone_number = document.querySelector('[name="uphone-number"]').value;
                user.gender = document.querySelector('[name="ugender"]').value;
                user.blood_group = document.querySelector('[name="ublood-group"]').value;
            } else if (currentPage === 2) {
                user.emergency_contact.name = document.querySelector('[name="ecfull-name"]').value;
                user.emergency_contact.relation = document.querySelector('[name="ecrelation"]').value;
                user.emergency_contact.phone_number = document.querySelector('[name="ecphone-number"]').value;
            }
            currentPage++;
            render();
        }
    }
})

window.onload = () => {
    if (localStorage.getItem('accessToken')) {
        window.location.href = '/dashboard';
    }
    render();
}