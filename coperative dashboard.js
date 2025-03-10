// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyD1kpUjLGenqQB1QL_KMOyp54FaOqf4tfk",
    authDomain: "tvpa-60c0a.firebaseapp.com",
    projectId: "tvpa-60c0a",
    storageBucket: "tvpa-60c0a.firebasestorage.app",
    messagingSenderId: "1071463678694",
    appId: "1:1071463678694:web:810c3ac3a5a4c783a87127",
    measurementId: "G-G4E2JHFYZS"
  };
  
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Check if member exists in Firestore and allow to vote
function genzuraIzina() {
    const izina = document.getElementById('izina').value;

    if (izina) {
        db.collection('members').where("name", "==", izina).get()
        .then((snapshot) => {
            if (snapshot.empty) {
                document.getElementById('ubutumwa').style.display = 'block';
                document.getElementById('ubutumwa').textContent = "You are not a registered member!";
                document.getElementById('gutora').style.display = 'none';
            } else {
                document.getElementById('ubutumwa').style.display = 'none';
                document.getElementById('gutora').style.display = 'block';
                loadCandidates();  // Load candidates after member is verified
            }
        })
        .catch((error) => {
            console.error('Error checking member: ', error);
        });
    } else {
        alert("Please enter your name");
    }
}

// Load candidates from Firestore into the dropdowns
function loadCandidates() {
    const positions = ['president', 'vp', 'accountable', 'secretary', 'advisor'];

    positions.forEach(position => {
        const selectElement = document.getElementById(position);
        selectElement.innerHTML = ''; // Clear existing options
        const defaultOption = document.createElement('option');
        defaultOption.textContent = `Select ${position.charAt(0).toUpperCase() + position.slice(1)}`;
        defaultOption.value = '';
        selectElement.appendChild(defaultOption); // Add a default option

        db.collection('candidates').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const candidateData = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;  // Store candidate document ID
                option.textContent = candidateData.name;  // Assuming candidate has a 'name' field
                selectElement.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error loading candidates: ', error);
        });
    });
}

// Submit vote and update Firestore
function submitVote() {
    const president = document.getElementById('president').value;
    const vp = document.getElementById('vp').value;
    const accountable = document.getElementById('accountable').value;
    const secretary = document.getElementById('secretary').value;
    const advisor = document.getElementById('advisor').value;

    if (president && vp && accountable && secretary && advisor) {
        const voteData = {
            president: president,
            vp: vp,
            accountable: accountable,
            secretary: secretary,
            advisor: advisor,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        db.collection('votes').add(voteData)
        .then(() => {
            alert("Your vote has been submitted successfully");
            document.getElementById('gutora').style.display = 'none';
        })
        .catch((error) => {
            console.error('Error submitting vote: ', error);
        });
    } else {
        alert('Please fill in all voting fields');
    }
}


function fetchCandidates() {
    // Fata amakuru yose kuri candidate
    firebase.firestore().collection('candidates')
        .get()
        .then(function(querySnapshot) {
            var dropdown = document.getElementById('candidateList');
            querySnapshot.forEach(function(doc) {
                var candidate = doc.data();
                var option = document.createElement('option');
                option.value = doc.id;  // ID ya kandidat
                option.textContent = candidate.candidateName + ' - ' + candidate.phone;
                dropdown.appendChild(option);
            });
        })
        .catch(function(error) {
            console.log("Error fetching candidates: ", error);
        });
}





// Fungura niba umunyamuryango yaratanze amajwi
function hasVoted(memberId) {
    return db.collection('votes').where('memberId', '==', memberId).get().then(snapshot => {
        return snapshot.empty; // Niba snapshot irimo, bivuga ko atarabikije amajwi, ntashobora kongera gutora
    });
}

// Bika amajwi niba umunyamuryango atarabikije
function saveVote() {
    const selectedCandidateId = document.getElementById('candidateList').value; // Ibika umukandida watowe
    const memberId = getCurrentMemberId(); // Fungura umunyamuryango watoye (ubikore hifashishijwe session cyangwa cookie)

    // Reba niba umunyamuryango atarabikije amajwi
    hasVoted(memberId).then(canVote => {
        if (!canVote) {
            alert("You have already voted. You cannot vote again.");
            return; // Ntacyo gikurikira niba yaratoye
        }

        if (selectedCandidateId) {
            // Bika amajwi muri Firestore
            db.collection('votes').add({
                candidateId: selectedCandidateId,
                memberId: memberId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp() // Byongeramo igihe
            }).then(() => {
                alert("Vote saved successfully!");
                loadCandidates(); // Reload candidates list after saving
            }).catch(error => {
                console.error("Error saving vote: ", error);
            });
        } else {
            alert("Please select a candidate to vote for.");
        }
    }).catch(error => {
        console.error("Error checking vote status: ", error);
    });
}





// Fungura niba umunyamuryango yaratanze amajwi
function hasVoted(memberId) {
    return db.collection('votes').where('memberId', '==', memberId).get().then(snapshot => {
        return snapshot.empty; // Niba snapshot irimo, bivuga ko atarabikije amajwi, ntashobora kongera gutora
    });
}

// Bika amajwi niba umunyamuryango atarabikije
function saveVote() {
    const selectedCandidateId = document.getElementById('candidateList').value; // Ibika umukandida watowe
    const memberId = getCurrentMemberId(); // Fungura umunyamuryango watoye (ubikore hifashishijwe session cyangwa cookie)

    // Reba niba umunyamuryango atarabikije amajwi
    hasVoted(memberId).then(canVote => {
        if (!canVote) {
            alert("You have already voted. You cannot vote again.");
            return; // Ntacyo gikurikira niba yaratoye
        }

        if (selectedCandidateId) {
            // Bika amajwi muri Firestore
            db.collection('votes').add({
                candidateId: selectedCandidateId,
                memberId: memberId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp() // Byongeramo igihe
            }).then(() => {
                alert("Vote saved successfully!");
                loadCandidates(); // Reload candidates list after saving
            }).catch(error => {
                console.error("Error saving vote: ", error);
            });
        } else {
            alert("Please select a candidate to vote for.");
        }
    }).catch(error => {
        console.error("Error checking vote status: ", error);
    });
}









// Function yo gupakira abakandida muri dropdown
function loadCandidatesForVoting() {
    const presidentDropdown = document.getElementById('president');
    const vpDropdown = document.getElementById('vp');
    const accountantDropdown = document.getElementById('accountable');
    const secretaryDropdown = document.getElementById('secretary');
    const advisorDropdown = document.getElementById('advisor');

    // Gusiba ibyo byari bihari mbere
    presidentDropdown.innerHTML = '';
    vpDropdown.innerHTML = '';
    accountantDropdown.innerHTML = '';
    secretaryDropdown.innerHTML = '';
    advisorDropdown.innerHTML = '';

    // Gusoma abakandida bari muri Firestore
    db.collection('candidates').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const candidateData = doc.data();
            const memberId = candidateData.memberId; // Fata ID ya member

            // Noneho dushake amazina y’uyu muntu muri members collection
            db.collection('members').doc(memberId).get().then((memberDoc) => {
                if (memberDoc.exists) {
                    const candidateName = memberDoc.data().name; // Fata izina

                    // Noneho turashyira aya mazina muri dropdowns
                    addOptionToDropdown(presidentDropdown, candidateName);
                    addOptionToDropdown(vpDropdown, candidateName);
                    addOptionToDropdown(accountantDropdown, candidateName);
                    addOptionToDropdown(secretaryDropdown, candidateName);
                    addOptionToDropdown(advisorDropdown, candidateName);
                }
            });
        });
    }).catch((error) => {
        console.error('Error loading candidates:', error);
    });
}

// Function yo kongeramo option muri dropdown
function addOptionToDropdown(dropdown, name) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    dropdown.appendChild(option);
}

// Iyo page ifunguwe, uhita upakira abakandida
window.onload = function () {
    loadCandidatesForVoting();
};
