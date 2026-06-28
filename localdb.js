// ==========================================================================
// localdb.js - LOGIKA DATABASE & STORAGE & PARSER
// ==========================================================================

let db = {};
let dbBunpou = {};
let allKotobaFlat = [];
let kanjiDB = [];
let savedKotoba = JSON.parse(localStorage.getItem('kn5_saved')) || [];
let userActivity = JSON.parse(localStorage.getItem('kn5_activity')) || {};
let examHistory = JSON.parse(localStorage.getItem('kn5_exam_history')) || [];

function recordActivity() {
    let today = new Date().toISOString().split('T')[0];
    if (!userActivity[today]) userActivity[today] = 0;
    userActivity[today]++;
    localStorage.setItem('kn5_activity', JSON.stringify(userActivity));
}

function saveExamHistory(score, total, timeStr, babs) {
    let today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    let examNumber = examHistory.length > 0 ? examHistory[0].no + 1 : 1;
    examHistory.unshift({ no: examNumber, date: today, score: score, total: total, time: timeStr, babs: babs || '-' });
    
    // Tingkatkan limit histori dari 20 menjadi 100 agar statistik per bab bisa direkam lebih lama
    if(examHistory.length > 100) examHistory.pop(); 
    localStorage.setItem('kn5_exam_history', JSON.stringify(examHistory));
}

async function loadData() {
    try {
        const resKotoba = await fetch('Kosakata_Minna_No_Nihongo_Bab1-25_Lengkap_Revised.txt');
        if (resKotoba.ok) parseKotoba(await resKotoba.text());
        else throw new Error("Gagal memuat Kosakata_Minna_No_Nihongo_Bab1-25_Lengkap_Revised.txt");

        const resKanjiN5 = await fetch('Kanji_N5.txt');
        if (resKanjiN5.ok) parseKanji(await resKanjiN5.text(), 'N5');

        const resKanjiN4 = await fetch('Kanji_N4.txt');
        if (resKanjiN4.ok) parseKanji(await resKanjiN4.text(), 'N4');

        const resBunpou = await fetch('Tata_Bahasa_Lengkap_BAB1-25.txt');
        if (resBunpou.ok) parseBunpou(await resBunpou.text());

        if(Object.keys(db).length === 0) throw new Error("Data Kosakata Kosong");

        document.getElementById('loader').style.display = 'none';
        
        initSettings();
        updateStatistik();
        initGrids();
        filterSaved();
        renderHeatmap();
        renderExamHistory();
        
        switchTab('home');

    } catch (err) {
        console.error("Load Data Error:", err);
        const errDiv = document.getElementById('loader-error');
        if (errDiv) {
            errDiv.style.display = 'block';
            errDiv.innerHTML = `Gagal sinkron file TXT.<br><span style="font-size:12px; font-weight:normal; color:var(--text-muted);">(Info: ${err.message}. Harap pastikan kamu membuka index.html melalui fitur Live Server).</span>`;
        }
    }
}

function parseKotoba(text) {
    const lines = text.split('\n'); 
    let currentBab = 0;
    let indexUrutan = 1;
    allKotobaFlat = [];
    
    lines.forEach(line => {
        line = line.trim(); 
        if(!line) return;
        if (line.toLowerCase().startsWith('pelajaran')) {
            let match = line.match(/\d+/);
            if(match) {
                currentBab = parseInt(match[0]); 
                db[currentBab] = [];
                indexUrutan = 1; 
            }
        } else if (line.includes(' : ') && currentBab !== 0) {
            let jepang = "", arti = "", c_jp = "", c_rom = "", c_art = "";
            let matchFull = line.match(/^(.+?)\s*:\s*(.+?)\s*-\s*(.+?)\s*\((.+?)\s*-\s*(.+?)\)\.?\s*$/);
            
            if (matchFull) {
                jepang = matchFull[1].trim(); 
                arti = matchFull[2].trim();
                c_jp = matchFull[3].trim(); 
                c_rom = matchFull[4].trim(); 
                c_art = matchFull[5].trim();
            } else {
                let parts = line.split(' : ');
                jepang = parts[0].trim();
                let rest = (parts[1] || "").trim();
                if(rest.includes(' - ')) {
                    let p2 = rest.split(' - ');
                    arti = p2[0].trim();
                    c_jp = p2.slice(1).join(' - ').trim();
                } else { 
                    arti = rest; 
                }
            }

            // SAFE REPLACE: MENGHAPUS STRIP PADA ARTI KATA (Misal: ragu-ragu -> ragu ragu)
            if (arti && typeof arti === 'string') {
                arti = arti.replace(/([a-zA-Z])-([a-zA-Z])/g, "$1 $2");
            }

            let kanji = "-"; let hiragana = jepang;
            let matchKana = jepang.match(/(.+?)\s*\((.+?)\)/);
            if(matchKana) { kanji = matchKana[1].trim(); hiragana = matchKana[2].trim(); }
            
            let uniqueId = `B${currentBab}_${indexUrutan}`;
            let wordObj = { 
                id: uniqueId, bab: currentBab, no: indexUrutan, 
                kanji: kanji, hiragana: hiragana, romaji: toRomaji(hiragana), arti: arti,
                contoh_jp: c_jp, contoh_romaji: c_rom, contoh_arti: c_art
            };
            db[currentBab].push(wordObj);
            allKotobaFlat.push(wordObj);
            indexUrutan++;
        }
    });
}

function parseKanji(text, level) {
    const lines = text.split('\n');
    lines.forEach(line => {
        line = line.trim();
        if(!line || line.startsWith('==') || line.startsWith('---') || line.startsWith('KANJI')) return;
        
        let match = line.match(/^\d+\.\s+(\S+)\s+-\s+(.+?)\s+\/\s+(.+?)\s+-\s+(.+?)\s+-\s+(.+?)\s*\((.+?)\s*-\s*(.+?)\)\.?\s*$/);
        if(match) {
            let kun = match[2].trim();
            let on = match[3].trim();
            let combinedKana = (kun.includes("tidak") ? "" : kun) + " " + (on.includes("tidak") ? "" : on);
            
            kanjiDB.push({
                id: `k${level}_${kanjiDB.length+1}`, 
                kanji: match[1].trim(), kunyomi: kun, onyomi: on,
                romaji: toRomaji(combinedKana),
                arti: match[4].trim(), contoh_jp: match[5].trim(), contoh_romaji: match[6].trim(), 
                contoh_arti: match[7].trim(), level: level
            });
        }
    });
}

function parseBunpou(text) {
    const lines = text.split('\n');
    let currentBab = 0;
    let currentPoint = null;

    lines.forEach(line => {
        line = line.replace(new RegExp('\\[source:\\s*\\d+\\]', 'g'), '').trim();
        if(!line || line === 'IV. Keterangan Tata Bahasa') return;

        let babMatch = line.match(/^BAB\s+(\d+)$/i);
        if(babMatch) {
            currentBab = parseInt(babMatch[1]);
            dbBunpou[currentBab] = [];
            currentPoint = null;
            return;
        }

        if(line.startsWith('=========')) return;

        let titleMatch = line.match(/^(\d+\.)\s+(.+)/);
        if(titleMatch && currentBab > 0) {
            currentPoint = { title: line, details: [] };
            dbBunpou[currentBab].push(currentPoint);
        } else if(currentPoint) {
            currentPoint.details.push(line);
        }
    });
}

function checkIsSaved(id) { 
    return savedKotoba.some(k => k.id === id); 
}

function toggleSaveKotoba(id, event) {
    if(event) event.stopPropagation();
    let obj = allKotobaFlat.find(k => k.id === id) || kanjiDB.find(k => k.id === id);
    if(!obj) return;

    let index = savedKotoba.findIndex(k => k.id === id);
    if(index === -1) {
        savedKotoba.push(obj);
        if(event && event.currentTarget) event.currentTarget.classList.add('saved');
    } else {
        savedKotoba.splice(index, 1);
        if(event && event.currentTarget) event.currentTarget.classList.remove('saved');
    }
    localStorage.setItem('kn5_saved', JSON.stringify(savedKotoba));
    
    if(document.getElementById('saved-kotoba').classList.contains('active')) filterSaved();
}
