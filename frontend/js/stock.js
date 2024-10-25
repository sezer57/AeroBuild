var userName;
var userId;
var componentNamesForCreate = [];
$(document).ready(function () {
  init();
  check_session();
  checkStock();
});

function checkStock() {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/stock/getAll/",
    xhrFields: {
      withCredentials: true,
    },
    success: function (response) {
      $("#contentID").empty();
      response = response.all_available_components;

      Object.keys(response).forEach((aeroName) => {
        const aeroData = response[aeroName];

        const aeroContainer = $(`
          <div class="col-lg-5 bg-white p-6 rounded-lg shadow-md border-2 gap-2">
            <h2 class="text-2xl font-semibold text-blue-700 mb-4">${aeroName}</h2>
            <div class="space-y-4"></div>
          </div>
        `);

        const componentList = aeroContainer.find(".space-y-4");

        aeroData.forEach((component) => {
          const isOutOfStock = component.count === 0;
          const componentItem = $(`
            <div class="border-t border-gray-300 pt-4 ${
              isOutOfStock ? "text-red-600" : ""
            }">
              <h3 class="text-lg font-medium ${
                isOutOfStock ? "text-red-600" : "text-gray-800"
              }">
                ${component.name} ${isOutOfStock ? "(Stokta yok)" : ""}
              </h3>
              <p class="text-sm ${
                isOutOfStock ? "text-red-500" : "text-gray-500"
              }">
                Adet: ${component.count}
              </p>
              <div class="mt-2 flex flex-wrap gap-2">
                ${component.ids
                  .map(
                    (id) =>
                      `<span class="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs">ID:${id}</span>`
                  )
                  .join("")}
              </div>
            </div>
          `);

          componentList.append(componentItem);
        });

        $("#contentID").append(aeroContainer);
      });
    },
    error: function (xhr, status, error) {
      alert("Hata: " + ", " + xhr.responseText + ", " + error);
    },
  });
}

function init() {
  userName = localStorage.getItem("userName");
  userId = localStorage.getItem("userId");
  if (userName) {
    $("#username").text(userName);
  }
}
function check_session() {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/employee/session/",
    xhrFields: {
      withCredentials: true,
    },
    success: function (response) {
      if (response.session_valid) {
        const userInfo = response.user_info.split(";");
        const name = userInfo[0].split(": ")[1];
        const id = userInfo[1].split(": ")[1];

        localStorage.setItem("userName", name);
        localStorage.setItem("userId", id);
      } else {
        alert("Geçersiz oturum. Yönlendiriliyor...");
        window.location.href = "/login.html";
      }
    },
    error: function (xhr, status, error) {
      alert("Oturum kontrolü sırasında hata oluştu:", error);
      alert("Geçersiz oturum. Yönlendiriliyor...");

      window.location.href = "/login.html";
    },
  });
}
