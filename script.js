// Firebase'i başlat
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, onChildAdded } from "firebase/database";

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyAxeWahEBGPPet8Njx8__seZI4Db1zfTrM",
  authDomain: "anonimsohbet-1da2c.firebaseapp.com",
  projectId: "anonimsohbet-1da2c",
  storageBucket: "anonimsohbet-1da2c.firebasestorage.app",
  messagingSenderId: "245517121514",
  appId: "1:245517121514:web:2eb071591516d0afe62493",
  measurementId: "G-TDDVKHHVK8"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// HTML öğelerini seç
const messagesContainer = document.getElementById("messages");
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

// Kullanıcıya rastgele bir renk atamak için fonksiyon
function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Mesajı Firebase Realtime Database'e gönderme
sendBtn.addEventListener('click', function() {
  const username = usernameInput.value.trim();
  const message = messageInput.value.trim();

  if (username && message) {
    const userColor = generateRandomColor();
    const messageData = {
      username: username,
      message: message,
      color: userColor,
      timestamp: Date.now()
    };

    // Firebase'e mesajı gönder
    const newMessageRef = ref(database, 'messages/' + Date.now());
    set(newMessageRef, messageData);
    messageInput.value = '';  // Mesaj kutusunu temizle
  }
});

// Firebase'deki yeni mesajları dinlemek
const messagesRef = ref(database, 'messages');
onChildAdded(messagesRef, function(snapshot) {
  const messageData = snapshot.val();
  const messageElement = document.createElement("div");
  messageElement.style.color = messageData.color;
  messageElement.innerHTML = `<strong>${messageData.username}:</strong> ${messageData.message}`;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight; // En son mesaja kaydır
});
// Mesaj gönderme işlemi
const sendButton = document.getElementById('send-button');
const messageInput = document.getElementById('message-input');
const userNameInput = document.getElementById('user-name-input'); // Kullanıcı adını ekledim
const chatBox = document.getElementById('chat-box');

sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    const userName = userNameInput.value || "Anonim"; // Eğer kullanıcı adı girilmemişse "Anonim" olacak

    if (message && userName) {
        // Firebase'e mesaj gönderme
        const messagesRef = ref(getDatabase(), 'messages/' + Date.now()); // Her mesaj için benzersiz bir anahtar
        set(messagesRef, {
            user: userName,
            message: message
        });

        // Mesajı arayüze ekle
        chatBox.innerHTML += `<div class="chat-message"><span class="user">${userName}:</span><span class="message">${message}</span></div>`;
        messageInput.value = ''; // Input'u temizle
        userNameInput.value = ''; // Kullanıcı adı inputunu temizle
    }
});

// Firebase'den gelen mesajları gösterme
const messagesRef = ref(getDatabase(), 'messages/');
onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    chatBox.innerHTML = ''; // Önceki mesajları temizle
    for (const key in data) {
        const msg = data[key];
        chatBox.innerHTML += `<div class="chat-message"><span class="user">${msg.user}:</span><span class="message">${msg.message}</span></div>`;
    }
});
