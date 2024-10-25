$(document).ready(function () {
  getTeam(0);
  getComponent(0);
  getAeros();
  $("#componentSelect").select2({
    placeholder: "Parça seçin",
    allowClear: true,
  });

  $("#teamModal").click(function () {
    $("#teamModalContainer").load("/popUp/portal/teamModal.html", function () {
      $("#teamModalPop").modal("show");
      $("#saveButton").click(function () {
        const teamName = $("#teamName").val();
        const assemblyOrProduction = $("#flexSwitchCheckDefault").is(":checked")
          ? "True"
          : "False";

        $.ajax({
          type: "POST",
          url: "http://127.0.0.1:8000/api/team/create/",
          data: {
            name: teamName,
            assemblyOrProduction: assemblyOrProduction,
          },
          dataType: "json",
          success: function (response) {
            alert("Team başarıyla eklendi: " + response.name);
            $("#teamModalPop").modal("hide");
            getTeam(0);
          },
          error: function (xhr, status, error) {
            console.error("Error saving team:", error);
          },
        });
      });
      $("#closeButton").click(function () {
        $("#teamModalPop").modal("hide");
      });
    });
  });

  $("#aeroModal").click(function () {
    $("#aeroModalContainer").load("/popUp/portal/aeroModal.html", function () {
      getComponent(1);
      $("#aeroModalPop").modal("show");

      $("#saveButton").click(function () {
        let aeroName = $("#aeroName").val();
        let componentIds = [];

        $('input[type="checkbox"]:checked').each(function () {
          componentIds.push($(this).val());
        });
        debugger;
        $.ajax({
          url: "http://127.0.0.1:8000/api/aero/create/",
          method: "POST",
          data: {
            name: aeroName,
            component_ids: componentIds,
          },
          success: function (response) {
            alert("Aero başarıyla eklendi: " + response.name);
            getAeros(0);
            $("#aeroModalPop").modal("hide");
          },
          error: function (error) {
            alert("Hata oluştu!");
          },
        });

        // Close the modal
        $("#aeroModalPop").modal("hide");
      });
      $("#closeButton").click(function () {
        $("#aeroModalPop").modal("hide");
      });
    });
  });

  $("#componentModal").click(function () {
    $("#componentModalContainer").load(
      "/popUp/portal/componentModal.html",
      function () {
        $("#componentModalPop").modal("show");
        getTeam(1);
        debugger;
        $("#saveButton").click(function () {
          const itemName = $("#itemName").val();
          const teamID = $("#teamType").val();

          $.ajax({
            url: "http://127.0.0.1:8000/api/component/create/",
            type: "POST",
            data: {
              name: itemName,
              team_id: teamID,
            },
            success: function (response) {
              getComponent(0);
              console.log("Component created:", response);
            },
            error: function (xhr, status, error) {
              console.log("Error:", error);
            },
          });

          $("#componentModalPop").modal("hide");
        });
        $("#closeButton").click(function () {
          $("#componentModalPop").modal("hide");
        });
      }
    );
  });
});

function getTeam(id) {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/team/getAll/",
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      if (id == 0) {
        const teamBody = $("#teamBody");
        teamBody.empty();

        response.forEach((team) => {
          const teamDiv = $(`
                <div class="team-item d-flex justify-content-between align-items-center mb-2">
                    <span>${team.name}</span>
                    <div>
                        <button class="btn btn-warning btn-sm mx-1" onclick="updateTeam(${team.id})">Güncelle</button>
                        <button class="btn btn-danger btn-sm mx-1" onclick="deleteTeam(${team.id})">Sil</button>
                    </div>
                </div>
            `);
          teamBody.append(teamDiv);
        });
      } else {
        const teamTypeSelect = $("#teamType");
        teamTypeSelect.empty();

        response.forEach(function (teamType) {
          const option = $("<option></option>")
            .attr("value", teamType.id)
            .text(teamType.name);
          teamTypeSelect.append(option);
        });
      }
    },
    error: function (xhr, status, error) {
      console.error("Error saving team:", error);
    },
  });
}

function getComponent(id) {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/component/getAll/",
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      if (id == 0) {
        const componentBody = $("#componentBody");
        componentBody.empty();

        response.forEach((component) => {
          const componentDiv = $(`
                <div class="component-item d-flex justify-content-between align-items-center mb-2">
                    <span>${component.name}</span>
                    <div>
                        <button class="btn btn-warning btn-sm mx-1" onclick="updateComponent(${component.id})">Güncelle</button>
                        <button class="btn btn-danger btn-sm mx-1" onclick="deleteComponent(${component.id})">Sil</button>
                    </div>
                </div>
            `);
          componentBody.append(componentDiv);
        });
      } else {
        let checkboxesContainer = $("#componentCheckboxes");
        checkboxesContainer.empty();

        response.forEach(function (item) {
          checkboxesContainer.append(`
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${item.id}" id="component-${item.id}">
                    <label class="form-check-label" for="component-${item.id}">
                        ${item.name} (${item.team.name})
                    </label>
                </div>
            `);
        });
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching components:", error);
    },
  });
}
function getAeros() {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/aero/getAll/",
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      const aeroBody = $("#aeroBody");
      aeroBody.empty();

      response.forEach((aero) => {
        const aeroDiv = $(`
          <div class="aero-item d-flex flex-column mb-2">
            <div class="d-flex justify-content-between align-items-center" style="cursor: pointer; background-color: #f8f9fa; padding: 10px; border-radius: 5px;" onclick="toggleComponents(${
              aero.id
            })">
 
              <span> <i class="toggle-icon fas fa-chevron-down" style="margin-right: 10px;"></i>${
                aero.name
              }</span>
              <div>
                <button class="btn btn-warning btn-sm mx-1" onclick="updateComponent(${
                  aero.id
                }); event.stopPropagation();">Güncelle</button>
                <button class="btn btn-danger btn-sm mx-1" onclick="deleteComponent(${
                  aero.id
                }); event.stopPropagation();">Sil</button>
              </div>
            </div>
            <div class="component-list" id="components-${
              aero.id
            }" style="display: none;">
              ${aero.components
                .map((component) => `<div>-${component.name}</div>`)
                .join("")}
            </div>
          </div>
        `);

        aeroBody.append(aeroDiv);
        aeroBody.append(aeroDiv);
      });
    },
    error: function (xhr, status, error) {
      console.error("Error fetching components:", error);
    },
  });
}
function toggleComponents(aeroId) {
  const componentList = $(`#components-${aeroId}`);
  componentList.toggle();
}

function deleteTeam(id) {
  if (confirm("Are you sure you want to delete this team type?")) {
    $.ajax({
      type: "DELETE",
      url: `http://127.0.0.1:8000/api/team/${id}/delete/`,
      success: function (response) {
        alert("Team type deleted successfully.");
        getTeam(0);
      },
      error: function (xhr, status, error) {
        alert("Error deleting team type: " + xhr.responseText);
      },
    });
  }
}
