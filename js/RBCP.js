// --- Utility Functions ---
/**
 * Generates a unique ID for entities based on a sequential counter and a prefix.
 * @param {string} entityType - The type of entity (e.g., 'owners', 'pets').
 * @returns {string} A formatted sequential ID (e.g., 'OWN-0001').
 */
function generateSequentialId(entityType) {
    const entityPrefix = ENTITY_PREFIXES[entityType] || 'GEN-'; // Fallback for generic
    let counters = loadData(STORAGE_KEYS.COUNTERS);
    if (!counters) {
        counters = {};
    }
    if (!counters[entityPrefix]) {
        counters[entityPrefix] = 0;
    }
    counters[entityPrefix]++;
    saveData(STORAGE_KEYS.COUNTERS, counters);
    // Pad with leading zeros to 4 digits (e.g., 1 -> 0001, 12 -> 0012)
    const seqNum = String(counters[entityPrefix]).padStart(4, '0');
    return `${entityPrefix}${seqNum}`;
}

/**
 * Displays a temporary message box at the top of the screen.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message ('success', 'error', 'info').
 */
function showMessage(message, type = 'success') {
    const msgBox = document.getElementById('messageBox');
    msgBox.textContent = message;
    msgBox.className = `message-box show ${type}`; // Reset classes and add show/type
    setTimeout(() => {
        msgBox.classList.remove('show');
    }, 3000); // Hide after 3 seconds
}

/**
 * Hides all pages and displays the specified page.
 * @param {string} pageId - The ID of the page to display.
 */
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');
    // Clear message box when changing pages
    document.getElementById('messageBox').classList.remove('show', 'error', 'success');
}

// --- Local Storage Management ---
const STORAGE_KEYS = {
    USERS: 'vetClinicUsers',
    OWNERS: 'vetClinicOwners',
    PETS: 'vetClinicPets',
    VETERINARIANS: 'vetClinicVeterinarians',
    RECEPTIONISTS: 'vetClinicReceptionists',
    APPOINTMENTS: 'vetClinicAppointments',
    PET_MEDICAL_RECORDS: 'vetClinicPetMedicalRecords',
    COUNTERS: 'vetClinicCounters' // Key for ID counters
};

// Global object to map entity types to their prefixes for sequential IDs
const ENTITY_PREFIXES = {
    owners: 'OWN-',
    pets: 'PET-',
    veterinarians: 'VET-',
    receptionists: 'REC-',
    appointments: 'APP-',
    petMedicalRecords: 'PMR-'
};

/**
 * Loads data from local storage.
 * @param {string} key - The key for the data in local storage.
 * @returns {Array} Parsed data or an empty array if not found.
 */
function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

/**
 * Saves data to local storage.
 * @param {string} key - The key for the data in local storage.
 * @param {Array} data - The data array to save.
 */
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// --- Initial Data Setup ---
let users = loadData(STORAGE_KEYS.USERS);
let owners = loadData(STORAGE_KEYS.OWNERS);
let veterinarians = loadData(STORAGE_KEYS.VETERINARIANS);
let receptionists = loadData(STORAGE_KEYS.RECEPTIONISTS);
let appointments = loadData(STORAGE_KEYS.APPOINTMENTS);
let petMedicalRecords = loadData(STORAGE_KEYS.PET_MEDICAL_RECORDS);
let pets = loadData(STORAGE_KEYS.PETS);

// Check if any core data is missing to initialize dummy data
const needsDummyData = users.length === 0 && owners.length === 0 && veterinarians.length === 0 && receptionists.length === 0;

if (needsDummyData) {
    console.log('Initializing dummy data...');
    // Clear existing counters to start fresh with dummy data
    localStorage.removeItem(STORAGE_KEYS.COUNTERS);
    let currentCounters = {}; // Will build this up as we add dummy data

    // Helper for dummy data ID generation
    function getAndIncrementCounterForDummy(entityType) {
        const prefix = ENTITY_PREFIXES[entityType] || 'GEN-';
        if (!currentCounters[prefix]) {
            currentCounters[prefix] = 0;
        }
        currentCounters[prefix]++;
        return `${prefix}${String(currentCounters[prefix]).padStart(4, '0')}`;
    }

    // Dummy Vet
    const dummyVet = {
        id: getAndIncrementCounterForDummy('veterinarians'), fname: 'Dr. Alice', lname: 'Smith', specialization: 'Small Animals',
        phone_number: '111-222-3333', username: 'vet1', password: 'password', dob: '1985-01-15', address: '123 Vet St'
    };
    veterinarians.push(dummyVet);
    users.push({ username: dummyVet.username, password: dummyVet.password, role: 'vet', userId: dummyVet.id });

    // Dummy Receptionist
    const dummyReceptionist = {
        id: getAndIncrementCounterForDummy('receptionists'), username: 'reception1', password: 'password', fname: 'Bob', lname: 'Johnson',
        phone_number: '444-555-6666', address: '456 Clinic Ave', dob: '1990-03-20'
    };
    receptionists.push(dummyReceptionist);
    users.push({ username: dummyReceptionist.username, password: dummyReceptionist.password, role: 'receptionist', userId: dummyReceptionist.id });

    // Dummy Head Receptionist
    const dummyHeadReceptionist = {
        id: getAndIncrementCounterForDummy('receptionists'), username: 'headrec', password: 'password', fname: 'Carol', lname: 'Davis',
        phone_number: '777-888-9999', address: '789 Main Rd', dob: '1980-07-01'
    };
    receptionists.push(dummyHeadReceptionist); // Head receptionists are also receptionists in data
    users.push({ username: dummyHeadReceptionist.username, password: dummyHeadReceptionist.password, role: 'headreceptionist', userId: dummyHeadReceptionist.id });

    // Dummy Owner
    const dummyOwner = {
        id: getAndIncrementCounterForDummy('owners'), fname: 'John', lname: 'Doe', email: 'john@example.com',
        address: '101 Pet Lane', phone_number: '555-123-4567', username: 'john.doe', password: 'password'
    };
    owners.push(dummyOwner);
    users.push({ username: dummyOwner.username, password: dummyOwner.password, role: 'owner', userId: dummyOwner.id });

    // Dummy Pet for John Doe
    const dummyPet = {
        id: getAndIncrementCounterForDummy('pets'), name: 'Buddy', species: 'Dog', breed: 'Golden Retriever',
        dob: '2020-05-10', gender: 'Male', owner: dummyOwner.id
    };
    pets.push(dummyPet);

    // Dummy Medical Record for Buddy
    petMedicalRecords.push({
        record_id: getAndIncrementCounterForDummy('petMedicalRecords'), pet_id: dummyPet.id, visit_date: '2023-01-20',
        diagnosis: 'Routine checkup', treatment: 'N/A', medication: 'Flea prevention'
    });
    petMedicalRecords.push({
        record_id: getAndIncrementCounterForDummy('petMedicalRecords'), pet_id: dummyPet.id, visit_date: '2024-03-15',
        diagnosis: 'Ear infection', treatment: 'Cleaned ears', medication: 'Otic drops'
    });

    // Dummy Appointment (initially unassigned vet)
    appointments.push({
        id: getAndIncrementCounterForDummy('appointments'), datetime: '2025-07-15T10:00', reason: 'Vaccination',
        vet: '', // Initially unassigned
        pet: dummyPet.id, owner: dummyOwner.id
    });

    saveData(STORAGE_KEYS.USERS, users);
    saveData(STORAGE_KEYS.OWNERS, owners);
    saveData(STORAGE_KEYS.PETS, pets);
    saveData(STORAGE_KEYS.VETERINARIANS, veterinarians);
    saveData(STORAGE_KEYS.RECEPTIONISTS, receptionists);
    saveData(STORAGE_KEYS.APPOINTMENTS, appointments);
    saveData(STORAGE_KEYS.PET_MEDICAL_RECORDS, petMedicalRecords);
    saveData(STORAGE_KEYS.COUNTERS, currentCounters); // Save the final state of counters

    showMessage('Dummy data initialized for testing: vet1/password, reception1/password, headrec/password, john.doe/password', 'success');
} else {
    console.log('Existing data found in localStorage. Not initializing dummy data.');
}

let currentUser = null; // Stores the logged-in user object

// --- Authentication Functions ---
/**
 * Handles user login.
 */
function loginUser() {
    const loginInput = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    let user = users.find(u => u.username === loginInput && u.password === password);

    // If not found by username, try to find by email for owners
    if (!user) {
        const ownerUser = owners.find(o => o.email === loginInput && o.password === password);
        if (ownerUser) {
            // Find the corresponding user entry in the 'users' array using the owner's ID
            user = users.find(u => u.userId === ownerUser.id && u.role === 'owner');
        }
    }

    if (user) {
        currentUser = user;
        showMessage(`Welcome, ${loginInput}!`, 'success');
        redirectToDashboard(user.role);
    } else {
        showMessage('Invalid username/email or password.', 'error');
    }
}

/**
 * Handles new owner signup.
 */
function signupOwner() {
    const fname = document.getElementById('signupFname').value.trim();
    const lname = document.getElementById('signupLname').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const address = document.getElementById('signupAddress').value.trim();
    const phone_number = document.getElementById('signupPhone').value.trim();
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    if (!fname || !lname || !email || !address || !phone_number || !username || !password) {
        showMessage('All fields are required for sign up.', 'error');
        return;
    }

    // Check if username or email already exists (case-insensitive)
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase()) || owners.some(o => o.email.toLowerCase() === email.toLowerCase())) {
        showMessage('Username or Email already exists. Please choose a different one.', 'error');
        return;
    }

    const newOwner = {
        id: generateSequentialId('owners'),
        fname, lname, email, address, phone_number, password
    };
    owners.push(newOwner);
    users.push({ username: newOwner.username, password: newOwner.password, role: 'owner', userId: newOwner.id });

    saveData(STORAGE_KEYS.OWNERS, owners);
    saveData(STORAGE_KEYS.USERS, users);

    showMessage('Owner registered successfully! Please log in.', 'success');
    // Clear form fields
    document.getElementById('signupFname').value = '';
    document.getElementById('signupLname').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupAddress').value = '';
    document.getElementById('signupPhone').value = '';
    document.getElementById('signupUsername').value = '';
    document.getElementById('signupPassword').value = '';
    showPage('loginPage');
}

/**
 * Logs out the current user.
 */
function logoutUser() {
    currentUser = null;
    showMessage('Logged out successfully.', 'success');
    showPage('loginPage');
}

/**
 * Redirects the user to their respective dashboard based on their role.
 * @param {string} role - The role of the logged-in user.
 */
function redirectToDashboard(role) {
    switch (role) {
        case 'owner':
            showPage('ownerDashboard');
            break;
        case 'vet':
            showPage('vetDashboard');
            break;
        case 'receptionist':
            showPage('receptionistDashboard');
            break;
        case 'headreceptionist':
            showPage('headReceptionistDashboard');
            break;
        default:
            showPage('loginPage'); // Fallback
    }
}

// --- Owner Functions ---
/**
 * Handles registration of a new pet by the owner.
 */
function registerPet() {
    const name = document.getElementById('petName').value.trim();
    const species = document.getElementById('petSpecies').value.trim();
    const breed = document.getElementById('petBreed').value.trim();
    const dob = document.getElementById('petDob').value;
    const gender = document.getElementById('petGender').value;

    if (!name || !species || !breed || !dob || !gender) {
        showMessage('All pet fields are required.', 'error');
        return;
    }

    const newPet = {
        id: generateSequentialId('pets'),
        name, species, breed, dob, gender, owner: currentUser.userId
    };
    pets.push(newPet);
    saveData(STORAGE_KEYS.PETS, pets);

    showMessage(`${name} registered successfully! ID: ${newPet.id}`, 'success');
    // Clear form fields
    document.getElementById('petName').value = '';
    document.getElementById('petSpecies').value = '';
    document.getElementById('petBreed').value = '';
    document.getElementById('petDob').value = '';
    document.getElementById('petGender').value = '';
    showPage('ownerDashboard');
}

/**
 * Populates the pet selection dropdown for appointment requests.
 */
function populateAppointmentPetSelect() {
    const select = document.getElementById('appointmentPetSelect');
    select.innerHTML = '<option value="">Select Pet</option>'; // Clear existing options
    const ownerPets = pets.filter(p => p.owner === currentUser.userId);
    ownerPets.forEach(pet => {
        const option = document.createElement('option');
        option.value = pet.id;
        option.textContent = pet.name;
        select.appendChild(option);
    });
}

/**
 * Handles an owner's request for a new appointment.
 */
function requestAppointment() {
    const petId = document.getElementById('appointmentPetSelect').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const reason = document.getElementById('appointmentReason').value.trim();

    if (!petId || !date || !time || !reason) {
        showMessage('All appointment fields are required.', 'error');
        return;
    }

    const selectedPet = pets.find(p => p.id === petId);
    if (!selectedPet) {
        showMessage('Selected pet not found.', 'error');
        return;
    }

    const newAppointment = {
        id: generateSequentialId('appointments'),
        datetime: `${date}T${time}`,
        reason,
        vet: '', // Vet is NOT automatically assigned by owner
        pet: petId,
        owner: currentUser.userId
    };
    appointments.push(newAppointment);
    saveData(STORAGE_KEYS.APPOINTMENTS, appointments);

    showMessage('Appointment requested successfully! Receptionist will assign a vet. ID: ' + newAppointment.id, 'success');
    // Clear form fields
    document.getElementById('appointmentPetSelect').value = '';
    document.getElementById('appointmentDate').value = '';
    document.getElementById('appointmentTime').value = '';
    document.getElementById('appointmentReason').value = '';
    showPage('ownerDashboard');
}

/**
 * Displays the list of pets owned by the current user.
 */
function displayOwnerPets() {
    const tableBody = document.querySelector('#ownerMyPetsPage #ownerPetsList tbody');
    tableBody.innerHTML = ''; // Clear existing rows
    const ownerPets = pets.filter(p => p.owner === currentUser.userId);

    if (ownerPets.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500">No pets registered yet.</td></tr>';
        return;
    }

    ownerPets.forEach(pet => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${pet.id}</td>
            <td>${pet.name}</td>
            <td>${pet.species}</td>
            <td>${pet.breed}</td>
            <td>${pet.dob}</td>
            <td>${pet.gender}</td>
            <td><button class="btn btn-secondary btn-sm view-pet-details" data-pet-id="${pet.id}" data-caller-role="owner">View Details</button></td>
        `;
    });

    // Add event listeners for "View Details" buttons
    document.querySelectorAll('.view-pet-details').forEach(button => {
        button.onclick = (event) => {
            const petId = event.target.dataset.petId;
            const callerRole = event.target.dataset.callerRole;
            displayPetDetails(petId, callerRole);
        };
    });
}

/**
 * Displays detailed information and medical records for a specific pet.
 * @param {string} petId - The ID of the pet to display.
 * @param {string} callingRole - The role of the user who called this function (for back button redirection).
 */
function displayPetDetails(petId, callingRole) {
    const pet = pets.find(p => p.id === petId);
    if (!pet) {
        showMessage('Pet not found.', 'error');
        return;
    }

    const owner = owners.find(o => o.id === pet.owner);
    const petRecords = petMedicalRecords.filter(rec => rec.pet_id === petId);

    document.getElementById('displayPetId').textContent = pet.id;
    document.getElementById('displayPetName').textContent = pet.name;
    document.getElementById('displayPetSpecies').textContent = pet.species;
    document.getElementById('displayPetBreed').textContent = pet.breed;
    document.getElementById('displayPetDob').textContent = pet.dob;
    document.getElementById('displayPetGender').textContent = pet.gender;
    document.getElementById('displayPetOwnerName').textContent = owner ? `${owner.fname} ${owner.lname} (ID: ${owner.id})` : 'N/A';

    const recordsTableBody = document.querySelector('#petDetailsMedicalRecordsPage #petMedicalRecordsList tbody');
    recordsTableBody.innerHTML = ''; // Clear existing records

    if (petRecords.length === 0) {
        recordsTableBody.innerHTML = '<tr><td colspan="4" class="text-center text-gray-500">No medical records found for this pet.</td></tr>';
    } else {
        petRecords.forEach(record => {
            const row = recordsTableBody.insertRow();
            row.innerHTML = `
                <td>${record.visit_date}</td>
                <td>${record.diagnosis}</td>
                <td>${record.treatment}</td>
                <td>${record.medication}</td>
            `;
        });
    }

    // Set back button behavior based on who called this page
    const backBtn = document.getElementById('backFromPetDetails');
    backBtn.onclick = () => {
        if (callingRole === 'owner') {
            showPage('ownerMyPetsPage');
            displayOwnerPets(); // Refresh the list
        } else if (callingRole === 'vet') {
            showPage('vetViewPetPage');
            // When going back from pet details to vet's search page, hide the details section
            document.getElementById('vetPetDetailsDisplay').classList.add('hidden');
        } else if (callingRole === 'receptionist') {
            showPage('receptionistDashboard');
        } else if (callingRole === 'headreceptionist') {
            showPage('headReceptionistDashboard');
        } else {
            showPage('loginPage'); // Fallback
        }
    };
    showPage('petDetailsMedicalRecordsPage');
}

// --- Vet Functions ---
/**
 * Displays the list of appointments for the current veterinarian.
 */
function displayVetAppointments() {
    const tableBody = document.querySelector('#vetAppointmentsTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    const vetAppointments = appointments.filter(app => app.vet === currentUser.userId);

    if (vetAppointments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-gray-500">No appointments scheduled.</td></tr>';
        return;
    }

    vetAppointments.forEach(app => {
        const pet = pets.find(p => p.id === app.pet);
        const owner = owners.find(o => o.id === app.owner);
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${new Date(app.datetime).toLocaleString()}</td>
            <td>${owner ? owner.fname + ' ' + owner.lname : 'N/A'} (ID: ${app.owner})</td>
            <td>${pet ? pet.name : 'N/A'} (ID: ${app.pet})</td>
            <td>${app.reason}</td>
        `;
    });
}

/**
 * Searches for a pet by ID and displays its details for veterinarians.
 */
function searchVetPet() {
    const petId = document.getElementById('vetPetSearchId').value.trim();
    if (!petId) {
        showMessage('Please enter a Pet ID to search.', 'error');
        document.getElementById('vetPetDetailsDisplay').classList.add('hidden');
        return;
    }

    const pet = pets.find(p => p.id === petId);
    if (pet) {
        // Dynamically populate the pet details section within the vetViewPetPage
        const owner = owners.find(o => o.id === pet.owner);
        const petRecords = petMedicalRecords.filter(rec => rec.pet_id === petId);

        document.getElementById('vetPetDetailsDisplay').innerHTML = `
            <h3>Pet Information</h3>
            <div class="details-display mb-6">
                <p><strong>Pet ID:</strong> <span>${pet.id}</span></p>
                <p><strong>Name:</strong> <span>${pet.name}</span></p>
                <p><strong>Species:</strong> <span>${pet.species}</span></p>
                <p><strong>Breed:</strong> <span>${pet.breed}</span></p>
                <p><strong>Date of Birth:</strong> <span>${pet.dob}</span></p>
                <p><strong>Gender:</strong> <span>${pet.gender}</span></p>
                <p><strong>Owner:</strong> <span>${owner ? `${owner.fname} ${owner.lname} (ID: ${owner.id})` : 'N/A'}</span></p>
            </div>

            <h3>Medical Records</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Visit Date</th>
                            <th>Diagnosis</th>
                            <th>Treatment</th>
                            <th>Medication</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${petRecords.length === 0 ? '<tr><td colspan="4" class="text-center text-gray-500">No medical records found for this pet.</td></tr>' :
                            petRecords.map(record => `
                                <tr>
                                    <td>${record.visit_date}</td>
                                    <td>${record.diagnosis}</td>
                                    <td>${record.treatment}</td>
                                    <td>${record.medication}</td>
                                </tr>
                            `).join('')
                        }
                    </tbody>
                </table>
            </div>
        `;
        document.getElementById('vetPetDetailsDisplay').classList.remove('hidden');
    } else {
        showMessage('Pet not found with that ID.', 'error');
        document.getElementById('vetPetDetailsDisplay').classList.add('hidden');
    }
}

/**
 * Adds a new medical record for a pet.
 */
function addMedicalRecord() {
    const petId = document.getElementById('recordPetId').value.trim();
    const visitDate = document.getElementById('recordVisitDate').value;
    const diagnosis = document.getElementById('recordDiagnosis').value.trim();
    const treatment = document.getElementById('recordTreatment').value.trim();
    const medication = document.getElementById('recordMedication').value.trim();

    if (!petId || !visitDate || !diagnosis || !treatment || !medication) {
        showMessage('All medical record fields are required.', 'error');
        return;
    }

    const targetPet = pets.find(p => p.id === petId);
    if (!targetPet) {
        showMessage('Pet with the given ID does not exist.', 'error');
        return;
    }

    const newRecord = {
        record_id: generateSequentialId('petMedicalRecords'),
        pet_id: petId,
        visit_date: visitDate,
        diagnosis,
        treatment,
        medication
    };
    petMedicalRecords.push(newRecord);
    saveData(STORAGE_KEYS.PET_MEDICAL_RECORDS, petMedicalRecords);

    showMessage('Medical record added successfully! ID: ' + newRecord.record_id, 'success');
    // Clear form fields
    document.getElementById('recordPetId').value = '';
    document.getElementById('recordVisitDate').value = '';
    document.getElementById('recordDiagnosis').value = '';
    document.getElementById('recordTreatment').value = '';
    document.getElementById('recordMedication').value = '';
    showPage('vetDashboard');
}

// --- Generic Manage Entity Functions (for Receptionist/Head Receptionist) ---
let currentManagedEntityType = ''; // 'owners', 'veterinarians', 'pets', 'appointments', 'receptionists'
let currentManagedEntityData = [];
let currentManagedEntityAttributes = {};
let selectedEntityId = null; // ID of the currently selected item in the table

const ENTITY_CONFIGS = {
    owners: {
        title: 'Owners',
        dataKey: STORAGE_KEYS.OWNERS,
        attributes: {
            id: { label: 'ID', type: 'text', readOnly: true },
            fname: { label: 'First Name', type: 'text', required: true },
            lname: { label: 'Last Name', type: 'text', required: true },
            email: { label: 'Email', type: 'email', required: true },
            address: { label: 'Address', type: 'text', required: true },
            phone_number: { label: 'Phone Number', type: 'tel', required: true },
            username: { label: 'Username', type: 'text', required: true },
            password: { label: 'Password', type: 'password', required: true }
        }
    },
    veterinarians: {
        title: 'Veterinarians',
        dataKey: STORAGE_KEYS.VETERINARIANS,
        attributes: {
            id: { label: 'ID', type: 'text', readOnly: true },
            fname: { label: 'First Name', type: 'text', required: true },
            lname: { label: 'Last Name', type: 'text', required: true },
            specialization: { label: 'Specialization', type: 'text', required: true },
            phone_number: { label: 'Phone Number', type: 'tel', required: true },
            username: { label: 'Username', type: 'text', required: true },
            password: { label: 'Password', type: 'password', required: true },
            dob: { label: 'Date of Birth', type: 'date', required: true },
            address: { label: 'Address', type: 'text', required: true }
        }
    },
    pets: {
        title: 'Pets',
        dataKey: STORAGE_KEYS.PETS,
        attributes: {
            id: { label: 'ID', type: 'text', readOnly: true },
            name: { label: 'Name', type: 'text', required: true },
            species: { label: 'Species', type: 'text', required: true },
            breed: { label: 'Breed', type: 'text', required: true },
            dob: { label: 'Date of Birth', type: 'date', required: true },
            gender: { label: 'Gender', type: 'select', options: ['Male', 'Female'], required: true },
            owner: { label: 'Owner ID', type: 'text', required: true } // Receptionist needs to enter existing owner ID
        }
    },
    appointments: {
        title: 'Appointments',
        dataKey: STORAGE_KEYS.APPOINTMENTS,
        attributes: {
            id: { label: 'ID', type: 'text', readOnly: true },
            datetime: { label: 'Date & Time', type: 'datetime-local', required: true },
            reason: { label: 'Reason', type: 'textarea', required: true },
            vet: { label: 'Vet ID', type: 'text', required: false }, // Vet is not required on owner creation, but can be set by receptionist
            pet: { label: 'Pet ID', type: 'text', required: true },
            owner: { label: 'Owner ID', type: 'text', required: true }
        }
    },
    receptionists: {
        title: 'Receptionists',
        dataKey: STORAGE_KEYS.RECEPTIONISTS,
        attributes: {
            id: { label: 'ID', type: 'text', readOnly: true },
            username: { label: 'Username', type: 'text', required: true },
            password: { label: 'Password', type: 'password', required: true },
            fname: { label: 'First Name', type: 'text', required: true },
            lname: { label: 'Last Name', type: 'text', required: true },
            phone_number: { label: 'Phone Number', type: 'tel', required: true },
            address: { label: 'Address', type: 'text', required: true },
            dob: { label: 'Date of Birth', type: 'date', required: true }
        }
    }
};

/**
 * Sets up the generic manage entity page based on the entity type.
 * @param {string} entityType - The type of entity to manage (e.g., 'owners').
 */
function setupManageEntityPage(entityType) {
    currentManagedEntityType = entityType;
    const config = ENTITY_CONFIGS[entityType];
    document.getElementById('manageEntityTitle').textContent = `Manage ${config.title}`;
    currentManagedEntityAttributes = config.attributes;

    // Load data
    currentManagedEntityData = loadData(config.dataKey);

    // Clear input fields and selected ID
    clearManageEntityForm();
    selectedEntityId = null;

    // Populate table
    populateManageEntityTable(currentManagedEntityData, Object.keys(config.attributes));

    // Generate input fields
    generateManageEntityInputFields(config.attributes);

    showPage('manageEntityPage');
}

/**
 * Populates the entity table on the manage entity page.
 * @param {Array} data - The data array for the current entity type.
 * @param {Array} attributeKeys - The keys of attributes to display as columns.
 */
function populateManageEntityTable(data, attributeKeys) {
    const tableHeader = document.getElementById('manageEntityTableHeader');
    const tableBody = document.getElementById('manageEntityTableBody');
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    // Create table headers
    attributeKeys.forEach(attrKey => {
        const th = document.createElement('th');
        th.textContent = ENTITY_CONFIGS[currentManagedEntityType].attributes[attrKey].label;
        tableHeader.appendChild(th);
    });

    // Create table rows
    if (data.length === 0) {
        const row = tableBody.insertRow();
        row.innerHTML = `<td colspan="${attributeKeys.length}" class="text-center text-gray-500 py-4">No ${ENTITY_CONFIGS[currentManagedEntityType].title.toLowerCase()} found.</td>`;
        return;
    }

    data.forEach(item => {
        const row = tableBody.insertRow();
        row.dataset.id = item.id; // Store ID on the row for selection
        row.classList.add('hover-bg-blue-50'); // Add hover effect
        attributeKeys.forEach(attrKey => {
            const cell = row.insertCell();
            let displayValue = item[attrKey];
            // Special handling for linked IDs for better display
            if (attrKey === 'owner' && item[attrKey]) {
                const owner = owners.find(o => o.id === item[attrKey]);
                displayValue = owner ? `${owner.fname} ${owner.lname} (ID: ${item[attrKey]})` : `Unknown Owner (ID: ${item[attrKey]})`;
            } else if (attrKey === 'pet' && item[attrKey]) {
                const pet = pets.find(p => p.id === item[attrKey]);
                displayValue = pet ? `${pet.name} (ID: ${item[attrKey]})` : `Unknown Pet (ID: ${item[attrKey]})`;
            } else if (attrKey === 'vet' && item[attrKey]) {
                const vet = veterinarians.find(v => v.id === item[attrKey]);
                displayValue = vet ? `${vet.fname} ${vet.lname} (ID: ${item[attrKey]})` : `Unassigned`; // Display "Unassigned" if vet ID is empty
            } else if (attrKey === 'datetime' && item[attrKey]) {
                displayValue = new Date(item[attrKey]).toLocaleString();
            } else if (attrKey === 'password') {
                displayValue = '********'; // Hide passwords
            }
            cell.textContent = displayValue;
        });
        row.onclick = () => selectEntityForEdit(item.id);
    });
}

/**
 * Dynamically generates input fields for the manage entity form.
 * @param {object} attributes - Configuration for entity attributes.
 */
function generateManageEntityInputFields(attributes) {
    const inputFieldsContainer = document.getElementById('manageEntityInputFields');
    inputFieldsContainer.innerHTML = ''; // Clear existing fields

    for (const key in attributes) {
        const attr = attributes[key];
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.setAttribute('for', `manage-${key}`);
        label.textContent = attr.label + ':';
        formGroup.appendChild(label);

        let inputElement;
        if (attr.type === 'select') {
            inputElement = document.createElement('select');
            inputElement.id = `manage-${key}`;
            // Removed Tailwind classes, using pure CSS classes
            inputElement.classList.add('form-input');
            if (attr.required) inputElement.setAttribute('required', 'true');
            attr.options.forEach(optionValue => {
                const option = document.createElement('option');
                option.value = optionValue;
                option.textContent = optionValue;
                inputElement.appendChild(option);
            });
        } else if (attr.type === 'textarea') {
            inputElement = document.createElement('textarea');
            inputElement.id = `manage-${key}`;
            // Removed Tailwind classes, using pure CSS classes
            inputElement.classList.add('form-input');
            inputElement.rows = 3;
            if (attr.required) inputElement.setAttribute('required', 'true');
        } else {
            inputElement = document.createElement('input');
            inputElement.type = attr.type;
            inputElement.id = `manage-${key}`;
            // Removed Tailwind classes, using pure CSS classes
            inputElement.classList.add('form-input');
            if (attr.required) inputElement.setAttribute('required', 'true');
        }

        if (attr.readOnly) {
            inputElement.setAttribute('readonly', 'true');
            inputElement.classList.add('readonly-input'); // Custom class for readonly styling
        }
        formGroup.appendChild(inputElement);
        inputFieldsContainer.appendChild(formGroup);
    }
}

/**
 * Clears all input fields in the manage entity form and deselects any row.
 */
function clearManageEntityForm() {
    const inputFieldsContainer = document.getElementById('manageEntityInputFields');
    inputFieldsContainer.querySelectorAll('input, select, textarea').forEach(input => {
        input.value = '';
    });
    selectedEntityId = null;
    // Remove selected class from table rows
    document.querySelectorAll('#manageEntityTableBody tr').forEach(row => {
        row.classList.remove('table-row-selected');
    });
}

/**
 * Selects an entity from the table and populates the form fields for editing.
 * @param {string} id - The ID of the entity to select.
 */
function selectEntityForEdit(id) {
    selectedEntityId = id;
    const selectedItem = currentManagedEntityData.find(item => item.id === id);

    // Remove selected class from all rows
    document.querySelectorAll('#manageEntityTableBody tr').forEach(row => {
        row.classList.remove('table-row-selected');
    });
    // Add selected class to the clicked row
    const clickedRow = document.querySelector(`#manageEntityTableBody tr[data-id="${id}"]`);
    if (clickedRow) {
        clickedRow.classList.add('table-row-selected');
    }

    if (selectedItem) {
        for (const key in currentManagedEntityAttributes) {
            const input = document.getElementById(`manage-${key}`);
            if (input) {
                if (key === 'password') {
                    input.value = ''; // Never pre-fill password for security
                } else {
                    input.value = selectedItem[key] || '';
                }
            }
        }
    }
}

/**
 * Retrieves data from the manage entity form fields.
 * @returns {object} An object containing form data.
 */
function getManageEntityFormData() {
    const formData = {};
    for (const key in currentManagedEntityAttributes) {
        const input = document.getElementById(`manage-${key}`);
        if (input) {
            formData[key] = input.value.trim();
        }
    }
    return formData;
}

/**
 * Adds a new entity to the current managed entity type.
 */
function addManageEntity() {
    const newData = getManageEntityFormData();

    let missingFields = [];
    for (const key in currentManagedEntityAttributes) {
        const attr = currentManagedEntityAttributes[key];
        const value = newData[key];

        if (attr.readOnly) {
            continue; // Skip validation for readOnly fields
        }

        // Check if required and empty
        if (attr.required && !value) {
            missingFields.push(attr.label);
        }
    }

    if (missingFields.length > 0) {
        showMessage(`Please fill the following required fields: ${missingFields.join(', ')}.`, 'error');
        return;
    }

    // Generate ID before adding to specific data structures
    newData.id = generateSequentialId(currentManagedEntityType);

    // Special handling for user roles (username/email uniqueness)
    if (currentManagedEntityType === 'owners' || currentManagedEntityType === 'veterinarians' || currentManagedEntityType === 'receptionists') {
        const usernameLower = newData.username.toLowerCase();
        if (users.some(u => u.username.toLowerCase() === usernameLower)) {
            showMessage('Username already exists. Please choose a different username.', 'error');
            return;
        }

        if (currentManagedEntityType === 'owners') {
            const emailLower = newData.email.toLowerCase();
            if (owners.some(o => o.email.toLowerCase() === emailLower)) {
                showMessage('Email already exists for another owner. Please use a different email.', 'error');
                return;
            }
        }

        // Add to users array for login
        users.push({ username: newData.username, password: newData.password, role: currentManagedEntityType.slice(0, -1), userId: newData.id });
        saveData(STORAGE_KEYS.USERS, users);
    }

    // Add to specific entity data array
    currentManagedEntityData.push(newData);
    saveData(ENTITY_CONFIGS[currentManagedEntityType].dataKey, currentManagedEntityData);

    showMessage(`${ENTITY_CONFIGS[currentManagedEntityType].title.slice(0, -1)} added successfully! ID: ${newData.id}`, 'success');
    clearManageEntityForm();
    populateManageEntityTable(currentManagedEntityData, Object.keys(currentManagedEntityAttributes));
}

/**
 * Updates an existing entity.
 */
function updateManageEntity() {
    if (!selectedEntityId) {
        showMessage('Please select an item from the table to update.', 'error');
        return;
    }

    const updatedData = getManageEntityFormData();
    const index = currentManagedEntityData.findIndex(item => item.id === selectedEntityId);

    if (index !== -1) {
        let missingFields = [];
        for (const key in currentManagedEntityAttributes) {
            const attr = currentManagedEntityAttributes[key];
            const value = updatedData[key];

            if (attr.readOnly) {
                continue;
            }
            // For updates, password is not strictly required if left blank, but other required fields are.
            if (attr.required && key !== 'password' && !value) {
                missingFields.push(attr.label);
            }
        }

        if (missingFields.length > 0) {
            showMessage(`Please fill the following required fields: ${missingFields.join(', ')}.`, 'error');
            return;
        }

        // Update specific attributes, allowing ID to remain unchanged
        for (const key in updatedData) {
            if (key !== 'id') { // Don't allow changing ID
                currentManagedEntityData[index][key] = updatedData[key];
            }
        }

        // Special handling for user roles: update username/password/email in users/owners array
        if (currentManagedEntityType === 'owners' || currentManagedEntityType === 'veterinarians' || currentManagedEntityType === 'receptionists') {
            const userIndex = users.findIndex(u => u.userId === selectedEntityId);
            if (userIndex !== -1) {
                // Check if username is being changed to an existing one (excluding self, case-insensitive)
                const usernameLower = updatedData.username.toLowerCase();
                if (users.some(u => u.username.toLowerCase() === usernameLower && u.userId !== selectedEntityId)) {
                    showMessage('Username already exists. Please choose a different username.', 'error');
                    return;
                }
                users[userIndex].username = updatedData.username;
                if (updatedData.password) { // Only update password if provided
                    users[userIndex].password = updatedData.password;
                }
                saveData(STORAGE_KEYS.USERS, users);
            }

            // For owners, also update email in the owners array and check for uniqueness (case-insensitive)
            if (currentManagedEntityType === 'owners') {
                const ownerIndex = owners.findIndex(o => o.id === selectedEntityId);
                if (ownerIndex !== -1) {
                    const emailLower = updatedData.email.toLowerCase();
                    if (owners.some(o => o.email.toLowerCase() === emailLower && o.id !== selectedEntityId)) {
                        showMessage('Email already exists for another owner. Please use a different email.', 'error');
                        return;
                    }
                    owners[ownerIndex].email = updatedData.email;
                    if (updatedData.password) { // Password is also part of owner data, so update it if provided
                        owners[ownerIndex].password = updatedData.password;
                    }
                    saveData(STORAGE_KEYS.OWNERS, owners);
                }
            }
        }

        saveData(ENTITY_CONFIGS[currentManagedEntityType].dataKey, currentManagedEntityData);
        showMessage(`${ENTITY_CONFIGS[currentManagedEntityType].title.slice(0, -1)} updated successfully!`, 'success');
        clearManageEntityForm();
        populateManageEntityTable(currentManagedEntityData, Object.keys(currentManagedEntityAttributes));
    } else {
        showMessage('Selected item not found.', 'error');
    }
}

/**
 * Removes an existing entity.
 */
function removeManageEntity() {
    if (!selectedEntityId) {
        showMessage('Please select an item from the table to remove.', 'error');
        return;
    }

    // Custom confirmation dialog (since alert/confirm are blocked in Canvas sometimes)
    const confirmDelete = window.confirm(`Are you sure you want to remove this ${ENTITY_CONFIGS[currentManagedEntityType].title.slice(0, -1)}?`);
    if (!confirmDelete) return;

    currentManagedEntityData = currentManagedEntityData.filter(item => item.id !== selectedEntityId);

    // Special handling for user roles: remove from users array
    if (currentManagedEntityType === 'owners' || currentManagedEntityType === 'veterinarians' || currentManagedEntityType === 'receptionists') {
        users = users.filter(u => u.userId !== selectedEntityId);
        saveData(STORAGE_KEYS.USERS, users);
    }

    saveData(ENTITY_CONFIGS[currentManagedEntityType].dataKey, currentManagedEntityData);
    showMessage(`${ENTITY_CONFIGS[currentManagedEntityType].title.slice(0, -1)} removed successfully!`, 'success');
    clearManageEntityForm();
    populateManageEntityTable(currentManagedEntityData, Object.keys(currentManagedEntityAttributes));
}


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    showPage('loginPage'); // Start on the login page

    // Login/Signup Page
    document.getElementById('loginBtn').addEventListener('click', loginUser);
    document.getElementById('goToSignupBtn').addEventListener('click', () => showPage('signupPage'));
    document.getElementById('signupBtn').addEventListener('click', signupOwner);
    document.getElementById('backToLoginBtn').addEventListener('click', () => showPage('loginPage'));

    // Owner Dashboard
    document.getElementById('ownerRegisterPetBtn').addEventListener('click', () => showPage('ownerRegisterPetPage'));
    document.getElementById('ownerMakeAppointmentBtn').addEventListener('click', () => {
        populateAppointmentPetSelect();
        showPage('ownerMakeAppointmentPage');
    });
    document.getElementById('ownerMyPetsBtn').addEventListener('click', () => {
        displayOwnerPets();
        showPage('ownerMyPetsPage');
    });
    document.getElementById('ownerLogoutBtn').addEventListener('click', logoutUser);

    // Owner Sub-pages
    document.getElementById('registerPetSubmitBtn').addEventListener('click', registerPet);
    document.getElementById('backToOwnerDashboardFromRegisterPet').addEventListener('click', () => showPage('ownerDashboard'));
    document.getElementById('requestAppointmentBtn').addEventListener('click', requestAppointment);
    document.getElementById('backToOwnerDashboardFromAppointment').addEventListener('click', () => showPage('ownerDashboard'));
    document.getElementById('backToOwnerDashboardFromMyPets').addEventListener('click', () => showPage('ownerDashboard'));

    // Vet Dashboard
    document.getElementById('vetViewAppointmentsBtn').addEventListener('click', () => {
        displayVetAppointments();
        showPage('vetViewAppointmentsPage');
    });
    document.getElementById('vetViewPetBtn').addEventListener('click', () => {
        document.getElementById('vetPetSearchId').value = ''; // Clear search field
        document.getElementById('vetPetDetailsDisplay').classList.add('hidden'); // Hide previous results
        showPage('vetViewPetPage');
    });
    document.getElementById('vetAddRecordsBtn').addEventListener('click', () => showPage('vetAddRecordPage'));
    document.getElementById('vetLogoutBtn').addEventListener('click', logoutUser);

    // Vet Sub-pages
    document.getElementById('backToVetDashboardFromAppointments').addEventListener('click', () => showPage('vetDashboard'));
    document.getElementById('vetSearchPetBtn').addEventListener('click', searchVetPet);
    document.getElementById('backToVetDashboardFromViewPet').addEventListener('click', (event) => {
        const callerRole = event.target.dataset.callerRole || 'vet'; // Default to 'vet' if not set
        if (callerRole === 'receptionist') {
            showPage('receptionistDashboard');
        } else if (callerRole === 'headreceptionist') {
            showPage('headReceptionistDashboard');
        } else {
            showPage('vetDashboard');
        }
        document.getElementById('vetPetDetailsDisplay').classList.add('hidden'); // Hide details when going back
    });
    document.getElementById('addRecordSubmitBtn').addEventListener('click', addMedicalRecord);
    document.getElementById('backToVetDashboardFromAddRecord').addEventListener('click', () => showPage('vetDashboard'));

    // Receptionist Dashboard
    document.getElementById('receptionistManageOwnersBtn').addEventListener('click', () => setupManageEntityPage('owners'));
    document.getElementById('receptionistManageVetsBtn').addEventListener('click', () => setupManageEntityPage('veterinarians'));
    document.getElementById('receptionistManagePetsBtn').addEventListener('click', () => setupManageEntityPage('pets'));
    document.getElementById('receptionistManageAppointmentsBtn').addEventListener('click', () => setupManageEntityPage('appointments'));
    document.getElementById('receptionistViewPetRecordsBtn').addEventListener('click', () => {
        document.getElementById('vetPetSearchId').value = ''; // Clear search field
        document.getElementById('vetPetDetailsDisplay').classList.add('hidden'); // Hide previous results
        showPage('vetViewPetPage');
        // Set a data attribute on the back button to indicate the caller's role
        document.getElementById('backToVetDashboardFromViewPet').dataset.callerRole = 'receptionist';
    });
    document.getElementById('receptionistLogoutBtn').addEventListener('click', logoutUser);

    // Head Receptionist Dashboard
    document.getElementById('headReceptionistManageOwnersBtn').addEventListener('click', () => setupManageEntityPage('owners'));
    document.getElementById('headReceptionistManageVetsBtn').addEventListener('click', () => setupManageEntityPage('veterinarians'));
    document.getElementById('headReceptionistManagePetsBtn').addEventListener('click', () => setupManageEntityPage('pets'));
    document.getElementById('headReceptionistManageAppointmentsBtn').addEventListener('click', () => setupManageEntityPage('appointments'));
    document.getElementById('headReceptionistViewPetRecordsBtn').addEventListener('click', () => {
        document.getElementById('vetPetSearchId').value = ''; // Clear search field
        document.getElementById('vetPetDetailsDisplay').classList.add('hidden'); // Hide previous results
        showPage('vetViewPetPage');
        // Set a data attribute on the back button to indicate the caller's role
        document.getElementById('backToVetDashboardFromViewPet').dataset.callerRole = 'headreceptionist';
    });
    document.getElementById('headReceptionistManageReceptionistsBtn').addEventListener('click', () => setupManageEntityPage('receptionists'));
    document.getElementById('headReceptionistLogoutBtn').addEventListener('click', logoutUser);

    // Generic Manage Entity Page Buttons
    document.getElementById('manageEntityAddBtn').addEventListener('click', addManageEntity);
    document.getElementById('manageEntityUpdateBtn').addEventListener('click', updateManageEntity);
    document.getElementById('manageEntityRemoveBtn').addEventListener('click', removeManageEntity);
    document.getElementById('manageEntityBackBtn').addEventListener('click', () => {
        // Determine which dashboard to go back to based on current user role
        if (currentUser) {
            redirectToDashboard(currentUser.role);
        } else {
            showPage('loginPage');
        }
    });
    document.getElementById('manageEntitySearchBtn').addEventListener('click', () => {
        const searchId = document.getElementById('manageEntitySearchId').value.trim();
        if (searchId) {
            const foundItem = currentManagedEntityData.find(item => item.id.toLowerCase() === searchId.toLowerCase()); // Case-insensitive search for ID
            if (foundItem) {
                populateManageEntityTable([foundItem], Object.keys(currentManagedEntityAttributes));
                selectEntityForEdit(foundItem.id);
                showMessage('Item found and displayed.', 'success');
            } else {
                populateManageEntityTable([], Object.keys(currentManagedEntityAttributes)); // Clear table if not found
                clearManageEntityForm();
                showMessage('No item found with that ID.', 'error');
            }
        } else {
            populateManageEntityTable(currentManagedEntityData, Object.keys(currentManagedEntityAttributes)); // Show all if search is empty
            clearManageEntityForm();
            showMessage('Displaying all items.', 'info');
        }
    });

    // Optional: Side menu toggle (uncomment if you add the side menu HTML)
    /*
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');

    if (menuToggle && sideMenu && overlay) {
        menuToggle.addEventListener('click', () => {
            sideMenu.classList.toggle('open');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            sideMenu.classList.remove('open');
            overlay.classList.remove('active');
        });
    }
    */
});
