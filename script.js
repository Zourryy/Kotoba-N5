// --- 1. KONFIGURASI PENGATURAN V3 & TEMA ---
let appSettings = {
    fontSize: '4.5rem',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    customFontBase64: null
};

// Pengaturan Theme
let currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme !== 'light' && currentTheme !== 'dark') currentTheme = 'dark';
setTheme(currentTheme);

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(currentTheme);
}

function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
    
    // Update SVG Icon berdasarkan Theme
    const btnIcon = document.getElementById('btn-theme-toggle');
    if (themeName === 'light') {
        // Ikon Bulan (klik untuk gelap)
        btnIcon.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`;
    } else {
        // Ikon Matahari (klik untuk terang)
        btnIcon.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z"/></svg>`;
    }
}

// Settings Biasa Font Flashcard
let sessionStats = { totalBenar: 0, totalSalah: 0 };
function loadSettings() {
    let saved = localStorage.getItem('kn5_settings_v3');
    if(saved) {
        appSettings = JSON.parse(saved);
        document.getElementById('set-font-size').value = appSettings.fontSize || '4.5rem';
        document.getElementById('set-font-family').value = appSettings.fontFamily || "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    }
    applyThemeSettings(); 
}

document.getElementById('set-font-family').addEventListener('change', function() {
    document.getElementById('upload-font-div').style.display = (this.value === 'custom') ? 'flex' : 'none';
});

function saveSettings() {
    appSettings.fontSize = document.getElementById('set-font-size').value;
    appSettings.fontFamily = document.getElementById('set-font-family').value;
    if (appSettings.fontFamily === 'custom') {
        const file = document.getElementById('set-font-file').files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) { appSettings.customFontBase64 = e.target.result; finalizeSave(); };
            reader.readAsDataURL(file);
            return;
        }
    }
    finalizeSave();
}

function finalizeSave() {
    localStorage.setItem('kn5_settings_v3', JSON.stringify(appSettings));
    applyThemeSettings();
    alert("Pengaturan Berhasil Disimpan!");
}

function applyThemeSettings() {
    document.documentElement.style.setProperty('--fc-font-size', appSettings.fontSize);
    let frontEl = document.getElementById('fc-front');
    if(frontEl) frontEl.style.fontSize = appSettings.fontSize;
    
    if (appSettings.fontFamily === 'custom' && appSettings.customFontBase64) {
        let existingStyle = document.getElementById('custom-font-style');
        if (existingStyle) existingStyle.remove();
        let newStyle = document.createElement('style');
        newStyle.id = 'custom-font-style';
        newStyle.appendChild(document.createTextNode(`@font-face { font-family: 'CustomFC'; src: url(${appSettings.customFontBase64}); }`));
        document.head.appendChild(newStyle);
        document.documentElement.style.setProperty('--fc-font', "'CustomFC'");
        if(frontEl) frontEl.style.fontFamily = "'CustomFC'";
    } else {
        document.documentElement.style.setProperty('--fc-font', appSettings.fontFamily);
        if(frontEl) frontEl.style.fontFamily = appSettings.fontFamily;
    }
}

// --- 2. AUTO ROMAJI CONVERTER ---
const romajiMap = { 
    'あ':'a','い':'i','う':'u','え':'e','お':'o','か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
    'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so','た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
    'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no','は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
    'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo','や':'ya','ゆ':'yu','よ':'yo',
    'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro','わ':'wa','を':'wo','ん':'n', 
    'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go','ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
    'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do','ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
    'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po', 
    'きゃ':'kya','きゅ':'kyu','きょ':'kyo','しゃ':'sha','しゅ':'shu','しょ':'sho',
    'ちゃ':'cha','ちゅ':'chu','ちょ':'cho','にゃ':'nya','にゅ':'nyu','にょ':'nyo',
    'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo','みゃ':'mya','みゅ':'myu','みょ':'myo',
    'りゃ':'rya','りゅ':'ryu','りょ':'ryo', 
    'ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo','じゃ':'ja','じゅ':'ju','じょ':'jo',
    'びゃ':'bya','びゅ':'byu','びょ':'byo','ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo', 
    'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o','カ':'ka','キ':'ki','ク':'ku','ケ':'ke','コ':'ko',
    'サ':'sa','シ':'shi','ス':'su','セ':'se','ソ':'so','タ':'ta','チ':'chi','ツ':'tsu','テ':'te','ト':'to',
    'ナ':'na','ニ':'ni','ヌ':'nu','ネ':'ne','ノ':'no','ハ':'ha','ヒ':'hi','フ':'fu','ヘ':'he','ホ':'ho',
    'マ':'ma','ミ':'mi','ム':'mu','メ':'me','モ':'mo','ヤ':'ya','ユ':'yu','ヨ':'yo',
    'ラ':'ra','リ':'ri','ル':'ru','レ':'re','ロ':'ro','ワ':'wa','ヲ':'wo','ン':'n' 
};

function toRomaji(kanaStr) { 
    let result = ''; 
    for(let i=0; i<kanaStr.length; i++) { 
        let double = kanaStr.substring(i, i+2); 
        if(romajiMap[double]) { result += romajiMap[double]; i++; } 
        else if(romajiMap[kanaStr[i]]) { result += romajiMap[kanaStr[i]]; } 
        else if(kanaStr[i] === 'っ' || kanaStr[i] === 'ッ') { if(i+1 < kanaStr.length && romajiMap[kanaStr[i+1]]) { result += romajiMap[kanaStr[i+1]][0]; } } 
        else if(kanaStr[i] === 'ー') { result += '-'; } 
        else { result += kanaStr[i]; } 
    } 
    return result; 
}

let db = {};

// --- 3. MENU LOGIC ---
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
}

function switchTab(tabId) {
    document.querySelectorAll('.container').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    let targetTab = document.getElementById(tabId);
    if(targetTab) targetTab.classList.add('active');
    if(event && event.currentTarget && event.currentTarget.classList) { event.currentTarget.classList.add('active'); }
    if(document.getElementById('sidebar').classList.contains('open')) { toggleMenu(); }

    let isFocusedMode = (tabId === 'flashcard-app');
    document.getElementById('btn-hamburger').style.display = isFocusedMode ? 'none' : 'flex';
    document.getElementById('btn-back').style.display = isFocusedMode ? 'flex' : 'none';
    if(tabId === 'statistik') updateCharts();
    if(tabId === 'exam') validateExamMax();
}

// --- 4. FETCH KOTOBA DATA ---
async function loadData() {
    try {
        const response = await fetch('kosakata_bab1_25_lengkap.txt');
        if(!response.ok) throw new Error("TXT tidak ditemukan.");
        const text = await response.text();
        parseData(text);
        updateStatistik();
        document.getElementById('loader').style.display = 'none';
        initGrids();
        loadSettings();
    } catch (err) {
        document.getElementById('loader').innerHTML = `<span style="color:var(--btn-salah);">TXT tidak ada. Jalankan via Local Server. (${err.message})</span>`;
        loadSettings();
    }
}

function parseData(text) {
    const lines = text.split('\n'); 
    let currentBab = 0;
    lines.forEach(line => {
        line = line.trim(); 
        if(!line) return;
        if (line.toLowerCase().startsWith('pelajaran')) {
            currentBab = parseInt(line.replace(/\D/g, '')); 
            db[currentBab] = [];
        } else if (line.includes(' : ') && currentBab !== 0) {
            let parts = line.split(' : '); 
            let jepang = parts[0].trim(); 
            let arti = parts[1].trim();
            let kanji = "-"; 
            let hiragana = jepang;
            let match = jepang.match(/(.+?)\s*\((.+?)\)/);
            if(match) { kanji = match[1].trim(); hiragana = match[2].trim(); }
            db[currentBab].push({ kanji: kanji, hiragana: hiragana, romaji: toRomaji(hiragana), arti: arti });
        }
    });
}

function updateStatistik() {
    let total = 0;
    Object.values(db).forEach(babArray => { total += babArray.length; });
    document.getElementById('stat-total').innerText = total;
}

function initGrids() {
    const fcGrid = document.getElementById('bab-grid');
    const pvChapterBar = document.getElementById('pv-chapter-bar');
    const exSelect = document.getElementById('exam-range');
    
    fcGrid.innerHTML = ''; pvChapterBar.innerHTML = ''; 
    exSelect.innerHTML = '<option value="all">Keseluruhan (Bab 1 - 25)</option>';

    Object.keys(db).forEach(bab => {
        let btnFc = document.createElement('button'); 
        btnFc.className = 'btn-bab'; btnFc.innerText = `Bab ${bab}`; 
        btnFc.onclick = () => openSetupPopup(bab); // Memicu Popup Settings
        fcGrid.appendChild(btnFc);
        
        let btnChip = document.createElement('button'); 
        btnChip.className = 'btn-chip'; btnChip.id = 'chip-bab-' + bab; btnChip.innerText = bab; 
        btnChip.onclick = () => showPreview(bab); 
        pvChapterBar.appendChild(btnChip);

        let opt = document.createElement('option'); 
        opt.value = bab; opt.innerText = `Hanya Bab ${bab}`; 
        exSelect.appendChild(opt);
    });
    
    exSelect.innerHTML += `<option value="1-4">Evaluasi Bab 1-4</option><option value="5-8">Evaluasi Bab 5-8</option><option value="21-25">Evaluasi Bab 21-25</option>`;
    if(Object.keys(db).length > 0) showPreview(Object.keys(db)[0]);
}

function showPreview(bab) {
    document.querySelectorAll('.btn-chip').forEach(b => b.classList.remove('active'));
    let activeChip = document.getElementById('chip-bab-' + bab);
    if(activeChip) activeChip.classList.add('active');
    document.getElementById('pv-title').innerText = `Pelajaran ${bab}`;
    const listDiv = document.getElementById('pv-list'); listDiv.innerHTML = '';
    if(!db[bab]) return;
    db[bab].forEach((item) => {
        let mainText = item.kanji !== "-" ? item.kanji : item.hiragana;
        let subText = item.kanji !== "-" ? item.hiragana : "";
        listDiv.innerHTML += `
            <div class="vocab-card">
                <div class="vocab-jp"><span class="vocab-kanji">${mainText}</span>${subText ? `<span style="font-size:14px; font-weight:bold; color:var(--text-muted); margin-bottom:5px;">${subText}</span>` : ''}<span class="vocab-romaji">${item.romaji}</span></div>
                <div class="vocab-id"><span class="vocab-arti">${item.arti}</span></div>
            </div>`;
    });
}

// --- 5. LOGIKA POPUP SETUP & FLASHCARD ---
let fcCards = [];
let fcIndex = 0;
let isFcRandom = false;
let tempBab = null;
let fcSetup = { front: 'kanji', evalMode: true };

function openSetupPopup(bab) {
    tempBab = bab;
    document.getElementById('fc-setup-popup').classList.add('show');
}

function closeSetupPopup() {
    document.getElementById('fc-setup-popup').classList.remove('show');
}

function selectSetupFront(val) {
    fcSetup.front = val;
    document.querySelectorAll('#setup-front-group .btn-select').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function selectSetupEval(val) {
    fcSetup.evalMode = val;
    document.querySelectorAll('#setup-eval-group .btn-select').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function confirmFlashcardSetup() {
    closeSetupPopup();
    startFlashcard(tempBab);
}

function toggleRandomMode() {
    isFcRandom = !isFcRandom;
    let btn = document.getElementById('btn-random');
    btn.innerText = `Acak: ${isFcRandom ? 'ON' : 'OFF'}`;
    btn.classList.toggle('active');
    if (isFcRandom && fcCards.length > 0) {
        let remaining = fcCards.slice(fcIndex);
        remaining.sort(() => 0.5 - Math.random());
        fcCards.splice(fcIndex, remaining.length, ...remaining);
    }
    showNextCard();
}

function startFlashcard(bab) {
    switchTab('flashcard-app');
    if(!db[bab] || db[bab].length === 0) return;
    
    fcCards = [...db[bab]];
    fcIndex = 0;
    sessionStats.totalBenar = 0;
    sessionStats.totalSalah = 0;
    updateCounters();
    
    if(isFcRandom) fcCards.sort(() => 0.5 - Math.random());
    
    // Terapkan setup tombol sesuai Pilihan (Benar/Salah vs Maju/Mundur)
    if(fcSetup.evalMode) {
        document.getElementById('fc-actions-eval').style.display = 'grid';
        document.getElementById('fc-actions-nav').style.display = 'none';
        document.getElementById('fc-counter-display').style.visibility = 'visible';
    } else {
        document.getElementById('fc-actions-eval').style.display = 'none';
        document.getElementById('fc-actions-nav').style.display = 'grid';
        document.getElementById('fc-counter-display').style.visibility = 'hidden';
    }

    showNextCard();
}

function updateCounters() {
    document.getElementById('cnt-salah').innerText = sessionStats.totalSalah;
    document.getElementById('cnt-benar').innerText = sessionStats.totalBenar;
}

function showNextCard() {
    updateCounters();
    document.getElementById('card').classList.remove('flipped');
    
    let currentCard = fcCards[fcIndex];
    document.getElementById('status-msg').innerText = `Kartu Ke-${fcIndex + 1} dari ${fcCards.length}`;
    
    let mainTxt, subTxt, romTxt, artiTxt;

    // Logika Pemilihan Tampilan Depan Kartu
    if (fcSetup.front === 'kanji') {
        mainTxt = currentCard.kanji !== "-" ? currentCard.kanji : currentCard.hiragana;
        subTxt = currentCard.kanji !== "-" ? currentCard.hiragana : "";
        romTxt = currentCard.romaji;
        artiTxt = currentCard.arti;
    } else if (fcSetup.front === 'hiragana') {
        mainTxt = currentCard.hiragana;
        subTxt = currentCard.kanji !== "-" ? currentCard.kanji : "";
        romTxt = currentCard.romaji;
        artiTxt = currentCard.arti;
    } else if (fcSetup.front === 'arti') {
        mainTxt = currentCard.arti;
        subTxt = "";
        artiTxt = currentCard.kanji !== "-" ? `${currentCard.kanji} (${currentCard.hiragana})` : currentCard.hiragana;
        romTxt = currentCard.romaji;
    }

    document.getElementById('fc-front').innerText = mainTxt;
    document.getElementById('fc-furi').innerText = subTxt;
    document.getElementById('fc-romaji').innerText = romTxt;
    document.getElementById('fc-arti').innerText = artiTxt;
}

function flipCard() { 
    if(fcCards.length > 0) document.getElementById('card').classList.toggle('flipped'); 
}

function markCard(isCorrect) {
    if (isCorrect) sessionStats.totalBenar++;
    else sessionStats.totalSalah++;
    
    fcIndex++;
    if (fcIndex >= fcCards.length) {
        fcIndex = 0;
        if (isFcRandom) fcCards.sort(() => 0.5 - Math.random());
    }
    showNextCard();
}

// Navigasi untuk Mode Maju / Mundur
function navCard(direction) {
    fcIndex += direction;
    if (fcIndex >= fcCards.length) {
        fcIndex = 0;
        if (isFcRandom) fcCards.sort(() => 0.5 - Math.random());
    } else if (fcIndex < 0) {
        fcIndex = fcCards.length - 1;
    }
    showNextCard();
}

// --- 6. EXAM & STATISTIK LOGIC (Sama Persis) ---
let chartRetrievabilityInstance;
function updateCharts() {
    if(chartRetrievabilityInstance) chartRetrievabilityInstance.destroy();
    const ctx2 = document.getElementById('chartRetrievability').getContext('2d');
    chartRetrievabilityInstance = new Chart(ctx2, {
        type: 'bar', data: { labels: ['Benar', 'Salah'], datasets: [{ label: 'Total Jawaban', data: [sessionStats.totalBenar, sessionStats.totalSalah], backgroundColor: ['#059669', '#e11d48'], borderRadius: 4 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: '#94a3b8' } }, x: { ticks: { color: '#94a3b8' } } } }
    });
}
function exportStatsPDF() {
    const element = document.getElementById('stats-content');
    const opt = { margin: 10, filename: 'KN5_Statistik.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
    html2pdf().set(opt).from(element).save();
}

let examQuestions = []; let currentQIndex = 0; let score = 0; let currentExamPool = []; let timerInterval; let timeExamStarted = 0;
function getPoolForRange(range) {
    let pool = [];
    if (range === "all") Object.values(db).forEach(arr => pool = pool.concat(arr));
    else if (range.includes("-")) { let [start, end] = range.split("-").map(Number); for(let i=start; i<=end; i++) if(db[i]) pool = pool.concat(db[i]); }
    else if(db[range]) pool = [...db[range]];
    return pool;
}
function validateExamMax() {
    let range = document.getElementById('exam-range').value; let pool = getPoolForRange(range);
    let limitVal = (range === "all" || range.includes("-")) ? 50 : 30;
    let maxAvailable = pool.length < limitVal ? pool.length : limitVal;
    let inputSoal = document.getElementById('exam-jumlah-soal');
    inputSoal.max = maxAvailable; if(parseInt(inputSoal.value) > maxAvailable) inputSoal.value = maxAvailable;
    document.getElementById('max-soal-hint').innerText = `Maksimal soal tersedia: ${maxAvailable}`;
}
function resetExamUI() { document.getElementById('exam-result').style.display = 'none'; document.getElementById('exam-run').style.display = 'none'; document.getElementById('exam-setup').style.display = 'block'; clearInterval(timerInterval); }
function goHomeFromExam() { resetExamUI(); switchTab('home'); }
function startExam() {
    let range = document.getElementById('exam-range').value; currentExamPool = getPoolForRange(range);
    let reqCount = parseInt(document.getElementById('exam-jumlah-soal').value); let limitVal = (range === "all" || range.includes("-")) ? 50 : 30;
    let finalCount = Math.min(reqCount, currentExamPool.length, limitVal);
    if(currentExamPool.length < 4) return alert("Kosakata belum mencukupi untuk membuat soal.");
    examQuestions = currentExamPool.sort(() => 0.5 - Math.random()).slice(0, finalCount); currentQIndex = 0; score = 0; timeExamStarted = Date.now();
    document.getElementById('exam-setup').style.display = 'none'; document.getElementById('exam-run').style.display = 'block'; document.getElementById('exam-result').style.display = 'none'; document.getElementById('btn-next-q').style.display = 'none';
    clearInterval(timerInterval); let timerMin = parseFloat(document.getElementById('exam-timer-input').value); let timerDisplay = document.getElementById('exam-timer-display');
    if(timerMin && timerMin > 0) {
        let seconds = Math.floor(timerMin * 60); timerDisplay.style.display = 'inline';
        timerInterval = setInterval(() => { seconds--; let m = Math.floor(seconds / 60); let s = seconds % 60; timerDisplay.innerText = `${m}:${s < 10 ? '0' : ''}${s}`; if(seconds <= 0) { clearInterval(timerInterval); alert("Waktu Ujian Habi
