// ======= DOM Elements =======
const form = document.getElementById('expense-form');
const typeInput = document.getElementById('type');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const noteInput = document.getElementById('note');

const filterType = document.getElementById('filter-type');
const filterCategory = document.getElementById('filter-category');
const filterFrom = document.getElementById('filter-from');
const filterTo = document.getElementById('filter-to');
const applyBtn = document.getElementById('apply-filters');


const recordsBody = document.getElementById('records-body');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('total-income');
const expenseEl = document.getElementById('total-expense');

// ======= State =======
let records = JSON.parse(localStorage.getItem('records')) || [];

// ======= Utils =======
function saveToLocalStorage() {
  localStorage.setItem('records', JSON.stringify(records));
}

function generateId() {
  return Date.now().toString();
}

function formatCurrency(amount) {
  return `${Number(amount).toFixed(2)} грн`;
}

// ======= Rendering =======
function renderTable() {
    const filtered = getFilteredRecords();
    recordsBody.innerHTML = '';
    filtered.forEach(record => {
      const row = document.createElement('tr');
      row.classList.add('fade-in');
      row.setAttribute('data-id', record.id);
      row.innerHTML = `
        <td>${record.type}</td>
        <td>${formatCurrency(record.amount)}</td>
        <td>${record.category}</td>
        <td>${record.date}</td>
        <td>${record.note || '-'}</td>
        <td>
          <button onclick="editRecord('${record.id}')">✏️</button>
          <button onclick="deleteRecord('${record.id}')">❌</button>
        </td>
      `;
      recordsBody.appendChild(row);
    });
  }

  function updateCategoryFilterOptions() {
    const categories = [...new Set(records.map(r => r.category))];
    filterCategory.innerHTML = `<option value="всі">Усі категорії</option>` +
      categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  }
  applyBtn.addEventListener('click', () => {
    renderTable();
  });

  const resetBtn = document.getElementById('reset-filters');

  resetBtn.addEventListener('click', () => {
    filterType.value = 'всі';
    filterCategory.value = 'всі';
    filterFrom.value = '';
    filterTo.value = '';
    renderTable();
  });
  
  
  

function editRecord(id) {
    const record = records.find(r => r.id === id);
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!record || !row) return;
  
    row.innerHTML = `
      <td>
        <select id="edit-type">
          <option value="доход" ${record.type === 'доход' ? 'selected' : ''}>Дохід</option>
          <option value="витрата" ${record.type === 'витрата' ? 'selected' : ''}>Витрата</option>
        </select>
      </td>
      <td><input type="number" id="edit-amount" value="${record.amount}" min="0.01" step="0.01" /></td>
      <td><input type="text" id="edit-category" value="${record.category}" /></td>
      <td><input type="date" id="edit-date" value="${record.date}" /></td>
      <td><input type="text" id="edit-note" value="${record.note || ''}" /></td>
      <td>
        <button onclick="saveEditedRecord('${record.id}')">💾</button>
        <button onclick="renderTable()">↩️</button>
      </td>
    `;
  }

  function saveEditedRecord(id) {
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return;
  
    const updated = {
      ...records[index],
      type: document.getElementById('edit-type').value,
      amount: parseFloat(document.getElementById('edit-amount').value),
      category: document.getElementById('edit-category').value.trim(),
      date: document.getElementById('edit-date').value,
      note: document.getElementById('edit-note').value.trim()
    };
  
    // Валідація
    if (!updated.amount || updated.amount <= 0 || !updated.category || !updated.date) {
      alert('Перевір дані перед збереженням!');
      return;
    }
  
    records[index] = updated;
    saveToLocalStorage();
    renderTable();
    renderSummary();
  }
  
  

function renderSummary() {
  const income = records
    .filter(r => r.type === 'Дохід')
    .reduce((sum, r) => sum + r.amount, 0);

  const expense = records
    .filter(r => r.type === 'Витрата')
    .reduce((sum, r) => sum + r.amount, 0);

  const balance = income - expense;

  incomeEl.textContent = formatCurrency(income);
  expenseEl.textContent = formatCurrency(expense);
  balanceEl.textContent = formatCurrency(balance);
  document.getElementById('balance-header').textContent = formatCurrency(balance);

}



// ======= Events =======
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const record = {
    id: generateId(),
    type: typeInput.value,
    amount: parseFloat(amountInput.value),
    category: categoryInput.value,
    date: dateInput.value,
    note: noteInput.value.trim()
  };

  records.push(record);
  saveToLocalStorage();
  renderTable();
  renderSummary();
  form.reset();
});

function getFilteredRecords() {
    return records.filter(r => {
      const matchType = filterType.value === 'всі' || r.type === filterType.value;
      const matchCategory = filterCategory.value === 'всі' || r.category === filterCategory.value;
      const matchDateFrom = !filterFrom.value || r.date >= filterFrom.value;
      const matchDateTo = !filterTo.value || r.date <= filterTo.value;
      return matchType && matchCategory && matchDateFrom && matchDateTo;
    });
  }
  

// ======= Delete =======
function deleteRecord(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
      row.classList.add('fade-out');
      setTimeout(() => {
        records = records.filter(r => r.id !== id);
        saveToLocalStorage();
        renderTable();
        renderSummary();
      }, 250);
    }
  }
  

// ======= Init =======
renderTable();
renderSummary();
updateCategoryFilterOptions();


// const themeToggleBtn = document.getElementById('theme-toggle');

// Читання з localStorage
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Прив'язка
//themeToggleBtn.addEventListener('click', toggleTheme);

// Ініціалізація
loadTheme();



const modal = document.getElementById('name-modal');
const nameInput = document.getElementById('user-name-input');
const saveBtn = document.getElementById('save-name-btn');
const userInfo = document.getElementById('user-info');
const userNameSpan = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');

// Генерація аватарки через API (або emoji)
function generateAvatar(name) {
  const encoded = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encoded}&background=3498db&color=fff&rounded=true&bold=true`;
}

// Завантаження
function loadUser() {
  const savedName = localStorage.getItem('userName');
  if (!savedName) {
    modal.classList.remove('hidden');
  } else {
    userNameSpan.textContent = `Привіт, ${savedName}`;
    userAvatar.src = generateAvatar(savedName);
    userInfo.classList.remove('hidden');
  }
}

saveBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (name) {
    localStorage.setItem('userName', name);
    modal.classList.add('hidden');
    loadUser();
  }
});

loadUser();


const userMenu = document.getElementById('user-menu');

// Показ/приховування меню
userAvatar.addEventListener('click', () => {
  userMenu.classList.toggle('hidden');
});

// Обробка натискань на пункти
userMenu.addEventListener('click', (e) => {
  const action = e.target.dataset.action;

  switch (action) {
    case 'rename':
      localStorage.removeItem('userName');
      location.reload();
      break;

    case 'theme':
      toggleTheme();
      break;

    case 'clear':
      if (confirm('Очистити всі записи?')) {
        records = [];
        saveToLocalStorage();
        renderTable();
        renderSummary();
      }
      break;

    case 'logout':
      localStorage.removeItem('userName');
      localStorage.removeItem('theme');
      location.reload();
      break;
  }
});

// При кліку поза меню — закрити
document.addEventListener('click', (e) => {
  if (!userInfo.contains(e.target) && !userMenu.contains(e.target)) {
    userMenu.classList.add('hidden');
  }
});


window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  preloader.classList.add('hidden');
});
