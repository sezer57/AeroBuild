function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// CSRF token'ını al
const csrftoken = getCookie("csrftoken");

function logout() {
  $.ajax({
    url: "http://127.0.0.1:8000/api/employee/logout/",
    type: "POST",
    xhrFields: {
      withCredentials: true,
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
    },
    success: function (response) {
      // Oturum bilgilerini temizle
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");

      // Başarılı çıkış sonrasında yönlendirme
      window.location.href = "/login.html";
    },
    error: function (xhr, status, error) {
      console.error("Çıkış yapılamadı:", error);
    },
  });
}
