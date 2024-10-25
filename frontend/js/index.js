var userName;
var userId;
$(document).ready(function () {
  check_session();
  init();
  checkStock();
});

function init() {
  userName = localStorage.getItem("userName");
  userId = localStorage.getItem("userId");

  $.ajax({
    url: "http://127.0.0.1:8000/api/dashboard/",
    method: "GET",
    xhrFields: {
      withCredentials: true,
    },
    success: function (data) {
      $("#aeros-count").text(data.aeros_count);
      $("#component-count").text(data.component_count);
      $("#employee-count").text(data.employee_count);
      $("#team-count").text(data.team_count);
    },
    error: function (xhr) {
      if (xhr.status === 403) {
        alert(xhr.responseJSON.message);
      } else {
        alert("Bir hata oluştu.");
      }
    },
  });
}
function check_session() {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/employee/session/",
    xhrFields: {
      withCredentials: true,
    },
    success: function (response) {
      debugger;
      if (response.session_valid) {
        const userInfo = response.user_info.split(";");
        const name = userInfo[0].split(": ")[1];
        const id = userInfo[1].split(": ")[1];
        $("#username").text(name);
        localStorage.setItem("userName", name);
        localStorage.setItem("userId", id);
      } else {
        console.log("Geçersiz oturum. Yönlendiriliyor...");
        window.location.href = "/login.html";
      }
    },
    error: function (xhr, status, error) {
      console.error("Oturum kontrolü sırasında hata oluştu:", error);
      console.log("Geçersiz oturum. Yönlendiriliyor...");

      window.location.href = "/login.html";
    },
  });
}
function checkStock() {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/stock/getAll/",
    xhrFields: {
      withCredentials: true,
    },
    success: function (response) {
      $("#contentID2").empty();
      response = response.all_available_components;

      Object.keys(response).forEach((aeroName) => {
        const aeroData = response[aeroName];

        aeroData.forEach((component) => {
          if (component.count === 0) {
            // Only include components with zero stock
            const componentBox = $(`
              <div class="bg-red-50   border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold">${aeroName} - ${component.name}</h3>
                <p class="text-sm">Stokta yok (Adet: ${component.count})</p>
              </div>
            `);

            $("#contentID2").append(componentBox);
          }
        });
      });
    },
    error: function (xhr, status, error) {
      alert("Hata: " + ", " + xhr.responseText + ", " + error);
    },
  });
}
