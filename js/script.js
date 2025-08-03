const teamMembers = [
    { name: "Dr. Sarah Thompson", role: "Chief Veterinarian", img: "images/vet1.png", bio: "Expert in small animals and surgery with 10 years of experience." },
    { name: "Dr. Rajiv Kumar", role: "Exotic Animal Specialist", img: "images/vet2.png", bio: "Specialist in exotic pets and wildlife care." },
    { name: "Emily Wilson", role: "Pet Nurse & Grooming Expert", img: "images/vet3.png", bio: "Certified groomer and veterinary nurse." }
];

function renderTeam() {
    const teamContainer = document.getElementById('team-grid');
    if (!teamContainer) return;
    teamContainer.innerHTML = '';
    teamMembers.forEach((member, index) => {
        const card = `
            <div class="team-card" onclick="openModal(${index})">
                <img src="${member.img}" alt="${member.name}">
                <h3>${member.name}</h3>
                <p>${member.role}</p>
            </div>
        `;
        teamContainer.innerHTML += card;
    });
}

// ================= TEAM MODAL =================
function openModal(index) {
    const modal = document.getElementById('teamModal');
    const content = document.getElementById('modalContent');
    content.innerHTML = `
        <span class="close-btn" onclick="closeModal()">X</span>
        <h2>${teamMembers[index].name}</h2>
        <p><strong>${teamMembers[index].role}</strong></p>
        <p>${teamMembers[index].bio}</p>
    `;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('teamModal').style.display = 'none';
}

// ================= TEAM SEARCH FILTER =================
function filterTeam() {
    const query = document.getElementById('searchTeam').value.toLowerCase();
    const filtered = teamMembers.filter(member =>
        member.name.toLowerCase().includes(query) || member.role.toLowerCase().includes(query)
    );
    const teamContainer = document.getElementById('team-grid');
    teamContainer.innerHTML = '';
    filtered.forEach((member, index) => {
        const card = `
            <div class="team-card" onclick="openModal(${index})">
                <img src="${member.img}" alt="${member.name}">
                <h3>${member.name}</h3>
                <p>${member.role}</p>
            </div>
        `;
        teamContainer.innerHTML += card;
    });
}

// ================= SERVICES (AJAX LOAD) =================
let allServices = [];

function loadServices() {
    const container = document.getElementById('services-grid');
    if (!container) return;
    fetch('../data/services.json')
        .then(res => res.json())
        .then(data => {
            allServices = data;
            displayServices(data);
        })
        .catch(err => console.error("Error loading services:", err));
}

function displayServices(services) {
    const container = document.getElementById('services-grid');
    container.innerHTML = '';
    services.forEach(service => {
        container.innerHTML += `
            <div class="service-card">
                <h3>${service.title}</h3>
                <p>${service.desc}</p>
            </div>
        `;
    });
}

function filterServices() {
    const selected = document.getElementById('serviceFilter').value;
    if (selected === 'all') {
        displayServices(allServices);
    } else {
        const filtered = allServices.filter(service => service.category === selected);
        displayServices(filtered);
    }
}

// ================= CONTACT FORM VALIDATION =================
function validateContactForm(event) {
    event.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMsg').value.trim();

    if (!name || !email || !message) {
        alert('All fields are required!');
        return;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    document.getElementById('contactSuccess').innerText = "Message sent successfully!";
}

// ================= DONATE FLOW =================
function proceedDonate() {
    const radios = document.querySelectorAll('input[name="amount"]');
    let selectedAmount = '';
    radios.forEach(radio => { if (radio.checked) selectedAmount = radio.value; });
    const custom = document.getElementById('customAmount').value;
    if (selectedAmount || custom) {
        window.location.href = 'payment.html';
    } else {
        alert('Please select or enter an amount.');
    }
}

// ================= PAYMENT VALIDATION =================
document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const cardNumber = document.getElementById('cardNumber').value.trim();
            const expiry = document.getElementById('expiry').value.trim();
            const cvv = document.getElementById('cvv').value.trim();
            const name = document.getElementById('cardName').value.trim();

            const cardValid = /^\d{16}$/.test(cardNumber);
            const expiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
            const cvvValid = /^\d{3}$/.test(cvv);
            const nameValid = name.length > 0;

            if (cardValid && expiryValid && cvvValid && nameValid) {
                document.getElementById('successMsg').textContent = "Payment Successful! Thank you for your support.";
            } else {
                alert('Please enter valid details.');
            }
        });
    }
});