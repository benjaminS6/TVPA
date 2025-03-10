// Fungura niba umukandida yaranditswe muri Firestore
function isCandidateRegistered(selectedMemberId) {
    return db.collection('candidates').where('memberId', '==', selectedMemberId).get().then(snapshot => {
        return snapshot.empty; // Niba snapshot irimo, bivuze ko umukandida atarabikijwe, akemerewe kwandikwa
    });
}

// Save candidate to Firestore with member details
function saveCandidate() {
    const selectedMemberId = document.getElementById('memberList').value;
    if (selectedMemberId) {
        // Reba niba umukandida atarabikijwe
        isCandidateRegistered(selectedMemberId).then(canRegister => {
            if (!canRegister) {
                alert("This candidate has already been registered.");
                return; // Ntashobora kongera kwandikwa
            }

            // Fetch member details if the candidate is not already registered
            db.collection('members').doc(selectedMemberId).get().then(memberDoc => {
                if (memberDoc.exists) {
                    const memberData = memberDoc.data();

                    // Save candidate details in the 'candidates' collection
                    db.collection('candidates').add({
                        memberId: selectedMemberId,
                        name: memberData.name,
                        phone: memberData.phone
                    }).then(() => {
                        alert("Candidate saved successfully!");
                        loadCandidates(); // Reload candidates list after saving
                    }).catch(error => {
                        console.error("Error saving candidate: ", error);
                    });
                } else {
                    alert("Selected member not found.");
                }
            }).catch(error => {
                console.error("Error fetching member details: ", error);
            });
        }).catch(error => {
            console.error("Error checking candidate registration: ", error);
        });
    } else {
        alert("Please select a member to register as a candidate.");
    }
}

// Fungura abakandida hamwe n'amakuru yabo
function loadCandidates() {
    db.collection('candidates').get().then(snapshot => {
        const candidatesList = document.getElementById('candidatesList');
        candidatesList.innerHTML = '';
        snapshot.forEach(doc => {
            const candidateData = doc.data();
            const li = document.createElement('li');
            li.textContent = `Izina: ${candidateData.name}, Telefone: ${candidateData.phone}`;
            candidatesList.appendChild(li);
        });
    }).catch(error => {
        console.error("Error loading candidates: ", error);
    });
}