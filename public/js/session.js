var map = null;
var marker = [];
let crashes = [];
let currentPosition = [];
let currentMarkerLocation = [];
let resonanceId = "";
navigator.geolocation.getCurrentPosition(showPosition);
let karma = 0;

const socket = io("/");

socket.on("connect", () => {
  console.log(socket.id);
  fetch(
    `/api/user/socket?token=${localStorage.getItem("accessToken")}&socket_id=${
      socket.id
    }`
  ).then((res) => {});
});

window.resonanceAsyncInit = function () {
  if (!Resonance.isCompatible()) {
    console.error("Your browser is not supported");
  }
  var resonance = new Resonance("9ab05624-9086-4b88-9606-a8ffad4932ed");
  resonance.startSearch("LAPTOP", function (error) {
    if (error) {
      console.error(error.message);
    } else {
      resonanceId = resonance.wsClient._clientId;
      console.log("resonance id : " + resonanceId);
      fetch(
        `/api/user/resonance?token=${localStorage.getItem(
          "accessToken"
        )}&resonance_id=${resonance.wsClient._clientId}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    }
  });

  resonance.on("nearbyFound", function (nearby) {
    console.log(nearby.clientId);
  });

  resonance.on("searchStopped", function (error) {
    if (error) {
      console.error(error.message);
    } else {
      // search was stopped normally
    }
  });
};

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
var aDay = 24 * 60 * 60 * 1000;
console.log(timeSince(new Date(Date.now() - aDay)));
console.log(timeSince(new Date(Date.now() - aDay * 2)));

function showPosition(position) {
  currentPosition = [position.coords.latitude, position.coords.longitude];
  console.log(currentPosition);
  map = new MapmyIndia.Map("map", {
    center: currentPosition,
    zoomControl: true,
    hybrid: true,
  });

  function getAllCrashes() {
    let url = `/api/crashes`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          let lat = data[i].location[0];
          let lon = data[i].location[1];
          let crash = [lat, lon];
          crashes.push(crash);
        }
        loadAllCrashes(data);
      });
  }

  function mapmyindia_fit_markers_into_bound(position) {
    var maxlat = position.lat;
    var maxlon = position.lng;
    var minlat = position.lat;
    var minlon = position.lng;
    var southWest = L.latLng(maxlat, maxlon);
    var northEast = L.latLng(minlat, minlon);
    var bounds = L.latLngBounds(southWest, northEast);
    map.fitBounds(bounds);
  }

  function addMarker(position, icon, title, draggable) {
    if (icon == "") {
      var mk = new L.Marker(position, {
        draggable: draggable,
        title: title,
      });
    } else {
      var mk = new L.Marker(position, {
        icon: icon,
        draggable: draggable,
        title: title,
      });
    }
    map.addLayer(mk);
    mk.on("click", async function (e) {
      mapmyindia_fit_markers_into_bound(position);
      currentMarkerLocation = [position.lat, position.lng];
      calculateDistance(position, title);
      console.log(title);
    });
    return mk;
  }

  socket.on("crash", (crashObject) => {
    console.log(crashObject);
    var icon = L.icon({
      iconUrl:
        "https://media.discordapp.net/attachments/872743735388172318/929051528285806642/unknown.png",
      iconRetinaUrl:
        "https://media.discordapp.net/attachments/872743735388172318/929051528285806642/unknown.png",
      iconSize: [100, 100],
      popupAnchor: [-3, -15],
    });
    var position = new L.LatLng(
      crashObject.location[0],
      crashObject.location[1]
    );
    let url = `https://api.radar.io/v1/route/distance?origin=${currentPosition[0]},${currentPosition[1]}&destination=${crashObject.location[0]},${crashObject.location[1]}&modes=car&units=metric`;
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "prj_live_sk_023b2379b86ae218901dd83336e69dce2f8276ac",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.routes.car.distance.value < 4000) {
          marker.push(
            addMarker(position, icon, JSON.stringify(crashObject), false)
          );
          document.getElementById("dist").innerHTML =
            data.routes.car.distance.text + " away";
          document.getElementById("alertModal").style.display = "block";
        }
      });
  });

  async function calculateDistance(crashPosition, crashResponse) {
    let crash = JSON.parse(crashResponse);
    let date = new Date(crash.date);
    let url = `https://api.radar.io/v1/route/distance?origin=${currentPosition[0]},${currentPosition[1]}&destination=${crashPosition.lat},${crashPosition.lng}&modes=car&units=metric`;
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "prj_live_sk_023b2379b86ae218901dd83336e69dce2f8276ac",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        document.querySelector("#bottom-card > h1").innerHTML =
          data.routes.car.distance.text + " away";
        document.querySelector("#bottom-card > p").innerHTML =
          "Last updated " + timeSince(date) + " ago";
        document.querySelector(
          "#expanded-bottom-card > div > div > h1"
        ).innerHTML = data.routes.car.distance.text + " away";
        document.querySelector(
          "#expanded-bottom-card > div > div > p"
        ).innerHTML = "Last updated " + timeSince(date) + " ago";
        document.querySelector("#victim-id").value = crash.victim;
        document.getElementById("bottom-card").style.display = "block";
      })
      .catch((err) => console.log(err));
  }

  function markCurrentLocation() {
    var icon = L.icon({
      iconUrl:
        "https://media.discordapp.net/attachments/872743735388172318/929084635126857768/unknown.png",
      iconRetinaUrl:
        "https://media.discordapp.net/attachments/872743735388172318/929084635126857768/unknown.png",
      iconSize: [30, 30],
      popupAnchor: [-3, -15],
    });
    var position = new L.LatLng(currentPosition[0], currentPosition[1]);
    var mk = addMarker(currentPosition, icon, "Current Location", false);
  }

  function loadAllCrashes(crashResponse) {
    var icon = L.icon({
      iconUrl:
        "https://media.discordapp.net/attachments/872743735388172318/929051528285806642/unknown.png",
      iconRetinaUrl:
        "https://media.discordapp.net/attachments/872743735388172318/929051528285806642/unknown.png",
      iconSize: [100, 100],
      popupAnchor: [-3, -15],
    });
    for (let i = 0; i < crashes.length; i++) {
      var position = new L.LatLng(crashes[i][0], crashes[i][1]);
      console.log(position);
      marker.push(
        addMarker(position, icon, JSON.stringify(crashResponse[i]), false)
      );
    }
  }
  getAllCrashes();
  markCurrentLocation();
}

document.getElementById("begin").addEventListener("click", () => {
  document.getElementById("startModal").style.display = "none";
  document.getElementById("map-custom-stuff").style.display = "block";
  start();
});

document.getElementById("skip").addEventListener("click", () => {
  document.getElementById("alertModal").style.display = "none";
});

document.getElementById("backSession").addEventListener("click", () => {
  document.getElementById("successAlert").style.display = "none";
});

// document.getElementById("google-maps-icon").addEventListener("click", () => {
//   window.open(
//     `https://maps.google.com/?q=${currentMarkerLocation[0]},${currentMarkerLocation[1]}`
//   );
// });

document
  .getElementById("bottom-card-respond-button")
  .addEventListener("click", () => {
    socket.emit("respond", {
      victim: document.querySelector("#victim-id").value,
      resonance_id: resonanceId,
    });
    let url = "/api/user";
    fetch(`${url}?token=${document.querySelector("#victim-id").value}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        document.querySelector("#name").innerHTML = data.name;
        document.querySelector(
          "#gp"
        ).innerHTML = `${data.gender}, ${data.phone_number}`;
        document.querySelector(
          "#bg"
        ).innerHTML = `Blood Group: ${data.blood_group}`;
        document.querySelector(
          "#epn"
        ).innerHTML = `${data.emergency_contact.phone_number}`;
        document.querySelector("#at").innerHTML = `${data.alert_time}s`;
      })
      .catch((err) => console.log(err));
    document.getElementById("bottom-card").style.display = "none";
    document.getElementById("expanded-bottom-card").style.display = "block";
  });

document
  .getElementsByClassName("pending-button")[0]
  .addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(curPosition);

    function curPosition(position) {
      let url = `https://api.radar.io/v1/route/distance?origin=${position.coords.latitude},${position.coords.longitude}&destination=${currentMarkerLocation[0]},${currentMarkerLocation[1]}&modes=car&units=metric`;
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: "prj_live_sk_023b2379b86ae218901dd83336e69dce2f8276ac",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.routes.car.distance.value <= 10) {
            document.getElementsByClassName(
              "pending-button"
            )[0].style.background = "#43B862";
            document.getElementsByClassName("pending-button")[0].innerText =
              "Success";
            karma += 10;
            fetch(
              `/api/user/success?token=${localStorage.getItem("accessToken")}`
            )
              .then((res) => res.json())
              .then((data) => {})
              .catch((err) => console.log(err));
            setTimeout(() => {
              document.getElementById("successAlert").style.display = "block";
            }, 2000);
          }
        })
        .catch((err) => console.log(err));
    }
  });

document.getElementById("respond-button").addEventListener("click", () => {
  document.getElementById("alertModal").style.display = "none";
  document.getElementById("successAlert").style.display = "block";
});

document.getElementById("end").addEventListener("click", () => {
  // send time of session and karma collected to a past record saving endpoint
  fetch(`/api/user/record?token=${localStorage.getItem("accessToken")}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date: "9th",
      month: "January",
      day: "Sunday",
      creditsEarned: karma,
      totalTime: document.getElementsByClassName("timer")[0].innerHTML,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.href = "/dashboard";
    })
    .catch((err) => console.log(err));
});

function start() {
  x = setInterval(timer, 10);
}

var milisec = 0;
var sec = 0;
var min = 0;
var hour = 0;

var miliSecOut = 0;
var secOut = 0;
var minOut = 0;
var hourOut = 0;

function timer() {
  miliSecOut = checkTime(milisec);
  secOut = checkTime(sec);
  minOut = checkTime(min);
  hourOut = checkTime(hour);

  milisec = ++milisec;

  if (milisec === 100) {
    milisec = 0;
    sec = ++sec;
  }

  if (sec == 60) {
    min = ++min;
    sec = 0;
  }

  if (min == 60) {
    min = 0;
    hour = ++hour;
  }

  document.getElementsByClassName("timer")[0].innerHTML = `${minOut}:${secOut}`;
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

document.getElementById("map").addEventListener("click", () => {
  document.getElementById("bottom-card").style.display = "none";
});

const endSessionButton = document.getElementById("end");
const startModal = document.getElementById("startModal");

function endSession() {
  const confirmEnd = confirm("Are you sure you want to end this session?");

  if (confirmEnd) {
    // Stop the timer
    clearInterval(x);

    // Calculate final session time
    const finalTime = document.getElementsByClassName("timer")[0].innerHTML;

    // Clean up map markers
    if (marker && marker.length) {
      marker.forEach((m) => {
        if (m && map) {
          map.removeLayer(m);
        }
      });
      marker = [];
    }

    // Clear crashes array
    crashes = [];

    // Stop location tracking
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }

    // Disconnect socket
    if (socket) {
      socket.disconnect();
    }

    // Stop Resonance search if active
    if (window.resonance) {
      window.resonance.stopSearch();
    }

    // Send session data to server
    fetch(`/api/user/record?token=${localStorage.getItem("accessToken")}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: new Date().getDate(),
        month: new Date().toLocaleString("default", { month: "long" }),
        day: new Date().toLocaleString("default", { weekday: "long" }),
        creditsEarned: karma,
        totalTime: finalTime,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Reset UI state
        document.getElementById("startModal").style.display = "flex";
        document.getElementById("map-custom-stuff").style.display = "none";
        document.getElementById("alertModal").style.display = "none";
        document.getElementById("expanded-bottom-card").style.display = "none";

        // Reset timer variables
        milisec = 0;
        sec = 0;
        min = 0;
        hour = 0;

        // Reset karma
        karma = 0;

        // Redirect to dashboard
        window.location.href = "/dashboard";
      })
      .catch((err) => {
        console.error("Error ending session:", err);
        alert("There was an error ending your session. Please try again.");
      });
  }
}

// Add click event listener to end session button
// document.getElementById("end").addEventListener("click", async () => {
//   await endSession();
// });

// Initialize all session-related variables
let isSessionActive = false;
let watchId = null;

async function beginSession() {
  try {
    // Request necessary permissions
    const permissions = await requestPermissions();
    if (!permissions) {
      alert(
        "Required permissions were not granted. Please allow permissions to start the session."
      );
      return;
    }

    isSessionActive = true;

    // Hide start modal and show map controls
    document.getElementById("startModal").style.display = "none";
    document.getElementById("map-custom-stuff").style.display = "block";

    // Start location tracking with high accuracy
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        currentPosition = [position.coords.latitude, position.coords.longitude];
        updateCurrentLocationMarker(position);
      },
      (error) => {
        console.error("Error watching position:", error);
        alert("Unable to track location. Please check your GPS settings.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    // Start the timer
    start();

    // Initialize socket connection if not already connected
    if (socket && !socket.connected) {
      socket.connect();
    }

    // Initialize map if not already done
    if (!map) {
      navigator.geolocation.getCurrentPosition((position) => {
        currentPosition = [position.coords.latitude, position.coords.longitude];
        initializeMap(position);
      });
    }

    // Fetch initial crashes
    getAllCrashes();
  } catch (error) {
    console.error("Error starting session:", error);
    alert("There was an error starting the session. Please try again.");
  }
}

// Function to request all required permissions
async function requestPermissions() {
  try {
    // Request location permission
    const locationPermission = await navigator.permissions.query({
      name: "geolocation",
    });
    if (locationPermission.state === "denied") {
      alert("Location permission is required for this app to work.");
      return false;
    }

    // Request notification permission
    if ("Notification" in window) {
      const notificationPermission = await Notification.requestPermission();
      if (notificationPermission === "denied") {
        alert("Notification permission is recommended for alerts.");
      }
    }

    return true;
  } catch (error) {
    console.error("Error requesting permissions:", error);
    return false;
  }
}

// Function to update current location marker
function updateCurrentLocationMarker(position) {
  const newPosition = [position.coords.latitude, position.coords.longitude];

  // Remove existing current location marker if it exists
  if (window.currentLocationMarker) {
    map.removeLayer(window.currentLocationMarker);
  }

  // Create new marker icon
  const icon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="30" height="30">
      <path fill="#dc2626" d="M192 0C86 0 0 86 0 192c0 77.4 27 99 172.3 309.7c9.5 13.8 29.9 13.8 39.4 0C357 291 384 269.4 384 192C384 86 298 0 192 0zM192 272c-44.2 0-80-35.8-80-80s35.8-80 80-80s80 35.8 80 80s-35.8 80-80 80z"/>
    </svg>`,
    className: "custom-div-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  // Add new marker
  window.currentLocationMarker = new L.Marker(newPosition, {
    icon: icon,
    title: "loc",
  });
  map.addLayer(window.currentLocationMarker);

  // Center map on new position
  map.setView(newPosition, map.getZoom());
}

// Function to initialize map
function initializeMap(position) {
  map = new MapmyIndia.Map("map", {
    center: [position.coords.latitude, position.coords.longitude],
    zoomControl: true,
    hybrid: true,
    zoom: 15,
  });
}

// Event listener for begin button
document.getElementById("begin").addEventListener("click", async () => {
  await beginSession();
});

// Modified getAllCrashes function to handle errors
function getAllCrashes() {
  fetch("/api/crashes")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Loaded crashes:", data);
      crashes = [];
      // Clear existing crash markers
      if (marker.length > 0) {
        marker.forEach((m) => map.removeLayer(m));
        marker = [];
      }

      // Add new crash markers
      for (let i = 0; i < data.length; i++) {
        let lat = data[i].location[0];
        let lon = data[i].location[1];
        crashes.push([lat, lon]);
      }
      loadAllCrashes(data);
    })
    .catch((error) => {
      console.error("Error fetching crashes:", error);
    });
}
