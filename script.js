let currentLang = 'th';

const translations = {
    th: {
        title: "🌦️ พยากรณ์ฝนฟรุ่งฟริ้ง ✨",
        howTitle: "❓ วิธีใช้งาน (How to use)",
        howText: "1. สมัครใช้งานที่ <a href='https://app.tomorrow.io/signin' target='_blank'>Tomorrow.io</a><br>2. ไปที่หน้า <a href='https://app.tomorrow.io/development/keys' target='_blank'>API Keys</a><br>3. ก๊อปปี้ <b>My API Key</b> มาใส่ช่องล่าง (ใส่ครั้งเดียวจบ!)",
        keyPlace: "วาง API Key ตรงนี้เลยจ้า",
        coordPlace: "พิกัด Lat, Long",
        btn: "ดูพยากรณ์เลยยย 💖",
        thTime: "ระยะเวลา",
        thProb: "โอกาสฝนตก (%)",
        unitMin: "นาทีข้างหน้า",
        unitHr: "ชม. ข้างหน้า",
        error: "อุ๊ย! ดึงข้อมูลไม่ได้ ลองเช็ค Key หรือพิกัดนะจ๊ะ 🎀"
    },
    en: {
        title: "🌦️ Rain Forecast ✨",
        howTitle: "❓ How to use",
        howText: "1. Register at <a href='https://app.tomorrow.io/signin' target='_blank'>Tomorrow.io</a><br>2. Go to <a href='https://app.tomorrow.io/development/keys' target='_blank'>API Keys</a><br>3. Copy <b>My API Key</b> and paste below (One-time setup!)",
        keyPlace: "Paste your API Key here",
        coordPlace: "Coordinates Lat, Long",
        btn: "Check Forecast 💖",
        thTime: "Duration",
        thProb: "Rain Chance (%)",
        unitMin: "mins later",
        unitHr: "hrs later",
        error: "Oops! Fetch failed. Check Key or coords 🎀"
    }
};

window.onload = function() {
    const savedKey = localStorage.getItem('myRainApiKey');
    if (savedKey) {
        document.getElementById('apiKey').value = savedKey;
        // ถ้ามี Key อยู่แล้ว ให้ซ่อนส่วนกรอก และโชว์ปุ่ม Change แทน
        document.getElementById('keySection').style.display = 'none';
        document.getElementById('changeKeyBtn').style.display = 'inline-block';
    }
};

function showKeyInput() {
    document.getElementById('keySection').style.display = 'block';
    document.getElementById('changeKeyBtn').style.display = 'none';
}

function toggleHowTo() {
    const content = document.getElementById('howToContent');
    content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
}

function toggleLang(lang) {
    currentLang = lang;
    document.getElementById('btn-th').classList.toggle('active', lang === 'th');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    
    document.getElementById('title').innerText = translations[lang].title;
    document.getElementById('how-to-title').innerText = translations[lang].howTitle;
    document.getElementById('how-to-text').innerHTML = translations[lang].howText;
    document.getElementById('apiKey').placeholder = translations[lang].keyPlace;
    document.getElementById('coords').placeholder = translations[lang].coordPlace;
    document.getElementById('fetchBtn').innerText = translations[lang].btn;
    document.getElementById('th-time').innerText = translations[lang].thTime;
    document.getElementById('th-prob').innerText = translations[lang].thProb;
}

async function getRainForecast() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const coords = document.getElementById('coords').value.replace(/\s+/g, '');

    if (!apiKey) {
        alert(currentLang === 'th' ? 'ใส่ API Key ก่อนนะจ๊ะ!' : 'Please enter API Key!');
        return;
    }

    localStorage.setItem('myRainApiKey', apiKey);
    
    // หลังจากบันทึกแล้ว ซ่อนช่องใส่เลย
    document.getElementById('keySection').style.display = 'none';
    document.getElementById('changeKeyBtn').style.display = 'inline-block';

    const url = `https://api.tomorrow.io/v4/weather/forecast?location=${coords}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const minutely = data.timelines.minutely;
        const hourly = data.timelines.hourly;
        
        const targets = [5, 10, 20, 30, 60, 120, 180, 240, 300, 360];
        let html = '';

        targets.forEach(min => {
            let prob = 0;
            let label = (min <= 30) ? `${min} ${translations[currentLang].unitMin}` : `${min/60} ${translations[currentLang].unitHr}`;
            
            if (min <= 30) {
                prob = minutely[min].values.precipitationProbability;
            } else {
                prob = hourly[min/60].values.precipitationProbability;
            }

            html += `<tr><td>${label}</td><td class="${prob > 50 ? 'rain-high' : ''}">${prob} % 💧</td></tr>`;
        });

        document.getElementById('resultBody').innerHTML = html;
        document.getElementById('resultTable').style.display = 'table';
    } catch (error) {
        alert(translations[currentLang].error);
    }
}