async function loadGuest() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) return;

    const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyPi_MwQZbRYC0qcTVpQ6AbveNFQYUwp7ZghvJmF-U_bfc5oz6HG_KkBOdYFg-eHMtJ6Q/exec?token=" + encodeURIComponent(token)
    );

    const guest = await response.json();

    if (guest.success) {
        document.getElementById("guestName").innerText =
            "Dear " + guest.name + ",";
    }
}

loadGuest();
async function rsvpYes() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const url =
        "https://script.google.com/macros/s/AKfycbyPi_MwQZbRYC0qcTVpQ6AbveNFQYUwp7ZghvJmF-U_bfc5oz6HG_KkBOdYFg-eHMtJ6Q/exec" +
        "?token=" + encodeURIComponent(token) +
        "&rsvp=YES";

    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
        alert("Thank you! We can't wait to celebrate with you! ❤️");
    } else {
        alert(result.message);
    }
}

async function rsvpNo() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const url =
        "https://script.google.com/macros/s/AKfycbyPi_MwQZbRYC0qcTVpQ6AbveNFQYUwp7ZghvJmF-U_bfc5oz6HG_KkBOdYFg-eHMtJ6Q/exec" +
        "?token=" + encodeURIComponent(token) +
        "&rsvp=NO";

    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
        alert("We're sorry you can't make it. ❤️");
    } else {
        alert(result.message);
    }
}