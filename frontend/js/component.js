var userName;
var userId;
$(document).ready(function () {
  check_session();
  init();
  fetchComponents();
});
function openModalButton() {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/componentStock/permissionComponent/",
    xhrFields: {
      withCredentials: true,
    },
    success: function (response) {
      $("#teamName").val(response.team);

      let componentSelect = $("#componentSelect");
      componentSelect.empty();
      let aeroSelect = $("#aeroSelect");
      aeroSelect.empty();
      response.aero_list.forEach(function (aero) {
        aeroSelect.append(new Option(aero.name, aero.id));
      });
      response.your_permission_component.forEach(function (component) {
        componentSelect.append(new Option(component.name, component.id));
      });
    },
    error: function (xhr, status, error) {
      console.error("Error fetching data:", error);
    },
  });
  $("#componentModalPop").removeClass("hidden");
}
function closeModalButton() {
  $("#componentModalPop").addClass("hidden");
}
function saveModel() {
  var aeroID = $("#aeroSelect").val();
  var componentID = $("#componentSelect").val();
  var productionDate = $("#productionDate").val();
  var employeeID = userId; // Gerekli duruma göre employeeID'yi al

  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:8000/api/componentStock/create/",
    data: {
      aeroID: aeroID,
      componentID: componentID,
      employeeID: employeeID,
      createdDate: productionDate,
    },
    success: function (response) {
      console.log("Stok parçası oluşturuldu", response);
      fetchComponents();
      closeModalButton();
    },
    error: function (xhr, status, error) {
      console.error("Hata:", error);
    },
  });
}
function fetchComponents() {
  if ($.fn.dataTable.isDataTable("#componentTable")) {
    var table = $("#componentTable").DataTable();
    table.ajax.reload();
  } else {
    $("#componentTable").DataTable({
      processing: true,
      serverSide: true,
      ajax: {
        url: "http://127.0.0.1:8000/api/componentStock/getAll/",
        type: "GET",
        xhrFields: {
          withCredentials: true,
        },
      },
      columns: [
        { data: "componentID" },
        { data: "aero" },
        { data: "component" },
        { data: "employee" },
        { data: "createdDate" },
        { data: "isUsed" },
        {
          data: null,
          render: function (data, type, row) {
            return row.isUsed == "Kullanılmadı"
              ? `<button class="btn btn-danger" onclick="deleteComponent(${row.componentID})">Sil</button>`
              : null;
          },
          orderable: false,
          searchable: false,
        },
      ],
    });
  }
}
function deleteComponent(componentID) {
  if (confirm("Bu bileşeni silmek istediğinizden emin misiniz?")) {
    $.ajax({
      url: `http://127.0.0.1:8000/api/componentStock/delete/${componentID}/`,
      type: "DELETE",
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        alert("Bileşen başarıyla silindi.");
        $("#componentTable").DataTable().ajax.reload();
      },
      error: function (error) {
        alert("Bileşen silinirken hata oluştu.");
      },
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
      debugger;
      if (response.session_valid) {
        const userInfo = response.user_info.split(";");
        const name = userInfo[0].split(": ")[1];
        const id = userInfo[1].split(": ")[1];

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
