var now;
var csrftoken;
$(document).ready(function () {
  csrftoken = getCookie("csrftoken");
  now = moment();
  getTeam();
});
function getCookie(name) {
  debugger;
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

function register() {
  const first_name = $("#first_name").val();
  const last_name = $("#last_name").val();
  const email = $("#email").val();
  const password = $("#password").val();
  const teamId = $("#teamType").val();
  const hire_date = now.format("YYYY-MM-DD");

  if (!email || !password || !teamId) {
    alert("Lütfen tüm alanları doldurun.");
    return;
  }

  const formData = {
    first_name: first_name,
    hire_date: hire_date,
    last_name: last_name,
    email: email,
    password: password,
    team_id: teamId,
  };

  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:8000/api/employee/register/",
    data: formData,
    xhrFields: {
      withCredentials: true,
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
    },
    success: function (response) {
      alert("Kayıt başarılı!");
      console.log("Kayıt edilen çalışan:", response);
      $("#email").val("");
      $("#password").val("");
      $("#teamType").val("");
    },
    error: function (xhr, status, error) {
      console.error("Kayıt sırasında hata oluştu:", error);
      alert("Kayıt sırasında bir hata oluştu.");
    },
  });
}

function getTeam() {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/team/getAll/",
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      const teamTypeSelect = $("#teamType");
      teamTypeSelect.empty();
      teamTypeSelect.append(
        `<option value="" disabled selected>Bir takım seçin...</option>`
      );

      response.forEach(function (teamType) {
        const option = $("<option></option>")
          .attr("value", teamType.id)
          .text(teamType.name);
        teamTypeSelect.append(option);
      });
    },
    error: function (xhr, status, error) {
      console.error("Error saving team:", error);
    },
  });
}
