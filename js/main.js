// PDF.js Konfigürasyonu
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// Uygulama Genel Değişkenleri
let mevcutTarih = new Date(2026, 6, 1);
let kayitlar = [{ tarih: "2026-07-27", taraf: "Ankara Valiliği", konu: "Savunma Vermek" }];

// Dinamik Modül Yükleme Fonksiyonu
async function modulYukle(modulAdi) {
    const appBody = document.getElementById('app-body');
    if (!appBody) return;

    appBody.innerHTML = `<div style="text-align:center; margin-top:50px; color:var(--primary-light); font-weight:600;">Modül Yükleniyor...</div>`;

    // Navigasyon Butonlarının Aktiflik Durumunu Güncelle
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const aktifBtn = document.getElementById(`btn-${modulAdi}`);
    if (aktifBtn) aktifBtn.classList.add('active');

    try {
        const response = await fetch(`modules/${modulAdi}.html`);
        if (!response.ok) throw new Error('Modül dosyası bulunamadı.');
        const html = await response.text();

        appBody.innerHTML = html;

        // Yüklenen HTML içerisindeki <script> etiketlerini çalıştır
        const scripts = appBody.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });

    } catch (error) {
        console.error(error);
        appBody.innerHTML = `<div class="card" style="color:var(--danger); text-align:center;">⚠️ Modül yüklenirken bir hata oluştu: ${error.message}</div>`;
    }
}

// Sayfa Yüklendiğinde Varsayılan Olarak Dashboard Modülünü Aç
window.onload = () => {
    modulYukle('dashboard');
};