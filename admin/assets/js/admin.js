// Admin Dashboard JavaScript with Supabase integration

// Initialize Supabase
const supabaseClient = supabase.createClient(
  'https://dtdwjviaqscrgmhdmuod.supabase.co',
  'sb_publishable_N0LPdn1AH7mLzlgC7rTJ1A_ahI6Uwcs'
);

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutLink = document.getElementById('logout-link');
    const dashboardTabs = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const semesterManager = document.querySelector('.semester-manager');
    const routineManager = document.querySelector('.routine-manager');

    // Check login status on page load
    function checkLoginStatus() {
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        const isLoginPage = window.location.pathname.endsWith('login.html');
        const isDashboardPage = window.location.pathname.endsWith('dashboard.html');

        if (!isLoggedIn && isDashboardPage) {
            // Redirect to login if not logged in on dashboard
            window.location.href = 'login.html';
        } else if (isLoggedIn && isLoginPage) {
            // Redirect to dashboard if logged in on login page
            window.location.href = 'dashboard.html';
        }
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            // Hardcoded credentials (in a real app, use proper authentication)
            if (username === 'admin' && password === 'admin123') {
                sessionStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'dashboard.html';
            } else {
                loginError.textContent = 'Invalid username or password';
                loginError.style.display = 'block';
                // Clear password field
                document.getElementById('password').value = '';
            }
        });
    }

    // Handle logout
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('adminLoggedIn');
            window.location.href = 'login.html';
        });
    }

    // Handle dashboard tabs
    if (dashboardTabs.length) {
        dashboardTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update tab buttons
                dashboardTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update tab panes
                const tabName = tab.getAttribute('data-tab');
                tabPanes.forEach(pane => {
                    if (pane.getAttribute('data-tab') === tabName) {
                        pane.classList.add('active');
                    } else {
                        pane.classList.remove('active');
                    }
                });

                // Initialize the active tab's content
                if (tabName === 'academics' && semesterManager) {
                    initAcademicManager();
                } else if (tabName === 'routine' && routineManager) {
                    initRoutineManager();
                }
            });
        });
    }

    // Initialize the dashboard based on current URL
    checkLoginStatus();

    // If we're on the dashboard page, initialize the default tab
    if (window.location.pathname.endsWith('dashboard.html')) {
        // Default to academics tab
        const academicsTab = document.querySelector('.tab-btn[data-tab="academics"]');
        if (academicsTab) {
            academicsTab.click();
        }
    }
});

// Academic Manager Functions
async function initAcademicManager() {
    const semesterManager = document.querySelector('.semester-manager');
    if (!semesterManager) return;

    // Semester data: year-semester combinations
    const semesters = [
        { year: 1, semester: 1, label: '1st Year - 1st Semester' },
        { year: 1, semester: 2, label: '1st Year - 2nd Semester' },
        { year: 2, semester: 1, label: '2nd Year - 1st Semester' },
        { year: 2, semester: 2, label: '2nd Year - 2nd Semester' },
        { year: 3, semester: 1, label: '3rd Year - 1st Semester' },
        { year: 3, semester: 2, label: '3rd Year - 2nd Semester' },
        { year: 4, semester: 1, label: '4th Year - 1st Semester' },
        { year: 4, semester: 2, label: '4th Year - 2nd Semester' }
    ];

    // Clear existing content
    semesterManager.innerHTML = '';

    // Create semester tabs
    const semesterTabsContainer = document.createElement('div');
    semesterTabsContainer.className = 'semester-tabs';
    semesterManager.appendChild(semesterTabsContainer);

    // Create semester content container
    const semesterContentContainer = document.createElement('div');
    semesterContentContainer.className = 'semester-content-container';
    semesterManager.appendChild(semesterContentContainer);

    // Generate semester tabs
    semesters.forEach((sem, index) => {
        const tabBtn = document.createElement('button');
        tabBtn.className = `semester-tab-btn ${index === 0 ? 'active' : ''}`;
        tabBtn.textContent = sem.label;
        tabBtn.dataset.year = sem.year;
        tabBtn.dataset.semester = sem.semester;
        semesterTabsContainer.appendChild(tabBtn);
    });

    // Generate semester content area (initially empty, will be filled on tab click)
    const semesterContent = document.createElement('div');
    semesterContent.className = 'semester-content';
    semesterContentContainer.appendChild(semesterContent);

    // Add event listeners to semester tabs
    const semesterTabBtns = semesterTabsContainer.querySelectorAll('.semester-tab-btn');
    semesterTabBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            // Update active tab
            semesterTabBtns.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');

            // Load content for this semester
            const year = btn.dataset.year;
            const semester = btn.dataset.semester;
            await loadAcademicContent(year, semester, semesterContent);
        });
    });

    // Initialize first tab
    if (semesterTabBtns.length) {
        semesterTabBtns[0].click();
    }
}

async function loadAcademicContent(year, semester, container) {
    const { data, error } = await supabaseClient
        .from('academic_resources')
        .select('content')
        .eq('year', year)
        .eq('semester', semester)
        .single();

    let content = '';
    if (!error && data) {
        content = data.content;
    }

    container.innerHTML = `
        <label for="academic-content-${year}-${semester}">Content for ${year}st Year - ${semester}nd Semester:</label>
        <textarea id="academic-content-${year}-${semester}" placeholder="Enter HTML content for this semester's tab pane...">${content}</textarea>
        <div class="semester-actions">
            <button class="btn btn-secondary save-academic-btn" data-year="${year}" data-semester="${semester}">Save Changes</button>
            <button class="btn btn-reset reset-academic-btn" data-year="${year}" data-semester="${semester}">Reset to Default</button>
        </div>
    `;

    // Add event listeners
    const saveBtn = container.querySelector('.save-academic-btn');
    const resetBtn = container.querySelector('.reset-academic-btn');
    const textarea = container.querySelector(`#academic-content-${year}-${semester}`);

    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const content = textarea.value;
            const { error } = await supabaseClient
                .from('academic_resources')
                .upsert({ year: parseInt(year), semester: parseInt(semester), content });
            if (error) {
                console.error('Error saving academic content:', error);
            } else {
                showSaveConfirmation(saveBtn);
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', async () => {
            const { error } = await supabaseClient
                .from('academic_resources')
                .delete()
                .eq('year', parseInt(year))
                .eq('semester', parseInt(semester));
            if (error) {
                console.error('Error resetting academic content:', error);
            } else {
                // Clear the textarea
                textarea.value = '';
                showSaveConfirmation(resetBtn, 'Reset to default');
            }
        });
    }
}

// Routine Manager Functions
async function initRoutineManager() {
    const routineManager = document.querySelector('.routine-manager');
    if (!routineManager) return;

    // Clear existing content
    routineManager.innerHTML = '';

    // Create controls
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'routine-controls';
    routineManager.appendChild(controlsContainer);

    // Year selector
    const yearLabel = document.createElement('label');
    yearLabel.htmlFor = 'routine-year-select';
    yearLabel.textContent = 'Year:';
    controlsContainer.appendChild(yearLabel);

    const yearSelect = document.createElement('select');
    yearSelect.id = 'routine-year-select';
    for (let i = 1; i <= 4; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}${getOrdinalSuffix(i)} Year`;
        yearSelect.appendChild(option);
    }
    controlsContainer.appendChild(yearSelect);

    // Semester selector
    const semesterLabel = document.createElement('label');
    semesterLabel.htmlFor = 'routine-semester-select';
    semesterLabel.textContent = 'Semester:';
    controlsContainer.appendChild(semesterLabel);

    const semesterSelect = document.createElement('select');
    semesterSelect.id = 'routine-semester-select';
    for (let i = 1; i <= 2; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}${getOrdinalSuffix(i)} Semester`;
        semesterSelect.appendChild(option);
    }
    controlsContainer.appendChild(semesterSelect);

    // Load button
    const loadBtn = document.createElement('button');
    loadBtn.className = 'btn btn-primary';
    loadBtn.textContent = 'Load Data';
    controlsContainer.appendChild(loadBtn);

    // Create table container
    const tableContainer = document.createElement('div');
    tableContainer.className = 'routine-table-container';
    routineManager.appendChild(tableContainer);

    // Create actions container
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'routine-actions';
    routineManager.appendChild(actionsContainer);

    // Add event listener to load button
    loadBtn.addEventListener('click', async () => {
        const year = yearSelect.value;
        const semester = semesterSelect.value;
        await loadRoutineData(year, semester, tableContainer, actionsContainer);
    });

    // Load default (Year 1, Semester 1)
    yearSelect.value = '1';
    semesterSelect.value = '1';
    loadBtn.click();
}

async function loadRoutineData(year, semester, tableContainer, actionsContainer) {
    const { data, error } = await supabaseClient
        .from('class_routine')
        .select('day, time_slot, course_text')
        .eq('year', parseInt(year))
        .eq('semester', parseInt(semester));

    let courseData = {};
    if (!error && data) {
        data.forEach(row => {
            if (!courseData[row.day]) {
                courseData[row.day] = {};
            }
            courseData[row.day][row.time_slot] = row.course_text;
        });
    } else {
        // If error or no data, use default
        courseData = getDefaultCourseData(year, semester);
    }

    // Clear containers
    tableContainer.innerHTML = '';
    actionsContainer.innerHTML = '';

    // Create table
    const table = document.createElement('table');
    table.className = 'routine-table';
    tableContainer.appendChild(table);

    // Days of the week
    const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const timeSlots = [
        { label: '8:00 AM - 9:30 AM', time: 1 },
        { label: '9:45 AM - 11:15 AM', time: 2 },
        { label: '11:30 AM - 1:00 PM', time: 3 },
        { label: '1:00 PM - 2:00 PM', time: 4 },
        { label: '2:00 PM - 3:30 PM', time: 5 },
        { label: '3:45 PM - 5:15 PM', time: 6 }
    ];

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const timeHeader = document.createElement('th');
    timeHeader.textContent = 'Time';
    headerRow.appendChild(timeHeader);
    days.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    });
    headerRow.appendChild(timeHeader.cloneNode(false)); // Empty cell for alignment
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    timeSlots.forEach(slot => {
        const row = document.createElement('tr');

        // Time cell
        const timeCell = document.createElement('td');
        timeCell.textContent = slot.label;
        timeCell.className = 'time-cell';
        row.appendChild(timeCell);

        // Day cells
        days.forEach((day, dayIndex) => {
            const dayKey = day.toLowerCase().slice(0, 3); // sat, sun, mon, tue, wed, thu
            const cell = document.createElement('td');
            const course = courseData[dayKey] && courseData[dayKey][slot.time]
                ? courseData[dayKey][slot.time]
                : '';

            const input = document.createElement('input');
            input.type = 'text';
            input.value = course;
            input.placeholder = 'Enter course name';
            input.dataset.day = dayKey;
            input.dataset.time = slot.time;
            cell.appendChild(input);
            row.appendChild(cell);
        });

        // Empty cell for alignment
        const emptyCell = document.createElement('td');
        row.appendChild(emptyCell);

        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Add save and reset buttons
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-success save-btn';
    saveBtn.textContent = 'Save Changes';
    saveBtn.dataset.year = year;
    saveBtn.dataset.semester = semester;
    actionsContainer.appendChild(saveBtn);

    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn-reset reset-btn';
    resetBtn.textContent = 'Reset to Default';
    resetBtn.dataset.year = year;
    resetBtn.dataset.semester = semester;
    actionsContainer.appendChild(resetBtn);

    // Add event listeners
    saveBtn.addEventListener('click', async () => {
        // Collect data from table
        const newCourseData = {
            sat: {},
            sun: {},
            mon: {},
            tue: {},
            wed: {},
            thu: {}
        };

        const inputs = tableContainer.querySelectorAll('input');
        inputs.forEach(input => {
            const day = input.dataset.day;
            const time = parseInt(input.dataset.time);
            const value = input.value.trim();
            if (value) {
                newCourseData[day][time] = value;
            }
        });

        // Delete existing records for this year-semester
        await supabaseClient
            .from('class_routine')
            .delete()
            .eq('year', parseInt(year))
            .eq('semester', parseInt(semester));

        // Insert new records
        const recordsToInsert = [];
        days.forEach(day => {
            const dayKey = day.toLowerCase().slice(0, 3);
            timeSlots.forEach(slot => {
                const course = newCourseData[dayKey] && newCourseData[dayKey][slot.time];
                if (course) {
                    recordsToInsert.push({
                        year: parseInt(year),
                        semester: parseInt(semester),
                        day: dayKey,
                        time_slot: slot.time,
                        course_text: course
                    });
                }
            });
        });

        if (recordsToInsert.length > 0) {
            const { error } = await supabaseClient
                .from('class_routine')
                .insert(recordsToInsert);
            if (error) {
                console.error('Error saving class routine:', error);
            } else {
                showSaveConfirmation(saveBtn);
            }
        } else {
            showSaveConfirmation(saveBtn);
        }
    });

    resetBtn.addEventListener('click', async () => {
        const { error } = await supabaseClient
            .from('class_routine')
            .delete()
            .eq('year', parseInt(year))
            .eq('semester', parseInt(semester));
        if (error) {
            console.error('Error resetting class routine:', error);
        } else {
            // Reload the table with default data
            await loadRoutineData(year, semester, tableContainer, actionsContainer);
            showSaveConfirmation(resetBtn, 'Reset to default');
        }
    });
}

// Helper Functions
function getOrdinalSuffix(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}

function getDefaultCourseData(year, semester) {
    // This is the default course data for 1st Year (as in the original routine.html)
    // For other years, we would have different data, but for simplicity we'll use the same structure
    // In a real implementation, you would have different default data for each year
    return {
        sat: {
            1: 'EEE 201: Circuit Analysis 1',
            2: 'MATH 201: Mathematics 3',
            3: 'EEE 202: Digital Logic Design',
            4: 'Break',
            5: 'EEE 204: Signals and Systems',
            6: 'Lab: Circuit Analysis'
        },
        sun: {
            1: 'MATH 202: Numerical Methods',
            2: 'EEE 201: Circuit Analysis 1',
            3: 'EEE 202: Digital Logic Design',
            4: 'Break',
            5: 'EEE 303: Control Systems',
            6: 'Lab: Digital Logic'
        },
        mon: {
            1: 'EEE 203: Circuit Analysis 2',
            2: 'PHYS 102: Physics 2',
            3: 'EEE 202: Digital Logic Design',
            4: 'Break',
            5: 'EEE 304: Power Electronics',
            6: 'Lab: Control Systems'
        },
        tue: {
            1: 'EEE 204: Signals and Systems',
            2: 'EEE 201: Circuit Analysis 1',
            3: 'EEE 202: Digital Logic Design',
            4: 'Break',
            5: 'EEE 305: Communication Engineering',
            6: 'Lab: Communication'
        },
        wed: {
            1: 'EEE 301: Electromagnetic Fields',
            2: 'MATH 202: Numerical Methods',
            3: 'EEE 202: Digital Logic Design',
            4: 'Break',
            5: 'EEE 306: Microcontrollers',
            6: 'Lab: Microcontrollers'
        },
        thu: {
            1: 'EEE 302: Microprocessors',
            2: 'EEE 203: Circuit Analysis 2',
            3: 'EEE 202: Digital Logic Design',
            4: 'Break',
            5: 'Lab: Power Electronics',
            6: 'Lab: Power Systems'
        }
    };
}

function showSaveConfirmation(btn, message = 'Saved!') {
    const originalText = btn.textContent;
    btn.textContent = message;
    btn.disabled = true;
    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
    }, 1500);
}