$(document).ready(function () {
  console.log(document.cookie);
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/CSRF/",
    success: function (response) {
      // CSRF tokenini çerezde saklayın
      const csrfToken = response.csrfToken;

      console.log("CSRF Token çereze kaydedildi:", csrfToken);
    },
    error: function (xhr, status, error) {
      console.error("Hata:", error);
    },
  });
});

function login() {
  const email = $("#email").val();
  const password = $("#password").val();

  if (!email || !password) {
    alert("Lütfen e-posta ve şifre alanlarını doldurun.");
    return;
  }

  const formData = {
    email: email,
    password: password,
  };

  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:8000/api/employee/login/",
    data: formData,
    xhrFields: {
      withCredentials: true, // Cookie'leri kaydetmek için
    },
    success: function (response) {
      alert("Giriş başarılı!");
      window.location.href = "index.html";
      console.log(response);
    },
    error: function (xhr, status, error) {
      console.error("Giriş sırasında hata oluştu:", error);
      alert("E-posta veya şifre geçersiz.");
    },
  });
}
