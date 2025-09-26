const STORAGE_KEY = 'temperature_records';

let records = [];

function loadRecords() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        records = JSON.parse(stored);
    }
    renderRecords();
}

function saveRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function addRecord(temperature) {
    const now = new Date();
    const record = {
        id: Date.now(),
        temperature: parseFloat(temperature),
        datetime: now.toISOString()
    };

    records.unshift(record);
    saveRecords();
    renderRecords();
}

function deleteRecord(id) {
    if (confirm('この記録を削除しますか？')) {
        records = records.filter(r => r.id !== id);
        saveRecords();
        renderRecords();
    }
}

function formatDate(datetime) {
    const date = new Date(datetime);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${month}/${day} (${weekday}) ${hours}:${minutes}`;
}

function renderRecords() {
    const listElement = document.getElementById('records-list');

    if (records.length === 0) {
        listElement.innerHTML = '<div class="empty-message">まだ記録がありません。<br>体温を入力して記録を始めましょう。</div>';
        return;
    }

    listElement.innerHTML = records.map(record => `
        <div class="record-item">
            <div>
                <div class="record-date">${formatDate(record.datetime)}</div>
                <div class="record-temp">${record.temperature.toFixed(1)} ℃</div>
            </div>
            <button class="delete-btn" onclick="deleteRecord(${record.id})">削除</button>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    loadRecords();

    const form = document.getElementById('temperature-form');
    const input = document.getElementById('temperature');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const temperature = input.value;
        if (temperature) {
            addRecord(temperature);
            input.value = '';

            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '記録しました！';
            submitBtn.style.backgroundColor = 'var(--success-color)';

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
            }, 1500);
        }
    });

    input.focus();
});

