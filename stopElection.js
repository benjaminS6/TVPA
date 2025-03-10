let electionActive = true; // Flag isobanura niba amatora ari gukora

// Fungura function ya "stop election"
document.querySelector("#stopElectionBtn")?.addEventListener("click", function() {
    electionActive = false; // Hagarika election
    alert("Amatora yarahagaritswe!");
    
    // Hagarika ibikorwa bya page ya student gusa
    if (window.location.pathname.includes("student")) {
        disableVoting(); 
    }
});

// Fungura function yo guhagarika ibikorwa ku rubuga rwa student
function disableVoting() {
    const voteButtons = document.querySelectorAll(".candidate-container");
    voteButtons.forEach(button => {
        button.style.pointerEvents = "none"; // Bifunga byose biremereye gukora
    });
    
    // Ushobora no guhagarika amakuru y'abakandida
    document.querySelectorAll('input').forEach(input => {
        input.disabled = true; // Disable inputs
    });
}
