import { User, Student } from "./models/models.js";
import { general } from "./general.js";

let registerd_user;
function LoadData() {
  general.users =
    JSON.parse(general.ReadFromlocalStorage(general.keysObj.users)) || [];
  general.students =
    JSON.parse(general.ReadFromlocalStorage(general.keysObj.students)) || [];
  general.announcements =
    JSON.parse(general.ReadFromlocalStorage(general.keysObj.announcements)) ||
    [];
  general.news = general.ReadJson("../data/news.json") || [];
  general.todos =
    JSON.parse(general.ReadFromlocalStorage(general.keysObj.todos)) || [];
  registerd_user =
    JSON.parse(sessionStorage.getItem('registerd_user')) ||
    new User(
      -1,
      general.roles.guest,
      "Guest",
      "",
      "",
      "",
      new Date(),
      new Date(),
      "",
      ""
    );
}
LoadData();

general.RedirectIfNotAuthorized(
  [general.roles.admin, general.roles.trainer],
  registerd_user,
  "../html/login.html"
);

loadStudentsIntoTable();
document
  .getElementById("addStudentForm")
  .addEventListener("click", openPopupForm);
document.getElementById("addStudentBtn").addEventListener("click", addStudent);
document.getElementById("closeX").addEventListener("click", closePopupForm);
function openPopupForm() {
  var popup = document.getElementById("popupForm");
  var overlay = document.getElementById("overlay");
  popup.style.display = "block";
  overlay.classList.add("active");
}

function closePopupForm() {
  var popup = document.getElementById("popupForm");
  var overlay = document.getElementById("overlay");
  popup.style.display = "none";
  overlay.classList.remove("active");
  location.reload();
}
function addStudent() {
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var birthDate = document.getElementById("birthDate").value;
  var mobile = document.getElementById("mobile").value;
  var imgUrl = document.getElementById("imgUrl").value;
  var registeredUser = JSON.parse(sessionStorage.getItem('registerd_user')) || {};
  var teamLeaderId = registeredUser.id;

  var newStudent = new Student(
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1),
    firstName,
    lastName,
    email,
    password,
    birthDate,
    teamLeaderId,
    mobile,
    imgUrl,
    0,
    0,
    0,
    [],
    []
  );

  if (!JSON.parse(localStorage.getItem("students"))) {
    localStorage.setItem("students", JSON.stringify([]));
  }

  Swal.fire({
    title: 'Add Student',
    text: 'Are you sure you want to add this student?',
    icon: 'question',
    confirmButtonText: 'Yes',
    showCancelButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      let students = JSON.parse(localStorage.getItem("students"));
      students.push(newStudent);
      localStorage.setItem("students", JSON.stringify(students));
      Swal.fire({
        title: 'Student added successfully',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        closePopupForm();
        loadStudentsIntoTable();
      });
    }
  });
}

document.getElementById('searchInput').addEventListener('keyup', function (e) {
  loadStudentsIntoTable();
})
function loadStudentsIntoTable() {
  let searchStr = document.getElementById('searchInput').value;
  let students = JSON.parse(localStorage.getItem("students")) || [];
  if (searchStr) {
    students = general.searchByName(searchStr, students);
  }



  var tableBody = document.querySelector("table tbody");
  tableBody.innerHTML = "";
  students.forEach(function (student) {
    if (student.deleted) return;
    var row = tableBody.insertRow();
    if (registerd_user.role == general.roles.admin) {
      row.innerHTML = `
      <td>${student.firstName} ${student.lastName}</td>
      <td>${student.rate ? student.rate : 0
        }/100&nbsp; <button class="rateBtn plusBtn" data-student-id="${student.id
        }">+</button></td>
      <td>${student.absence ? student.absence : 0
        }&nbsp;&nbsp; <button class="addAbsenceBtn plusBtn" data-student-id="${student.id
        }">+</button></td>
      <td>${student.doneTasks ? student.doneTasks : 0
        }&nbsp;&nbsp; <button class="addDoneTaskBtn plusBtn" data-student-id="${student.id
        }">+</button></td>
      <td>${student.tasks.length ? student.tasks.length : "No Tasks"}</td>
      <td>${student.feedbacks.length ? student.feedbacks.length : "No Feedbacks"}</td> `;
    } else if (registerd_user.role == general.roles.trainer) {
      row.innerHTML = `
      <td>${student.firstName} ${student.lastName}</td>
      <td>${student.rate ? student.rate : 0
        }/100&nbsp; <button class="rateBtn plusBtn" data-student-id="${student.id
        }">+</button></td>
      <td>${student.absence ? student.absence : 0
        }&nbsp;&nbsp; <button class="addAbsenceBtn plusBtn" data-student-id="${student.id
        }">+</button></td>
      <td>${student.doneTasks ? student.doneTasks : 0
        }&nbsp;&nbsp; <button class="addDoneTaskBtn plusBtn" data-student-id="${student.id
        }">+</button></td>
      <td>${student.tasks.length ? student.tasks.length : "No Tasks"}</td>
      <td>${student.feedbacks.length ? student.feedbacks.length : "No Feedbacks"}</td>
  
      <td><button class="editBtn" data-student-id="${student.id
        }">Edit</button></td>
      <td><button class="deleteBtn" data-student-id="${student.id
        }">Delete</button>`;

    }

  });
  document.querySelectorAll(".editBtn").forEach(function (editBtn) {
    editBtn.addEventListener("click", function () {
      var studentId = editBtn.getAttribute("data-student-id");
      editStudent(studentId);
    });
  });

  document.querySelectorAll(".deleteBtn").forEach(function (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      var studentId = deleteBtn.getAttribute("data-student-id");
      deleteStudent(studentId);
    });
  });
}

function editStudent(studentId) {
  var students = JSON.parse(localStorage.getItem("students")) || [];
  var studentToEdit = students.find((student) => student.id === studentId);
  document.getElementById("firstName").value = studentToEdit.firstName;
  document.getElementById("lastName").value = studentToEdit.lastName;
  document.getElementById("email").value = studentToEdit.email;
  document.getElementById("password").value = studentToEdit.password;
  document.getElementById("birthDate").value = studentToEdit.birthDate;
  document.getElementById("mobile").value = studentToEdit.mobile;
  document.getElementById("imgUrl").value = studentToEdit.imgUrl;
  openPopupForm();
  document
    .getElementById("addStudentBtn")
    .addEventListener("click", function () {





      Swal.fire({
        title: 'Edit Student',
        text: 'Are you sure you want to make changes to this student data?',
        icon: 'question',
        confirmButtonText: 'OK',
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          studentToEdit.firstName = document.getElementById("firstName").value;
          studentToEdit.lastName = document.getElementById("lastName").value;
          studentToEdit.email = document.getElementById("email").value;
          studentToEdit.password = document.getElementById("password").value;
          studentToEdit.birthDate = document.getElementById("birthDate").value;
          studentToEdit.mobile = document.getElementById("mobile").value;
          studentToEdit.imgUrl = document.getElementById("imgUrl").value;
          localStorage.setItem("students", JSON.stringify(students));
          Swal.fire({
            title: 'Student edited successfully',
            icon: 'success',
            confirmButtonText: 'Yes',
          }).then(() => {
            closePopupForm();
            location.reload();
            loadStudentsIntoTable();
          });
        }
      });
    });
}

function deleteStudent(studentId) {
  var students = JSON.parse(localStorage.getItem("students")) || [];
  var studentIndex = students.findIndex((student) => student.id === studentId);
  if (studentIndex !== -1) {
    Swal.fire({
      title: 'Are you sure you want to delete this student?',
      icon: 'question',
      confirmButtonText: 'Yes',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        students[studentIndex].deleted = true;
        localStorage.setItem("students", JSON.stringify(students));
        Swal.fire({
          title: 'Student deleted successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          loadStudentsIntoTable();
        });
      }
    });
  }else{
    Swal.fire({
      title: 'Error',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
}
function addAbsence(studentId) {
  var students = JSON.parse(localStorage.getItem("students")) || [];
  var studentToUpdate = students.find((student) => student.id === studentId);
  studentToUpdate.absence = (studentToUpdate.absence || 0) + 1;
  localStorage.setItem("students", JSON.stringify(students));
  loadStudentsIntoTable();
}
document
  .querySelector("table tbody")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("addAbsenceBtn")) {
      var studentId = event.target.getAttribute("data-student-id");
      addAbsence(studentId);
    }
  });
function addDoneTask(studentId) {
  var students = JSON.parse(localStorage.getItem("students")) || [];
  var studentToUpdate = students.find((student) => student.id === studentId);
  if (studentToUpdate.tasks.length > studentToUpdate.doneTasks) {
    studentToUpdate.doneTasks = (studentToUpdate.doneTasks || 0) + 1;
    localStorage.setItem("students", JSON.stringify(students));
    loadStudentsIntoTable();
  }
}

document
  .querySelector("table tbody")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("addDoneTaskBtn")) {
      var studentId = event.target.getAttribute("data-student-id");
      addDoneTask(studentId);
    }
  });

document
  .querySelector("table tbody")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("rateBtn")) {
      var studentId = event.target.getAttribute("data-student-id");
      addRate(studentId);
    }
  });
function addRate(studentId) {
  var students = JSON.parse(localStorage.getItem("students")) || [];
  var studentToUpdate = students.find((student) => student.id === studentId);
  studentToUpdate.rate = (studentToUpdate.rate || 0) + 5;
  localStorage.setItem("students", JSON.stringify(students));
  loadStudentsIntoTable();
}



// Delete add, edit, delete buttons for admin
if (registerd_user.role == general.roles.admin) {
  document.getElementById("addStudentForm").style.display = "none";

  document.querySelectorAll(".editBtn").forEach(function (editBtn) {
    editBtn.style.display = "none";
  });
  document.querySelectorAll(".deleteBtn").forEach(function (deleteBtn) {
    deleteBtn.style.display = "none";
  });

  document.querySelectorAll(".plusBtn").forEach(function (deleteBtn) {
    deleteBtn.style.display = "none";
  });

  document.getElementById('edit-field').style.display = "none";
  document.getElementById('del-field').style.display = "none";
}
