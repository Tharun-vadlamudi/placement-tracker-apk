// =====================================================
// PLACEMENT TRACKER
// =====================================================


// =====================================================
// DATA
// =====================================================

let companies = JSON.parse(
    localStorage.getItem("companies")
) || [];

let myCompanies = JSON.parse(
    localStorage.getItem("myCompanies")
) || [];

let reminders = JSON.parse(
    localStorage.getItem("reminders")
) || [];


// Current company filter
let currentFilter = "all";


// =====================================================
// ANDROID LOCAL NOTIFICATIONS
// =====================================================

const LocalNotifications =
    window.Capacitor?.Plugins?.LocalNotifications;


// =====================================================
// INITIALIZE NOTIFICATIONS
// =====================================================

async function initializeNotifications() {

    if (!LocalNotifications) {

        console.warn(
            "Local Notifications plugin is not available."
        );

        return false;
    }

    try {

        let permission =
            await LocalNotifications.checkPermissions();


        if (permission.display !== "granted") {

            permission =
                await LocalNotifications.requestPermissions();

        }


        if (permission.display !== "granted") {

            console.warn(
                "Notification permission was not granted."
            );

            return false;
        }


        console.log(
            "Notification permission granted."
        );


        return true;

    } catch (error) {

        console.error(
            "Notification initialization failed:",
            error
        );

        return false;
    }
}


// =====================================================
// SCHEDULE REMINDER NOTIFICATION
// =====================================================

async function scheduleReminderNotification(reminder) {

    if (!LocalNotifications) {

        console.warn(
            "Local Notifications plugin is not available."
        );

        return false;
    }


    try {

        const reminderDate =
            new Date(
                `${reminder.date}T${reminder.time}:00`
            );


        if (
            isNaN(
                reminderDate.getTime()
            )
        ) {

            console.error(
                "Invalid reminder date/time."
            );

            return false;
        }


        if (
            reminderDate <= new Date()
        ) {

            console.warn(
                "Reminder time has already passed."
            );

            return false;
        }


        // Android notification ID
        const notificationId =
            Number(
                reminder.id % 2147483647
            );


        await LocalNotifications.schedule({

            notifications: [

                {

                    id: notificationId,

                    title:
                        "Placement Tracker",

                    body:
                        `${reminder.type} reminder for ${reminder.company}`,

                    schedule: {

                        at: reminderDate,

                        allowWhileIdle: true

                    },

                    sound:
                        "default",

                    autoCancel:
                        true,

                    extra: {

                        reminderId:
                            reminder.id,

                        company:
                            reminder.company,

                        type:
                            reminder.type

                    }

                }

            ]

        });


        console.log(
            "Reminder scheduled:",
            reminderDate
        );


        return true;

    } catch (error) {

        console.error(
            "Failed to schedule reminder:",
            error
        );

        return false;
    }
}


// =====================================================
// SCHEDULE ALL EXISTING REMINDERS
// =====================================================

async function scheduleExistingReminders() {

    if (!LocalNotifications) {
        return;
    }


    const now =
        new Date();


    for (
        const reminder of reminders
    ) {

        const reminderDate =
            new Date(
                `${reminder.date}T${reminder.time}:00`
            );


        if (
            !isNaN(
                reminderDate.getTime()
            ) &&
            reminderDate > now
        ) {

            await scheduleReminderNotification(
                reminder
            );

        }

    }
}


// =====================================================
// SAVE DATA
// =====================================================

function saveData() {

    localStorage.setItem(
        "companies",
        JSON.stringify(companies)
    );


    localStorage.setItem(
        "myCompanies",
        JSON.stringify(myCompanies)
    );


    localStorage.setItem(
        "reminders",
        JSON.stringify(reminders)
    );
}


// =====================================================
// PAGE NAVIGATION
// =====================================================

function showPage(
    pageId,
    button
) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove(
                "active"
            );

        });


    const page =
        document.getElementById(
            pageId
        );


    if (page) {

        page.classList.add(
            "active"
        );

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });


    if (button) {

        button.classList.add(
            "active"
        );

    }
}


// =====================================================
// DASHBOARD
// =====================================================

function updateDashboard() {

    const total =
        companies.length;


    const pending =
        companies.filter(
            company =>
                company.status ===
                "pending"
        ).length;


    const accepted =
        companies.filter(
            company =>
                company.status ===
                "accepted"
        ).length;


    const rejected =
        companies.filter(
            company =>
                company.status ===
                "rejected"
        ).length;


    const totalElement =
        document.getElementById(
            "totalCompanies"
        );


    const pendingElement =
        document.getElementById(
            "pendingCompanies"
        );


    const acceptedElement =
        document.getElementById(
            "acceptedCompanies"
        );


    const rejectedElement =
        document.getElementById(
            "rejectedCompanies"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (pendingElement) {

        pendingElement.textContent =
            pending;

    }


    if (acceptedElement) {

        acceptedElement.textContent =
            accepted;

    }


    if (rejectedElement) {

        rejectedElement.textContent =
            rejected;

    }
}


// =====================================================
// RENDER COMPANIES
// =====================================================

function renderCompanies() {

    const list =
        document.getElementById(
            "companyList"
        );


    if (!list) return;


    list.innerHTML = "";


    // =================================================
    // SORT COMPANIES BY APPLICATION DATE
    // NEWEST → OLDEST
    // =================================================

    let filteredCompanies =
        [...companies].sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


    // =================================================
    // FILTER BY STATUS
    // =================================================

    if (
        currentFilter !==
        "all"
    ) {

        filteredCompanies =
            filteredCompanies.filter(
                company =>
                    company.status ===
                    currentFilter
            );

    }


    // =================================================
    // SEARCH
    // =================================================

    const searchInput =
        document.getElementById(
            "companySearch"
        );


    if (searchInput) {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();


        if (search) {

            filteredCompanies =
                filteredCompanies.filter(
                    company =>
                        company.name
                            .toLowerCase()
                            .includes(search)
                );

        }

    }


    // =================================================
    // EMPTY STATE
    // =================================================

    if (
        filteredCompanies.length ===
        0
    ) {

        list.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    🏢
                </div>

                <p>
                    No companies found.
                </p>

            </div>

        `;

        return;
    }


    // =================================================
    // CREATE COMPANY CARDS
    // =================================================

    filteredCompanies.forEach(
        company => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            card.innerHTML = `

                <div class="card-top">

                    <div>

                        <div class="company-title">

                            🏢

                            ${escapeHTML(
                company.name
            )}

                        </div>


                        <div class="card-info">

                            📅 Applied:

                            ${formatDate(
                company.date
            )}

                        </div>

                    </div>


                    <span
                        class="status
                        ${company.status}"
                    >

                        ${capitalize(
                company.status
            )}

                    </span>

                </div>


                <div class="status-buttons">

                    <button
                        class="status-btn reject-btn"
                        onclick="
                            changeStatus(
                                ${company.id},
                                'rejected'
                            )
                        "
                    >

                        🔴 Rejected

                    </button>


                    <button
                        class="status-btn pending-btn"
                        onclick="
                            changeStatus(
                                ${company.id},
                                'pending'
                            )
                        "
                    >

                        🟡 Pending

                    </button>


                    <button
                        class="status-btn accept-btn"
                        onclick="
                            changeStatus(
                                ${company.id},
                                'accepted'
                            )
                        "
                    >

                        🟢 Accepted

                    </button>

                </div>


                <div class="my-company-actions">

                    <button
                        class="delete-btn"
                        onclick="
                            deleteCompany(
                                ${company.id}
                            )
                        "
                    >

                        🗑️ Delete

                    </button>

                </div>

            `;


            list.appendChild(
                card
            );

        }
    );
}


// =====================================================
// SEARCH
// =====================================================

function searchCompanies() {

    renderCompanies();

}


// =====================================================
// FILTER
// =====================================================

function filterCompanies(
    filter,
    button
) {

    currentFilter =
        filter;


    document
        .querySelectorAll(
            ".filter"
        )
        .forEach(item => {

            item.classList.remove(
                "active-filter"
            );

        });


    if (button) {

        button.classList.add(
            "active-filter"
        );

    }


    renderCompanies();
}


// =====================================================
// CHANGE STATUS
// =====================================================

function changeStatus(
    id,
    status
) {

    const company =
        companies.find(
            company =>
                company.id ===
                id
        );


    if (!company) return;


    company.status =
        status;


    saveData();


    renderCompanies();

    renderMyCompanies();

    updateDashboard();
}


// =====================================================
// DELETE COMPANY
// =====================================================

function deleteCompany(id) {

    const company =
        companies.find(
            company =>
                company.id ===
                id
        );


    if (!company) return;


    const confirmed =
        confirm(
            `Are you sure you want to delete ${company.name}?`
        );


    if (!confirmed) return;


    // Remove company
    companies =
        companies.filter(
            company =>
                company.id !==
                id
        );


    // Remove company from My Companies
    myCompanies =
        myCompanies.filter(
            companyId =>
                companyId !==
                id
        );


    saveData();


    renderCompanies();

    renderMyCompanies();

    updateDashboard();
}


// =====================================================
// RENDER MY COMPANIES
// =====================================================

function renderMyCompanies() {

    const list =
        document.getElementById(
            "myCompanyList"
        );


    if (!list) return;


    list.innerHTML = "";


    // Sort My Companies by application date
    const selectedCompanies =
        companies
            .filter(
                company =>
                    myCompanies.includes(
                        company.id
                    )
            )
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            );


    if (
        selectedCompanies.length ===
        0
    ) {

        list.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    ⭐
                </div>

                <p>
                    No companies selected.
                </p>

            </div>

        `;

        return;
    }


    selectedCompanies.forEach(
        company => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            card.innerHTML = `

                <div class="card-top">

                    <div class="company-title">

                        🏢

                        ${escapeHTML(
                company.name
            )}

                    </div>


                    <span
                        class="status
                        ${company.status}"
                    >

                        ${capitalize(
                company.status
            )}

                    </span>

                </div>


                <div class="card-info">

                    📅 Applied:

                    ${formatDate(
                company.date
            )}

                </div>


                <div class="my-company-actions">

                    <button
                        class="delete-btn"
                        onclick="
                            removeFromMyCompanies(
                                ${company.id}
                            )
                        "
                    >

                        🗑️ Remove

                    </button>

                </div>

            `;


            list.appendChild(
                card
            );

        }
    );
}


// =====================================================
// REMOVE FROM MY COMPANIES
// =====================================================

function removeFromMyCompanies(id) {

    const confirmed =
        confirm(
            "Remove this company from My Companies?"
        );


    if (!confirmed) return;


    myCompanies =
        myCompanies.filter(
            companyId =>
                companyId !==
                id
        );


    saveData();


    renderMyCompanies();
}


// =====================================================
// COMPANY MODAL
// =====================================================

function openCompanyModal() {

    const modal =
        document.getElementById(
            "companyModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }
}


function closeCompanyModal() {

    const modal =
        document.getElementById(
            "companyModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }
}


// =====================================================
// ADD COMPANY
// =====================================================

function addCompany() {

    const nameInput =
        document.getElementById(
            "companyName"
        );


    const dateInput =
        document.getElementById(
            "applicationDate"
        );


    const name =
        nameInput.value.trim();


    const date =
        dateInput.value;


    if (!name) {

        alert(
            "Please enter the company name."
        );

        return;
    }


    if (!date) {

        alert(
            "Please select the application date."
        );

        return;
    }


    // Check duplicate
    const duplicate =
        companies.some(
            company =>
                company.name
                    .toLowerCase()
                ===
                name.toLowerCase()
        );


    if (duplicate) {

        alert(
            "This company already exists."
        );

        return;
    }


    const newId =
        Date.now();


    companies.push({

        id:
            newId,

        name:
            name,

        date:
            date,

        status:
            "pending"

    });


    // Automatically add to My Companies
    myCompanies.push(
        newId
    );


    saveData();


    nameInput.value =
        "";

    dateInput.value =
        "";


    closeCompanyModal();


    renderCompanies();

    renderMyCompanies();

    updateDashboard();
}


// =====================================================
// REMINDERS
// =====================================================

function renderReminders() {

    const list =
        document.getElementById(
            "reminderList"
        );


    if (!list) return;


    list.innerHTML = "";


    if (
        reminders.length ===
        0
    ) {

        list.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    🔔
                </div>

                <p>
                    No reminders available.
                </p>

            </div>

        `;

        return;
    }


    // Sort reminders by date and time
    const sortedReminders =
        [...reminders].sort(
            (a, b) => {

                const dateA =
                    new Date(
                        `${a.date}T${a.time}:00`
                    );

                const dateB =
                    new Date(
                        `${b.date}T${b.time}:00`
                    );

                return dateA - dateB;

            }
        );


    sortedReminders.forEach(
        reminder => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            card.innerHTML = `

                <div class="card-top">

                    <div class="company-title">

                        🏢

                        ${escapeHTML(
                reminder.company
            )}

                    </div>


                    <button
                        class="delete-btn"
                        onclick="
                            deleteReminder(
                                ${reminder.id}
                            )
                        "
                    >

                        🗑️

                    </button>

                </div>


                <div class="card-info">

                    <div>

                        📌

                        ${escapeHTML(
                reminder.type
            )}

                    </div>


                    <div>

                        📅

                        ${formatDate(
                reminder.date
            )}

                    </div>


                    <div>

                        ⏰

                        ${formatTime(
                reminder.time
            )}

                    </div>

                </div>

            `;


            list.appendChild(
                card
            );

        }
    );
}


// =====================================================
// DELETE REMINDER
// =====================================================

async function deleteReminder(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this reminder?"
        );


    if (!confirmed) return;


    // Cancel Android notification
    if (LocalNotifications) {

        try {

            const notificationId =
                Number(
                    id % 2147483647
                );


            await LocalNotifications.cancel({

                notifications: [

                    {
                        id:
                            notificationId
                    }

                ]

            });


        } catch (error) {

            console.warn(
                "Could not cancel notification:",
                error
            );

        }

    }


    // Remove reminder
    reminders =
        reminders.filter(
            reminder =>
                reminder.id !==
                id
        );


    saveData();


    renderReminders();
}


// =====================================================
// REMINDER MODAL
// =====================================================

function openReminderModal() {

    const modal =
        document.getElementById(
            "reminderModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }
}


function closeReminderModal() {

    const modal =
        document.getElementById(
            "reminderModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }
}


// =====================================================
// ADD REMINDER
// =====================================================

async function addReminder() {

    const company =
        document
            .getElementById(
                "reminderCompany"
            )
            .value
            .trim();


    const type =
        document.getElementById(
            "reminderType"
        ).value;


    const date =
        document.getElementById(
            "reminderDate"
        ).value;


    const time =
        document.getElementById(
            "reminderTime"
        ).value;


    // =================================================
    // VALIDATION
    // =================================================

    if (!company) {

        alert(
            "Please enter the company name."
        );

        return;
    }


    if (!date) {

        alert(
            "Please select the date."
        );

        return;
    }


    if (!time) {

        alert(
            "Please select the time."
        );

        return;
    }


    // =================================================
    // CREATE DATE
    // =================================================

    const reminderDate =
        new Date(
            `${date}T${time}:00`
        );


    if (
        isNaN(
            reminderDate.getTime()
        )
    ) {

        alert(
            "Invalid date or time."
        );

        return;
    }


    if (
        reminderDate <=
        new Date()
    ) {

        alert(
            "Please select a future date and time."
        );

        return;
    }


    // =================================================
    // CREATE REMINDER
    // =================================================

    const newReminder = {

        id:
            Date.now(),

        company:
            company,

        type:
            type,

        date:
            date,

        time:
            time

    };


    reminders.push(
        newReminder
    );


    saveData();


    // =================================================
    // SCHEDULE ANDROID NOTIFICATION
    // =================================================

    const scheduled =
        await scheduleReminderNotification(
            newReminder
        );


    if (!scheduled) {

        alert(
            "Reminder was saved, but the Android notification could not be scheduled. Please check notification permission."
        );

    }


    // =================================================
    // CLEAR FORM
    // =================================================

    document.getElementById(
        "reminderCompany"
    ).value = "";


    document.getElementById(
        "reminderDate"
    ).value = "";


    document.getElementById(
        "reminderTime"
    ).value = "";


    closeReminderModal();


    renderReminders();
}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(date) {

    if (!date) return "";


    const d =
        new Date(
            date +
            "T00:00:00"
        );


    return d.toLocaleDateString(
        "en-IN",
        {

            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"

        }
    );
}


// =====================================================
// FORMAT TIME
// =====================================================

function formatTime(time) {

    if (!time) return "";


    const parts =
        time.split(":");


    const hours =
        parseInt(
            parts[0]
        );


    const minutes =
        parts[1];


    const date =
        new Date();


    date.setHours(
        hours
    );


    date.setMinutes(
        minutes
    );


    date.setSeconds(
        0
    );


    return date.toLocaleTimeString(
        "en-IN",
        {

            hour:
                "2-digit",

            minute:
                "2-digit",

            hour12:
                true

        }
    );
}


// =====================================================
// CAPITALIZE
// =====================================================

function capitalize(text) {

    if (!text) return "";


    return (
        text.charAt(0).toUpperCase()
        +
        text.slice(1)
    );
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;
}


// =====================================================
// CLOSE MODALS OUTSIDE
// =====================================================

window.addEventListener(
    "click",
    function (event) {

        const companyModal =
            document.getElementById(
                "companyModal"
            );


        const reminderModal =
            document.getElementById(
                "reminderModal"
            );


        if (
            companyModal &&
            event.target ===
            companyModal
        ) {

            closeCompanyModal();

        }


        if (
            reminderModal &&
            event.target ===
            reminderModal
        ) {

            closeReminderModal();

        }

    }
);


// =====================================================
// INITIALIZE APP
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        // Render normal app data
        renderCompanies();

        renderMyCompanies();

        renderReminders();

        updateDashboard();


        // Initialize Android notifications
        const notificationReady =
            await initializeNotifications();


        // Reschedule existing future reminders
        if (notificationReady) {

            await scheduleExistingReminders();

        }

    }
);