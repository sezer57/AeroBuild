var userName;
var userId;
var componentNamesForCreate = [];
$(document).ready(function () {
  check_session();
  init();
  fetchAeros();
});
function openModalButton() {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/aero/getAll/",
    xhrFields: {
      withCredentials: true,
    },
    success: function (response) {
      let aeroSelect = $("#aeroSelect");
      aeroSelect.empty();
      aeroSelect.append("<option></option>");
      getTeamName();
      $("#saveButton").addClass(
        "bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed ml-2 disabled"
      );
      response.forEach(function (aero) {
        aeroSelect.append(new Option(aero.name, aero.id));
      });
    },
    error: function (xhr, status, error) {
      alert("Error fetching data:", error);
    },
  });
  $("#componentModalPop").removeClass("hidden");
}
function closeModalButton() {
  var stockStatusDiv = document.getElementById("stockStatus");
  stockStatusDiv.innerHTML = "";
  $("#componentModalPop").addClass("hidden");
}
function checkStock() {
  var aeroID = $("#aeroSelect").val();
  var stockStatusDiv = document.getElementById("stockStatus");
  stockStatusDiv.innerHTML = "";
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/aerostock/permissionBuil/",
    data: {
      aeroID: aeroID,
    },
    xhrFields: {
      withCredentials: true,
    },
    success: function (response) {
      renderStockStatus(response.available_components);
    },
    error: function (xhr, status, error) {
      var controlNO = `
  <div class="flex items-center justify-between border p-4 mb-2 rounded-md shadow-sm">
        <span class="text-red-700 font-medium">!! Uçak üretemezsiniz yetkiniz yok. </span> </div>`;
      stockStatusDiv.innerHTML += controlNO;
      //   alert("Hata: " + ", " + xhr.responseText + ", " + error);
    },
  });
}
function getTeamName() {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/employee/team/",

    xhrFields: {
      withCredentials: true,
    },
    success: function (response) {
      $("#teamName").val(response.team_name);
    },
    error: function (xhr, status, error) {
      alert("Hata:", status + error);
    },
  });
}
function renderStockStatus(components) {
  var stockStatusDiv = document.getElementById("stockStatus");
  stockStatusDiv.innerHTML = "";

  var allInStock = true;
  componentNamesForCreate = [];
  components.forEach(function (component) {
    var statusIcon =
      component.count > 0
        ? '<i class="bi bi-check text-4xl text-green-500 mt-1"></i>'
        : '<i class="bi bi-x text-4xl   text-red-500 mt-1"></i>';

    if (component.count === 0) {
      allInStock = false;
    }
    componentNamesForCreate.push(component.name);
    var componentDiv = `
      <div class="flex items-center justify-between border p-4 mb-2 rounded-md shadow-sm">
        <span class="text-gray-700 font-medium">${component.name} (Stok: ${
      component.count
    }) ${statusIcon}</span>
        <div class="flex items-center">
          <span class="text-gray-700 font-medium">Parça no seç: </span>
          <select id="${
            component.name
          }" class="border border-gray-300 rounded-md px-2 py-1 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            ${component.ids
              .map((id) => `<option value="${id}">${id || "Yok"}</option>`)
              .join("")}
          </select>
        </div>
      </div>
    `;
    stockStatusDiv.innerHTML += componentDiv;
  });

  var controlNO = `
  <div class="flex items-center justify-between border p-4 mb-2 rounded-md shadow-sm">
        <span class="text-red-700 font-medium">!! Uçak üretemezsiniz parçaları tamamlayın. </span> </div>`;
  var controlOK = `
        <div class="flex items-center justify-between border p-4 mb-2 rounded-md shadow-sm">
              <span class="text-green-700 font-medium"> Uçak üretebilirsiniz. </span> </div>`;

  allInStock == true
    ? (stockStatusDiv.innerHTML += controlOK)
    : (stockStatusDiv.innerHTML += controlNO);
  $("#saveButton").removeClass(
    "bg-blue-500 text-white font-bold py-2 px-4 rounded   ml-2 "
  );
  $("#saveButton").addClass(
    "bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed ml-2 disabled"
  );

  if (allInStock) {
    $("#saveButton").removeClass(
      "bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed ml-2 disabled"
    );
    $("#saveButton").addClass(
      "bg-blue-500 text-white font-bold py-2 px-4 rounded   ml-2 "
    );
  }
}
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
function saveModel() {
  var aeroID = $("#aeroSelect").val();

  var componentIDs = [];
  // seçii componentlerin idsini alma
  componentNamesForCreate.forEach(function (component) {
    componentIDs.push($("#" + component).val());
  });
  debugger;
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:8000/api/aerostock/create/",
    data: {
      aeroID: aeroID,
      components: componentIDs,
    },
    xhrFields: {
      withCredentials: true,
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
    },
    success: function (response) {
      closeModalButton();
    },
    error: function (xhr, status, error) {
      alert("Hata: " + ", " + xhr.responseText + ", " + error);
    },
  });
}
function updateSaveButton(allInStock) {
  const saveButton = $("#saveButton");

  if (allInStock) {
    saveButton
      .removeClass("opacity-50 cursor-not-allowed disabled")
      .addClass("bg-blue-500 text-white font-bold py-2 px-4 rounded ml-2");
  } else {
    saveButton
      .addClass("opacity-50 cursor-not-allowed disabled")
      .removeClass("bg-blue-500 text-white font-bold py-2 px-4 rounded");
  }
}
function fetchAeros() {
  if ($.fn.dataTable.isDataTable("#componentTable")) {
    var table = $("#componentTable").DataTable();
    table.ajax.reload();
  } else {
    $("#componentTable").DataTable({
      processing: true,
      serverSide: true,
      ajax: {
        url: "http://127.0.0.1:8000/api/aerostock/getAll/",
        type: "GET",
        xhrFields: {
          withCredentials: true,
        },
      },
      columns: [
        { data: "aeroStockID" },
        { data: "aero" },
        { data: "components" },
        { data: "createdDate" },
      ],
    });
  }
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
