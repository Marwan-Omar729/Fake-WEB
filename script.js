// ----- إعداد Firebase -----
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCJfmn8tZysqxbOSz9sMc20UHzLT8rdVwU",
  authDomain: "learn-mobile-2a6cb.firebaseapp.com",
  projectId: "learn-mobile-2a6cb",
  storageBucket: "learn-mobile-2a6cb.firebasestorage.app",
  messagingSenderId: "47664382500",
  appId: "1:47664382500:web:01b95ee983ef558fb94eb1",
  measurementId: "G-LEBV22DRQL"
};

// تهيئة Firebase و Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ----- عناصر HTML -----
const form = document.getElementById('userForm');
const addressInput = document.getElementById('address');
const msg = document.getElementById('msg');

// ----- جلب العنوان تلقائيًا -----
async function getAddress() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
        const data = await res.json();
        addressInput.value = data.display_name || "";
      } catch (err) {
        console.error("خطأ في جلب العنوان:", err);
      }
    }, () => {
      console.log("رفض المستخدم مشاركة الموقع");
    });
  } else {
    console.log("المتصفح لا يدعم الجيولوجي");
  }
}

// جلب العنوان عند تحميل الصفحة
window.onload = getAddress;

// ----- إرسال البيانات إلى Firestore -----
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const address = addressInput.value;
  
  try {
    await addDoc(collection(db, "users"), {
      name: name,
      age: age,
      address: address,
      timestamp: serverTimestamp()
    });
    
    msg.textContent = "تم حفظ بياناتك بنجاح ✅";
    form.reset();
    getAddress(); // إعادة جلب العنوان تلقائيًا
  } catch (error) {
    msg.textContent = "حدث خطأ ❌ " + error;
  }
});