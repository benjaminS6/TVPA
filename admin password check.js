// Fungura form kugirango ushyiremo username na password
function submitAdminLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Reba niba username na password bihuye
    checkIfUserExists(username, password);
}

function checkIfUserExists(username, password) {
    // Shaka niba admin ariyo muri Firestore
    const userRef = db.collection('users').doc(username);

    userRef.get().then((doc) => {
        if (doc.exists) {
            // Kora check niba password ihuye
            const storedPassword = doc.data().password;
            if (storedPassword === password) {
                // Bimenyekane ko yatsinze login, ajye ku admin dashboard
                alert("Login successful");
                window.location.href = "admin_dashboard.html";
            } else {
                alert("Invalid password");
            }
        } else {
            alert("User not found, creating new account");
            // Niba user ataraboneka, reba uko wategura account nshya
            createNewAdminAccount(username, password);
        }
    }).catch((error) => {
        console.error("Error checking user: ", error);
    });
}

function createNewAdminAccount(username, password) {
    // Shyira username na password muri Firestore kugira ngo utangire account
    db.collection('users').doc(username).set({
        password: password,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert("New admin account created");
        window.location.href = "admin_dashboard.html"; // Redirect admin
    })
    .catch((error) => {
        console.error("Error creating new account: ", error);
    });
}