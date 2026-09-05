'use strict';
const translations = {
  skip:'Langsung ke konten', navHow:'Cara kerja', navApp:'Jelajahi aplikasi', navPrivacy:'Untuk kamu', navJoin:'Akses awal',
  beta:'Sedikit bantuan mengingat. Segera di Android.', headline:'Hadir untuk<br>hal-hal kecil.',
  description:'Pekerjaan barunya. Kepindahannya. Pesanan kopinya. Ingat hal-hal penting tentang orang-orang yang berarti bagimu.',
  getAccess:'Dapatkan akses awal', seeApp:'Lihat cara kerjanya', heroNote:'Catatan suara singkat. Percakapan berikutnya jadi lebih bermakna.',
  nudgeLabel:'Pengingat kecil', nudgeTitle:'Ngopi dengan Dira 30 menit lagi', nudgeText:'Tanyakan perkembangan studio barunya.',
  benefit1:'Ingatanmu, dalam kendalimu', benefit2:'Bicara apa adanya. Simpan detailnya.', benefit3:'Tanpa feed. Tanpa streak. Tentang orang.',
  howLabel:'Kebiasaan kecil. Perbedaan berarti.', howTitle:'Hidup bergerak cepat.<br>Simpan detailnya dekat.',
  howDescription:'Sedikit ruang antara percakapan terakhir dan pertemuan berikutnya. Di situlah One Call Away membantu.',
  step1Title:'Ceritakan selagi masih segar.', step1Body:'Baru bertemu seseorang? Luangkan waktu untuk bercerita. Tanpa formulir. Tanpa perlu kata-kata sempurna.', step1Link:'Coba catatan suara',
  step2Title:'Beri detailnya tempat.', step2Body:'Catatanmu menjadi ingatan yang jelas, tersusun per orang. Periksa, edit, dan simpan yang sesuai.', step2Link:'Jelajahi ingatanmu',
  step3Title:'Lanjutkan percakapannya.', step3Body:'Sebelum bertemu lagi, dapatkan sedikit konteks. Kurangi “ingatkan aku”. Perbanyak “gimana hasilnya?”', step3Link:'Kenali pengingatmu',
  photoCaption:'Lebih hadir.<br>Lebih ringan di pikiran.', humanLabel:'Dibuat untuk kehidupan nyata', humanTitle:'Orang bukan daftar tugas.',
  humanBody:'Kamu tidak butuh skor untuk tahu siapa yang berarti. Cukup sedikit bantuan mengingat hal-hal yang memang kamu pedulikan.',
  principle1Title:'Kamu pilih yang disimpan.', principle1Body:'Periksa setiap detail sebelum menjadi ingatan.',
  principle2Title:'Konteks, tanpa gangguan.', principle2Body:'Pengingat berguna. Tanpa feed atau peringkat hubungan.',
  principle3Title:'Sesuai ritmemu.', principle3Body:'Tanpa streak. Tanpa rasa bersalah saat hidup sibuk.',
  tourLabel:'Lihat lebih dekat', tourTitle:'Ruang yang tenang<br>untuk ingatanmu.', tourBody:'Dari catatan suara pertama sampai percakapan berikutnya. Jelajahi delapan layar konsep Android kami.',
  tourButton:'Jelajahi aplikasi Android', tour1:'Simpan sebuah cerita', tour2:'Temukan orang-orangmu', tour3:'Ingat di saat yang tepat', tourNote:'Prototipe interaktif · Dilengkapi contoh ingatan',
  joinLabel:'Hal baik dimulai dari percakapan.', joinTitle:'Buat yang berikutnya<br>lebih personal.', joinBody:'One Call Away segera hadir di Android. Gabung daftar tunggu dan beri ingatanmu sedikit bantuan.',
  emailLabel:'Alamat emailmu', joinButton:'Aku ikut', joinNote:'Hanya kabar beta. Berhenti berlangganan kapan saja.',
  faqTitle:'Beberapa hal yang mungkin kamu tanyakan.', faq1Q:'Apakah percakapanku direkam?', faq1A:'Tidak. Kamu merekam catatan suaramu sendiri setelah percakapan, dengan kata-katamu sendiri. Kamu memeriksa detailnya sebelum menyimpan.',
  faq2Q:'Kapan aplikasi Android bisa dicoba?', faq2A:'Kami sedang menyiapkan beta Android. Gabung daftar tunggu untuk kabar terbaru, atau coba prototipe interaktif di atas sekarang.',
  faq3Q:'Perlukah membuat akun dulu?', faq3A:'Pengalaman catatan pertama dirancang tanpa akun. Kamu bisa mencoba prototipe browser tanpa masuk.', footerLine:'Sedikit lebih hadir.', footerAbout:'Pendekatan kami'
};
const english = new Map([...document.querySelectorAll('[data-t]')].map(el=>[el,el.innerHTML]));
let lang = navigator.language.startsWith('id')?'id':'en';
try { const saved=localStorage.getItem('oca-lang'); if(['en','id'].includes(saved))lang=saved; } catch { /* Preference storage is optional. */ }
const languageButton=document.querySelector('.language');
function setLanguage(value){
  lang=value;document.documentElement.lang=lang;
  english.forEach((original,el)=>{el.innerHTML=lang==='id'?(translations[el.dataset.t]||original):original;});
  languageButton.textContent=lang==='id'?'EN':'ID';
  languageButton.setAttribute('aria-label',lang==='id'?'Switch to English':'Switch to Indonesian');
  try {localStorage.setItem('oca-lang',lang);}catch{/* The page works without storage. */}
}
setLanguage(lang);
languageButton.addEventListener('click',()=>setLanguage(lang==='en'?'id':'en'));
const form=document.querySelector('#waitlist');
let pending=false;
form.addEventListener('submit',async event=>{
  event.preventDefault();if(pending||!form.reportValidity())return;
  const email=document.querySelector('#email').value.trim();
  const message=document.querySelector('#form-msg');
  const button=form.querySelector('button');
  if(typeof SUPABASE_URL==='undefined'||typeof SUPABASE_ANON_KEY==='undefined'||!SUPABASE_URL||!SUPABASE_ANON_KEY){
    message.textContent=lang==='id'?'Daftar tunggu belum tersedia. Coba lagi nanti.':'The waitlist is not available yet. Please try again later.';return;
  }
  pending=true;button.disabled=true;form.setAttribute('aria-busy','true');
  message.textContent=lang==='id'?'Mendaftarkan emailmu…':'Adding your email…';
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
  try{
    const result=await fetch(`${SUPABASE_URL}/rest/v1/waitlist`,{
      method:'POST',headers:{apikey:SUPABASE_ANON_KEY,Authorization:`Bearer ${SUPABASE_ANON_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},
      body:JSON.stringify({email,locale:lang}),signal:controller.signal
    });
    if(!result.ok&&result.status!==409)throw new Error('Waitlist request failed');
    location.href=`thanks.html?lang=${lang}`;
  }catch{
    message.textContent=lang==='id'?'Emailmu belum tersimpan. Periksa koneksi dan coba lagi.':'Your email wasn’t saved. Check your connection and try again.';
  }finally{
    clearTimeout(timeout);pending=false;button.disabled=false;form.removeAttribute('aria-busy');
  }
});
