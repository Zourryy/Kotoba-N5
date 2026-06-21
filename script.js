// ==========================================================================
// script.js - LOGIKA UI & APLIKASI KISO
// ==========================================================================

let currentTheme = localStorage.getItem('theme') || 'dark';
setTheme(currentTheme);

function toggleTheme() {
 currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
 setTheme(currentTheme);
}

function setTheme(themeName) {
 document.documentElement.setAttribute('data-theme', themeName);
 localStorage.setItem('theme', themeName);
 const btnIcon = document.getElementById('btn-theme-toggle');
 if (btnIcon) {
     if (themeName === 'light') {
         btnIcon.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`;
     } else {
         btnIcon.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z"/></svg>`;
     }
 }
}

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
'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o'
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

// ---------------- AUDIO (TEXT-TO-SPEECH) ----------------
function playAudio(elementId) {
    let text = document.getElementById(elementId).innerText;
    if (!text || text === "Tidak ada contoh" || text === "-") return;
    playAudioText(text); // Oper langsung ke fungsi utama di bawah
}

function playAudioText(text) {
    if (!text || text === "-") return;

    // Pakai Native Web Speech API biar KEBAl Adblock / Brave Shields
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Hentikan suara sebelumnya (mencegah numpuk)
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.85; // Sedikit diperlambat biar pengucapannya jelas
        window.speechSynthesis.speak(utterance);
    } else {
        // Fallback kalau browsernya (browser jadul) gak support
        let encodedText = encodeURIComponent(text);
        let url = `https://translate.googleapis.com/translate_tts?client=tw-ob&ie=UTF-8&tl=ja&q=${encodedText}`;
        let audio = new Audio(url);
        audio.play().catch(function(error) {
            alert("Gagal memutar audio. Browser memblokir koneksi.");
            console.error("Audio Play Error:", error);
        });
    }
}

// ---------------- SETTINGS (DPI & FONT SIZES) ----------------
function initSettings() {
    let dpi = localStorage.getItem('sys-dpi') || '1';
    let txtSize = localStorage.getItem('sys-text-size') || '100%';
    let fcSize = localStorage.getItem('fc-size') || '4.5';
    
    document.getElementById('set-dpi').value = dpi;
    document.getElementById('set-sys-text').value = txtSize;
    document.getElementById('set-fc-size').value = fcSize;
    applyCustomSettings(dpi, txtSize, fcSize);
}

function updateCustomSettings() {
    let dpi = document.getElementById('set-dpi').value;
    let txtSize = document.getElementById('set-sys-text').value;
    let fcSize = document.getElementById('set-fc-size').value;
    
    localStorage.setItem('sys-dpi', dpi);
    localStorage.setItem('sys-text-size', txtSize);
    localStorage.setItem('fc-size', fcSize);
    applyCustomSettings(dpi, txtSize, fcSize);
}

function applyCustomSettings(dpi, txtSize, fcSize) {
    let baseSize = 16 * parseFloat(dpi);
    document.documentElement.style.fontSize = baseSize + 'px';
    document.body.style.fontSize = txtSize;
    document.documentElement.style.setProperty('--fc-font-size', fcSize + 'rem');
    let prev = document.getElementById('fc-size-preview');
    if(prev) prev.style.fontSize = fcSize + 'rem';
}

function generateKotobaCard(item, delayIndex) {
    let mainText = item.kanji !== "-" ? item.kanji : item.hiragana;
    let subText = item.kanji !== "-" ? item.hiragana : "";
    let isSaved = checkIsSaved(item.id);
    let delay = delayIndex * 0.05; 
    
    return `
        <div class="vocab-card animate-slide-up" style="animation-delay: ${delay}s; animation-fill-mode: both;" onclick="showKotobaDetail('${item.id}')">
            <div class="vocab-jp">
                <span class="vocab-bab-badge">Bab ${item.bab} - No.${item.no}</span>
                <span class="vocab-kanji">${mainText}</span>
                ${subText ? `<span style="font-size:14px; font-weight:bold; color:var(--text-muted); margin-bottom:5px;">${subText}</span>` : ''}
                <span class="vocab-romaji">${item.romaji}</span>
            </div>
            <div class="vocab-id">
                <span class="vocab-arti">${item.arti}</span>
                <button class="save-icon-btn ${isSaved ? 'saved' : ''}" style="position:relative; top:auto; right:auto; margin-top:10px; background:transparent;" onclick="toggleSaveKotoba('${item.id}', event)">
                    <svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
                </button>
            </div>
        </div>`;
}

// ---------------- LOGIKA DETAIL POPUP (BADGE & SIMPAN) ----------------
function updateDetailSaveBtn(id, btnElementId) {
    let btn = document.getElementById(btnElementId);
    if(checkIsSaved(id)) btn.classList.add('saved');
    else btn.classList.remove('saved');
}

function showKotobaDetail(id) {
    let item = allKotobaFlat.find(x => x.id === id) || savedKotoba.find(x => x.id === id);
    if(!item) return;

    document.getElementById('kd-badge').innerText = `Bab ${item.bab}`;
    
    let saveBtn = document.getElementById('kd-save-btn');
    saveBtn.onclick = (e) => { toggleSaveKotoba(item.id, e); updateDetailSaveBtn(item.id, 'kd-save-btn'); };
    updateDetailSaveBtn(item.id, 'kd-save-btn');

    document.getElementById('kd-kanji').innerText = item.kanji !== "-" ? item.kanji : item.hiragana;
    document.getElementById('kd-kana').innerText = item.kanji !== "-" ? item.hiragana : "";
    document.getElementById('kd-romaji').innerText = item.romaji;
    document.getElementById('kd-arti').innerText = item.arti;
    document.getElementById('kd-contoh-jp').innerText = item.contoh_jp || "Tidak ada contoh";
    document.getElementById('kd-contoh-romaji').innerText = item.contoh_romaji || "";
    document.getElementById('kd-contoh-arti').innerText = item.contoh_arti || "";
    document.getElementById('kotoba-detail-popup').classList.add('show');
}

function showKanjiDetail(id) {
    let item = kanjiDB.find(x => x.id === id) || savedKotoba.find(x => x.id === id);
    if(!item) return;

    document.getElementById('kjd-badge').innerText = item.level;
    
    let saveBtn = document.getElementById('kjd-save-btn');
    saveBtn.onclick = (e) => { toggleSaveKotoba(item.id, e); updateDetailSaveBtn(item.id, 'kjd-save-btn'); };
    updateDetailSaveBtn(item.id, 'kjd-save-btn');

    document.getElementById('kjd-kanji').innerText = item.kanji;
    let kanaText = "";
    if(!item.kunyomi.includes("tidak ada")) kanaText += `${item.kunyomi}`;
    if(!item.onyomi.includes("tidak ada")) kanaText += (kanaText ? " / " : "") + `${item.onyomi}`;
    document.getElementById('kjd-kana').innerText = kanaText || "-";
    document.getElementById('kjd-arti').innerText = item.arti;
    document.getElementById('kjd-contoh-jp').innerText = item.contoh_jp || "Tidak ada contoh";
    document.getElementById('kjd-contoh-romaji').innerText = item.contoh_romaji || "";
    document.getElementById('kjd-contoh-arti').innerText = item.contoh_arti || "";
    document.getElementById('kanji-detail-popup').classList.add('show');
}

let currentKanjiLevel = 'N5';
function filterKanjiView(level) {
    currentKanjiLevel = level;
    document.querySelectorAll('#kanji .btn-chip').forEach(b => b.classList.remove('active'));
    document.getElementById(`chip-kanji-${level.toLowerCase()}`).classList.add('active');
    
    let query = document.getElementById('search-kanji-tab').value.toLowerCase();
    let sortType = document.getElementById('kanji-sort').value;
    
    let filtered = kanjiDB.filter(k => k.level === level);
    
    if (query) {
        filtered = filtered.filter(k => 
            k.arti.toLowerCase().includes(query) || 
            k.kanji.toLowerCase().includes(query) || 
            k.kunyomi.toLowerCase().includes(query) || 
            k.onyomi.toLowerCase().includes(query) ||
            k.romaji.toLowerCase().includes(query)
        );
    }
    
    if (sortType === 'arti') {
        filtered.sort((a, b) => a.arti.localeCompare(b.arti));
    }
    
    document.getElementById('kanji-count').innerText = `${filtered.length} kanji ditemukan`;
    
    const listDiv = document.getElementById('kanji-list-grid');
    if(!listDiv) return;
    listDiv.innerHTML = '';
    
    if(filtered.length === 0) {
        listDiv.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 20px; color:var(--text-muted);">Data Kanji tidak ditemukan.</div>`;
        return;
    }
    
    let html = "";
    filtered.forEach((item, index) => {
        let delay = (index % 20) * 0.02;
        let displayKana = item.kunyomi.includes("tidak ada") ? item.onyomi : item.kunyomi;
        html += `<div class="kanji-card animate-slide-up" style="animation-delay: ${delay}s;" onclick="showKanjiDetail('${item.id}')"><div class="kanji-char">${item.kanji}</div><div class="kanji-kana">${displayKana}</div></div>`;
    });
    listDiv.innerHTML = html;
}

// ---------------- NAVIGASI DASAR ----------------
let appMode = 'belajar';
let searchMode = 'kotoba';

function setAppMode(mode) {
    appMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    let btnMode = document.getElementById('btn-mode-' + mode);
    if(btnMode) btnMode.classList.add('active');
    let homeTitle = document.getElementById('home-title');
    if(homeTitle) homeTitle.innerText = mode === 'belajar' ? 'Mode Belajar' : 'Mode Ujian';
    let bulkExam = document.getElementById('bulk-exam-container');
    if(bulkExam) bulkExam.style.display = mode === 'ujian' ? 'block' : 'none';
    switchTab('home');
}

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
}

function switchTab(tabId) {
    document.querySelectorAll('.container').forEach(c => { c.classList.remove('active'); c.style.display = ''; });
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    let targetTab = document.getElementById(tabId);
    if(targetTab) targetTab.classList.add('active');
    if(document.getElementById('sidebar').classList.contains('open')) toggleMenu();

    let isHome = (tabId === 'home');
    let btnHam = document.getElementById('btn-hamburger');
    if(btnHam) btnHam.style.display = (tabId === 'flashcard-app' || tabId === 'exam-run-tab' || tabId === 'saved-kotoba') ? 'none' : 'flex';
    let btnBack = document.getElementById('btn-back');
    if(btnBack) btnBack.style.display = (tabId === 'flashcard-app' || tabId === 'exam-run-tab' || tabId === 'saved-kotoba') ? 'flex' : 'none';
    let modeToggle = document.getElementById('top-mode-toggle');
    if(modeToggle) modeToggle.style.display = isHome ? 'flex' : 'none';
    
    let topSearch = document.getElementById('btn-top-search');
    if(topSearch) topSearch.style.display = (isHome || tabId === 'preview' || tabId === 'kanji' || tabId === 'bunpou') ? 'flex' : 'none';

    let fab = document.getElementById('fab-saved');
    if(fab) fab.style.display = (tabId === 'home' || tabId === 'preview') ? 'flex' : 'none';

    if(tabId === 'statistik') { updateCharts(); renderHeatmap(); renderExamHistory(); }
    if(tabId === 'saved-kotoba') { document.getElementById('search-saved').value = ''; filterSaved(); }
    if(tabId === 'kanji') { document.getElementById('search-kanji-tab').value = ''; filterKanjiView('N5'); }
}

function closePopup(id) { document.getElementById(id).classList.remove('show'); }

function openGlobalSearch() {
    document.getElementById('global-search-popup').classList.add('show');
    document.getElementById('global-search-input').focus();
    performGlobalSearch();
}

function setSearchMode(mode) {
    searchMode = mode;
    document.getElementById('btn-search-kotoba').classList.toggle('active', mode === 'kotoba');
    document.getElementById('btn-search-kanji').classList.toggle('active', mode === 'kanji');
    performGlobalSearch();
}

function performGlobalSearch() {
    let query = document.getElementById('global-search-input').value.toLowerCase();
    const listDiv = document.getElementById('global-search-results');
    if(!listDiv) return;
    listDiv.innerHTML = '';

    if(!query || query.length < 1) {
        listDiv.innerHTML = `<div style="text-align:center; padding: 20px; color:var(--text-muted); font-size:14px;">Ketik untuk mencari...</div>`;
        return;
    }

    let html = "";
    if (searchMode === 'kotoba') {
        let results = allKotobaFlat.filter(k => 
            k.arti.toLowerCase().includes(query) || k.hiragana.toLowerCase().includes(query) || 
            k.romaji.toLowerCase().includes(query) || (k.kanji !== "-" && k.kanji.toLowerCase().includes(query))
        );
        if(results.length === 0) return listDiv.innerHTML = `<div style="text-align:center; padding: 20px; color:var(--btn-salah); font-size:14px;">Tidak ada hasil Kotoba.</div>`;
        results.slice(0, 50).forEach((item, index) => { html += generateKotobaCard(item, index); });
    } else {
        let results = kanjiDB.filter(k => 
            k.arti.toLowerCase().includes(query) || k.kanji.toLowerCase().includes(query) || 
            k.kunyomi.toLowerCase().includes(query) || k.onyomi.toLowerCase().includes(query) ||
            k.romaji.toLowerCase().includes(query)
        );
        if(results.length === 0) return listDiv.innerHTML = `<div style="text-align:center; padding: 20px; color:var(--btn-salah); font-size:14px;">Tidak ada hasil Kanji.</div>`;
        html = '<div class="kanji-grid">';
        results.slice(0, 50).forEach((item, index) => {
            let displayKana = item.kunyomi.includes("tidak ada") ? item.onyomi : item.kunyomi;
            html += `<div class="kanji-card animate-slide-up" style="animation-delay: ${index*0.02}s;" onclick="showKanjiDetail('${item.id}')"><div class="kanji-char">${item.kanji}</div><div class="kanji-kana">${displayKana}</div></div>`;
        });
        html += '</div>';
    }
    listDiv.innerHTML = html;
}

// ---------------- UI GRIDS ----------------
function initGrids() {
    const fcGrid = document.getElementById('bab-grid');
    const pvChapterBar = document.getElementById('pv-chapter-bar');
    const bpChapterBar = document.getElementById('bp-chapter-bar');
    
    if(fcGrid) fcGrid.innerHTML = ''; 
    if(pvChapterBar) pvChapterBar.innerHTML = ''; 
    if(bpChapterBar) bpChapterBar.innerHTML = ''; 

    Object.keys(db).forEach(bab => {
        if(fcGrid) {
            let btnFc = document.createElement('button'); 
            btnFc.className = 'btn-bab animate-slide-up'; btnFc.innerText = bab; 
            btnFc.style.animationDelay = `${parseInt(bab)*0.02}s`;
            btnFc.onclick = () => handleBabClick(bab);
            fcGrid.appendChild(btnFc);
        }
        if(pvChapterBar) {
            let btnChip = document.createElement('button'); 
            btnChip.className = 'btn-chip'; btnChip.id = 'chip-bab-' + bab; btnChip.innerText = bab; 
            btnChip.onclick = () => showPreview(bab); 
            pvChapterBar.appendChild(btnChip);
        }
    });

    Object.keys(dbBunpou).forEach(bab => {
        if(bpChapterBar) {
            let btnChip = document.createElement('button'); 
            btnChip.className = 'btn-chip'; btnChip.id = 'chip-bp-' + bab; btnChip.innerText = bab; 
            btnChip.onclick = () => showBunpou(bab); 
            bpChapterBar.appendChild(btnChip);
        }
    });

    if(Object.keys(db).length > 0) showPreview(Object.keys(db)[0]);
    if(Object.keys(dbBunpou).length > 0) showBunpou(Object.keys(dbBunpou)[0]);
}

function handleBabClick(bab) {
    if(appMode === 'belajar') { openSetupPopup(bab); } 
    else { openExamSetupPopup([bab]); }
}

function showPreview(bab) {
    document.querySelectorAll('#preview .btn-chip').forEach(b => b.classList.remove('active'));
    let activeChip = document.getElementById('chip-bab-' + bab);
    if(activeChip) activeChip.classList.add('active');
    let pvTitle = document.getElementById('pv-title');
    if(pvTitle) pvTitle.innerText = `Pelajaran ${bab}`;
    let searchPv = document.getElementById('search-preview');
    if(searchPv) searchPv.value = ''; 

    const listDiv = document.getElementById('pv-list'); 
    if(!listDiv) return;
    listDiv.innerHTML = '';
    if(!db[bab]) return;

    let html = "";
    db[bab].forEach((item, index) => { html += generateKotobaCard(item, index); });
    listDiv.innerHTML = html;
}

function filterPreview() {
    let query = document.getElementById('search-preview').value.toLowerCase();
    let cards = document.querySelectorAll('#pv-list .vocab-card');
    cards.forEach(card => {
        let text = card.innerText.toLowerCase();
        card.style.display = text.includes(query) ? 'flex' : 'none';
    });
}

// ---------------- BUNPOU LOGIC ----------------
function showBunpou(bab) {
    document.querySelectorAll('#bunpou .btn-chip').forEach(b => b.classList.remove('active'));
    let activeChip = document.getElementById('chip-bp-' + bab);
    if(activeChip) activeChip.classList.add('active');
    
    let bpTitle = document.getElementById('bp-title');
    if(bpTitle) bpTitle.innerText = `Pelajaran ${bab}`;
    
    let searchBp = document.getElementById('search-bunpou');
    if(searchBp) searchBp.value = ''; 

    const listDiv = document.getElementById('bp-list'); 
    if(!listDiv) return;
    listDiv.innerHTML = '';
    if(!dbBunpou[bab]) return;

    let html = "";
    dbBunpou[bab].forEach((point, index) => { 
        let delay = index * 0.05;
        html += `<div class="vocab-card animate-slide-up" style="animation-delay: ${delay}s; animation-fill-mode: both; flex-direction:column; align-items:flex-start; cursor:default; padding: 20px;">`;
        html += `<h3 style="color:var(--accent); margin-bottom:15px; font-size:1.2rem; border-bottom: 1px solid var(--border); padding-bottom: 10px; width: 100%;">${point.title}</h3>`;
        
        point.details.forEach(line => {
            let hasJp = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(line);
            
            let startsWithAlpha = /^[a-zA-Z]/.test(line.trim());
            let startsWithExplanation = /^(?:\d+\)|\d+\.|\[Perhatian)/i.test(line.trim());
            
            let isExample = hasJp && !startsWithAlpha && !startsWithExplanation;
            
            if (isExample) {
                let jpMatch = line.match(/^([①-⑳\d+\)\]\.\…\s]*)(.*?[。？！])\s*(.*)$/);
                if(!jpMatch) jpMatch = line.match(/^([①-⑳\d+\)\]\.\…\s]*)(.*?[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+.*?)\s+([A-Z].*)$/);
                
                let marker = "", jpText = line, arti = "";

                if (jpMatch) {
                    marker = jpMatch[1];
                    jpText = jpMatch[2];
                    arti = jpMatch[3];
                } else {
                    jpText = line;
                }
                
                html += `
                <div style="margin-top:12px; margin-bottom:12px; width:100%;">
                    <div style="font-size:1.05rem; color:var(--text-main); font-weight:500; line-height:1.4;">${marker}${jpText}</div>
                    ${arti ? `<div style="font-size:0.95rem; color:var(--text-muted); margin-top:4px;">${arti}</div>` : ''}
                </div>`;
            } else {
                let isSubTitle = /^(?:\d+\)|\d+\.)/.test(line.trim());
                let fontWeight = isSubTitle ? "600" : "400";
                let textColor = isSubTitle ? "var(--text-main)" : "var(--text-muted)";
                let marginTop = isSubTitle ? "15px" : "6px";
                
                html += `<div style="font-size:0.95rem; color:${textColor}; font-weight:${fontWeight}; margin-top:${marginTop}; margin-bottom:6px; line-height:1.5;">${line}</div>`;
            }
        });
        html += `</div>`;
    });
    listDiv.innerHTML = html;
}

function filterBunpou() {
    let query = document.getElementById('search-bunpou').value.toLowerCase();
    let cards = document.querySelectorAll('#bp-list .vocab-card');
    cards.forEach(card => {
        let text = card.innerText.toLowerCase();
        card.style.display = text.includes(query) ? 'flex' : 'none';
    });
}

// ---------------- FAVORITE TAB ----------------
let favMode = 'kotoba';
function setFavMode(mode) {
    favMode = mode;
    document.getElementById('btn-fav-kotoba').classList.toggle('active', mode === 'kotoba');
    document.getElementById('btn-fav-kanji').classList.toggle('active', mode === 'kanji');
    filterSaved();
}

function renderSavedKotoba(cardsToRender) {
    const listDiv = document.getElementById('saved-list');
    if(!listDiv) return;
    listDiv.innerHTML = '';
    
    let arr = cardsToRender || savedKotoba;
    let filtered = arr.filter(k => favMode === 'kotoba' ? k.id.startsWith('B') : k.id.startsWith('k'));
    
    if(filtered.length === 0) { 
        listDiv.innerHTML = `<div style="text-align:center; padding: 30px; color:var(--text-muted);">Belum ada ${favMode} yang disimpan.</div>`; 
        return; 
    }
    
    if (favMode === 'kotoba') {
        listDiv.className = 'vocab-list';
        let html = "";
        filtered.forEach((item, index) => { html += generateKotobaCard(item, index); });
        listDiv.innerHTML = html;
    } else {
        listDiv.className = 'kanji-grid';
        let html = "";
        filtered.forEach((item, index) => {
            let delay = (index % 20) * 0.02;
            let displayKana = item.kunyomi.includes("tidak ada") ? item.onyomi : item.kunyomi;
            html += `<div class="kanji-card animate-slide-up" style="animation-delay: ${delay}s;" onclick="showKanjiDetail('${item.id}')"><div class="kanji-char">${item.kanji}</div><div class="kanji-kana">${displayKana}</div></div>`;
        });
        listDiv.innerHTML = html;
    }
}

function filterSaved() {
    let query = document.getElementById('search-saved').value.toLowerCase();
    let arr = savedKotoba;
    if(query) {
        arr = savedKotoba.filter(k => 
            (k.arti && k.arti.toLowerCase().includes(query)) || 
            (k.kanji && k.kanji.toLowerCase().includes(query)) ||
            (k.romaji && k.romaji.toLowerCase().includes(query)) ||
            (k.hiragana && k.hiragana.toLowerCase().includes(query)) ||
            (k.kunyomi && k.kunyomi.toLowerCase().includes(query)) ||
            (k.onyomi && k.onyomi.toLowerCase().includes(query))
        );
    }
    renderSavedKotoba(arr);
}

// ---------------- FLASHCARD ----------------
let fcCards = []; let fcIndex = 0; let isFcRandom = false; let tempBab = null; let fcSetup = { front: 'kanji', evalMode: true };
let sessionStats = { totalBenar: 0, totalSalah: 0 };

function openSetupPopup(bab) { tempBab = bab; document.getElementById('fc-setup-popup').classList.add('show'); }
function selectSetupFront(val, ev) { fcSetup.front = val; document.querySelectorAll('#setup-front-group .btn-select').forEach(btn => btn.classList.remove('active')); if(ev && ev.currentTarget) ev.currentTarget.classList.add('active'); }
function selectSetupEval(val, ev) { fcSetup.evalMode = val; document.querySelectorAll('#setup-eval-group .btn-select').forEach(btn => btn.classList.remove('active')); if(ev && ev.currentTarget) ev.currentTarget.classList.add('active'); }
function confirmFlashcardSetup() { closePopup('fc-setup-popup'); startFlashcard(tempBab); }

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
    recordActivity(); 
    fcCards = [...db[bab]]; fcIndex = 0; sessionStats.totalBenar = 0; sessionStats.totalSalah = 0;
    updateCounters();
    if(isFcRandom) fcCards.sort(() => 0.5 - Math.random());

    if(fcSetup.evalMode) {
        document.getElementById('fc-actions-eval').style.display = 'grid'; document.getElementById('fc-actions-nav').style.display = 'none'; document.getElementById('fc-counter-display').style.visibility = 'visible';
    } else {
        document.getElementById('fc-actions-eval').style.display = 'none'; document.getElementById('fc-actions-nav').style.display = 'grid'; document.getElementById('fc-counter-display').style.visibility = 'hidden';
    }
    showNextCard();
}

function updateCounters() { document.getElementById('cnt-salah').innerText = sessionStats.totalSalah; document.getElementById('cnt-benar').innerText = sessionStats.totalBenar; }

function showNextCard() {
    updateCounters();
    document.getElementById('card').classList.remove('flipped');
    let currentCard = fcCards[fcIndex];
    document.getElementById('status-msg').innerText = `Kartu Ke-${fcIndex + 1} dari ${fcCards.length} (Bab ${currentCard.bab} - No.${currentCard.no})`;

    let mainTxt, subTxt, romTxt, artiTxt;
    if (fcSetup.front === 'kanji') {
        mainTxt = currentCard.kanji !== "-" ? currentCard.kanji : currentCard.hiragana;
        subTxt = currentCard.kanji !== "-" ? currentCard.hiragana : "";
        romTxt = currentCard.romaji; artiTxt = currentCard.arti;
    } else if (fcSetup.front === 'hiragana') {
        mainTxt = currentCard.hiragana;
        subTxt = currentCard.kanji !== "-" ? currentCard.kanji : "";
        romTxt = currentCard.romaji; artiTxt = currentCard.arti;
    } else if (fcSetup.front === 'arti') {
        mainTxt = currentCard.arti; subTxt = "";
        artiTxt = currentCard.kanji !== "-" ? `${currentCard.kanji} (${currentCard.hiragana})` : currentCard.hiragana;
        romTxt = currentCard.romaji;
    }

    let frontEl = document.getElementById('fc-front');
    frontEl.innerText = mainTxt;
    frontEl.classList.remove('fc-text-normal', 'fc-text-medium', 'fc-text-long', 'fc-text-xlong');
    let txtLen = mainTxt.length;
    if (txtLen > 18) frontEl.classList.add('fc-text-xlong');
    else if (txtLen > 10) frontEl.classList.add('fc-text-long');
    else if (txtLen > 5) frontEl.classList.add('fc-text-medium');
    else frontEl.classList.add('fc-text-normal');

    document.getElementById('fc-furi').innerText = subTxt; document.getElementById('fc-romaji').innerText = romTxt; document.getElementById('fc-arti').innerText = artiTxt;
    
    let isSaved = checkIsSaved(currentCard.id);
    let btnF = document.getElementById('fc-save-btn-front'); let btnB = document.getElementById('fc-save-btn-back');
    if (btnF) isSaved ? btnF.classList.add('saved') : btnF.classList.remove('saved');
    if (btnB) isSaved ? btnB.classList.add('saved') : btnB.classList.remove('saved');
}

function flipCard() { if(fcCards.length > 0) document.getElementById('card').classList.toggle('flipped'); }

function toggleSaveFromFC(event) {
    event.stopPropagation();
    if (fcCards.length > 0) { toggleSaveKotoba(fcCards[fcIndex].id, event); showNextCard(); }
}

function markCard(isCorrect) {
    if (isCorrect) sessionStats.totalBenar++; else sessionStats.totalSalah++;
    let globalRet = JSON.parse(localStorage.getItem('kn5_retention')) || { benar: 0, salah: 0 };
    if (isCorrect) globalRet.benar++; else globalRet.salah++;
    localStorage.setItem('kn5_retention', JSON.stringify(globalRet));

    fcIndex++;
    if (fcIndex >= fcCards.length) { fcIndex = 0; if (isFcRandom) fcCards.sort(() => 0.5 - Math.random()); }
    showNextCard();
}

function navCard(direction) {
    fcIndex += direction;
    if (fcIndex >= fcCards.length) { fcIndex = 0; if (isFcRandom) fcCards.sort(() => 0.5 - Math.random()); } 
    else if (fcIndex < 0) { fcIndex = fcCards.length - 1; }
    showNextCard();
}

// ---------------- UJIAN ----------------
let examQuestions = []; let currentQIndex = 0; let score = 0; let currentExamPool = []; let timerInterval; let timeExamStarted = 0; let tempSelectedExamBabs = [];

function openBulkExamPopup() {
    let container = document.getElementById('bulk-exam-list'); container.innerHTML = '';
    Object.keys(db).forEach(bab => {
        container.innerHTML += `<label style="display:flex; gap:10px; padding:10px; border:1px solid var(--border); margin-bottom:5px; border-radius:8px; cursor:pointer; align-items:center;"><input type="checkbox" value="${bab}" class="bulk-cb" style="accent-color:var(--accent); width:18px; height:18px;"> Bab ${bab}</label>`;
    });
    document.getElementById('bulk-exam-popup').classList.add('show');
}

function startBulkExam() {
    let selected = Array.from(document.querySelectorAll('.bulk-cb:checked')).map(cb => cb.value);
    if(selected.length === 0) return alert("Pilih minimal 1 bab!");
    closePopup('bulk-exam-popup'); openExamSetupPopup(selected);
}

function openExamSetupPopup(babsArr) {
    tempSelectedExamBabs = babsArr; let pool = [];
    babsArr.forEach(b => { if(db[b]) pool = pool.concat(db[b]); });
    let maxAvailable = pool.length; let inputSoal = document.getElementById('exam-jumlah-soal');
    inputSoal.max = maxAvailable; if(parseInt(inputSoal.value) > maxAvailable) inputSoal.value = maxAvailable;
    document.getElementById('max-soal-hint').innerText = `Maksimal soal tersedia: ${maxAvailable}`;
    document.getElementById('exam-setup-popup').classList.add('show');
}

function confirmStartExam() {
    closePopup('exam-setup-popup'); recordActivity(); 
    currentExamPool = []; tempSelectedExamBabs.forEach(b => { if(db[b]) currentExamPool = currentExamPool.concat(db[b]); });

    let reqCount = parseInt(document.getElementById('exam-jumlah-soal').value); 
    let finalCount = Math.min(reqCount, currentExamPool.length);
    if(currentExamPool.length < 4) return alert("Kosakata belum mencukupi untuk membuat soal.");

    examQuestions = currentExamPool.sort(() => 0.5 - Math.random()).slice(0, finalCount); 
    currentQIndex = 0; score = 0; timeExamStarted = Date.now();

    switchTab('exam-run-tab');
    document.getElementById('exam-run').style.display = 'block'; document.getElementById('exam-result').style.display = 'none'; document.getElementById('btn-next-q').style.display = 'none';
    clearInterval(timerInterval); 
    let timerMin = parseFloat(document.getElementById('exam-timer-input').value); let timerDisplay = document.getElementById('exam-timer-display');
    if(timerMin && timerMin > 0) {
        let seconds = Math.floor(timerMin * 60); timerDisplay.style.display = 'inline';
        timerInterval = setInterval(() => { 
            seconds--; let m = Math.floor(seconds / 60); let s = seconds % 60; 
            timerDisplay.innerText = `${m}:${s < 10 ? '0' : ''}${s}`; 
            if(seconds <= 0) { clearInterval(timerInterval); alert("Waktu Ujian Habis!"); finishExam(); } 
        }, 1000);
    } else { timerDisplay.style.display = 'none'; }
    loadQuestion();
}

function loadQuestion() {
    if (currentQIndex >= examQuestions.length) return finishExam();
    let dir = document.getElementById('exam-direction').value; let diff = document.getElementById('exam-difficulty').value; 
    let useKanji = document.getElementById('exam-use-kanji').checked;
    let q = examQuestions[currentQIndex];
    let isJpToId = dir === 'jp-id' || (dir === 'random' && Math.random() > 0.5);

    document.getElementById('exam-progress').innerText = `Soal: ${currentQIndex + 1} / ${examQuestions.length}`; 
    document.getElementById('exam-score').innerText = `Skor: ${score}`;

    let textToDisplay = useKanji && q.kanji !== "-" ? q.kanji : q.hiragana;
    let questionText = isJpToId ? textToDisplay : q.arti;
    let correctAnswer = isJpToId ? q.arti : `${useKanji && q.kanji !== "-" ? q.kanji + " " : ""}(${q.hiragana})`;

    document.getElementById('mc-q').innerText = questionText;

    let wrongOptions = currentExamPool.filter(item => item.id !== q.id).sort(() => 0.5 - Math.random());
    let optionCount = diff === 'easy' ? 2 : (diff === 'hard' ? 4 : 3); wrongOptions = wrongOptions.slice(0, optionCount - 1);

    let options = [{ text: correctAnswer, isCorrect: true }];
    wrongOptions.forEach(wo => options.push({ 
        text: isJpToId ? wo.arti : `${useKanji && wo.kanji !== "-" ? wo.kanji + " " : ""}(${wo.hiragana})`, 
        isCorrect: false 
    }));
    options.sort(() => 0.5 - Math.random()); 

    let optsDiv = document.getElementById('mc-opts'); optsDiv.innerHTML = '';
    options.forEach(opt => { 
        let btn = document.createElement('button'); btn.className = 'mc-btn'; btn.innerText = opt.text; 
        btn.onclick = () => handleAnswer(btn, opt.isCorrect); optsDiv.appendChild(btn); 
    });
}

function handleAnswer(btn, isCorrect) {
    let buttons = document.querySelectorAll('.mc-btn'); buttons.forEach(b => b.style.pointerEvents = 'none'); 
    let showAnswer = document.getElementById('exam-show-answer').checked;

    if (isCorrect) { btn.classList.add('correct'); score++; document.getElementById('exam-score').innerText = `Skor: ${score}`; } 
    else { 
        btn.classList.add('wrong'); 
        if (showAnswer) { 
            let useKanji = document.getElementById('exam-use-kanji').checked;
            let q = examQuestions[currentQIndex]; 
            buttons.forEach(b => { 
                if(b.innerText.includes(q.arti) || b.innerText.includes(q.hiragana) || (useKanji && b.innerText.includes(q.kanji))) { b.classList.add('correct-reveal'); }
            }); 
        } 
    }
    document.getElementById('btn-next-q').style.display = 'block';
}

function nextExamQuestion() { document.getElementById('btn-next-q').style.display = 'none'; currentQIndex++; loadQuestion(); }

function finishExam() {
    clearInterval(timerInterval); 
    let timeExamEnded = Date.now(); let timeDiff = Math.floor((timeExamEnded - timeExamStarted) / 1000); 
    let m = Math.floor(timeDiff / 60); let s = timeDiff % 60; let timeStr = `${m}m ${s}s`;

    document.getElementById('exam-run').style.display = 'none'; document.getElementById('exam-result').style.display = 'block';
    document.getElementById('res-score').innerText = score; document.getElementById('res-time').innerText = timeStr; document.getElementById('res-total').innerText = examQuestions.length;
    
    saveExamHistory(score, examQuestions.length, timeStr, tempSelectedExamBabs.join(', '));
}

function abortExam() { if(confirm("Yakin ingin mengakhiri ujian ini?")) finishExam(); }
function goHomeFromExam() { switchTab('home'); }

// ---------------- STATS ----------------
function updateStatistik() {
    let total = 0; Object.values(db).forEach(babArray => { total += babArray.length; });
    document.getElementById('stat-total').innerText = total;
}
let chartRetrievabilityInstance;
function updateCharts() {
    if(chartRetrievabilityInstance) chartRetrievabilityInstance.destroy();
    const ctx2 = document.getElementById('chartRetrievability').getContext('2d');
    let globalRet = JSON.parse(localStorage.getItem('kn5_retention')) || { benar: 0, salah: 0 };
    if(ctx2) {
        chartRetrievabilityInstance = new Chart(ctx2, {
            type: 'bar', data: { labels: ['Benar', 'Salah'], datasets: [{ label: 'Total Jawaban', data: [globalRet.benar, globalRet.salah], backgroundColor: ['#059669', '#e11d48'], borderRadius: 4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: '#94a3b8' } }, x: { ticks: { color: '#94a3b8' } } } }
        });
    }
}
function renderHeatmap() {
   const heatmapDiv = document.getElementById('github-heatmap'); if(!heatmapDiv) return; heatmapDiv.innerHTML = '';
   let today = new Date();
   for(let i = 29; i >= 0; i--) {
       let d = new Date(today); d.setDate(d.getDate() - i); let dateStr = d.toISOString().split('T')[0];
       let count = userActivity[dateStr] || 0; let level = 0;
       if(count > 0 && count <= 2) level = 1; else if(count > 2 && count <= 5) level = 2; else if(count > 5) level = 3;
       heatmapDiv.innerHTML += `<div class="heatmap-cell level-${level}" title="${d.toLocaleDateString('id-ID')} : ${count} Aktivitas"></div>`;
   }
}

function renderExamHistory() {
   const histDiv = document.getElementById('exam-history-list'); if(!histDiv) return; histDiv.innerHTML = '';
   if(examHistory.length === 0){ histDiv.innerHTML = '<div style="color:var(--text-muted); font-size:13px; text-align:center;">Belum ada histori ujian.</div>'; return; }
   examHistory.forEach((h) => {
       let percentage = Math.round((h.score / h.total) * 100); 
       let color = percentage >= 75 ? 'var(--btn-benar)' : (percentage >= 50 ? '#f59e0b' : 'var(--btn-salah)');
       let babsText = h.babs ? `(Bab ${h.babs})` : '';
       
       histDiv.innerHTML += `
       <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--border);">
           <div>
               <div style="font-weight:bold; font-size:14px;">Ujian Ke-${h.no} <span style="font-size:12px; color:var(--accent); font-weight:normal;">${babsText}</span></div>
               <div style="font-size:12px; color:var(--text-muted);">${h.date} | ⏱ ${h.time}</div>
           </div>
           <div style="text-align:right;">
               <div style="font-weight:bold; color:${color};">${h.score}/${h.total}</div>
               <div style="font-size:12px; color:var(--text-muted);">${percentage}%</div>
           </div>
       </div>`;
   });
}

function exportStatsPDF() {
   document.body.classList.add('pdf-export-mode'); document.getElementById('btn-export-pdf').style.display = 'none';
   const element = document.getElementById('stats-content');
   const opt = { margin: 15, filename: 'Kiso_Data_Statistik_Belajar.pdf', image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
   html2pdf().set(opt).from(element).save().then(() => { document.body.classList.remove('pdf-export-mode'); document.getElementById('btn-export-pdf').style.display = 'block'; });
}

function copyRekening() { 
    navigator.clipboard.writeText("107397547525").then(() => { 
        showToast("Nomor Rekening Jago berhasil disalin!"); 
    }); 
}

function showToast(message) {
    let toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(function(){ toast.classList.remove("show"); }, 3000);
}

window.onload = function() { loadData(); };

// Tutup popup jika area gelap (overlay) di luar konten diklik
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('popup-overlay')) {
        e.target.classList.remove('show');
    }
});
