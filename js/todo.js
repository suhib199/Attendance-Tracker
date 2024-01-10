import { User, Feedback, Student } from "./models/models.js";
import { general } from "./general.js";

// Data
let registerd_user;
function LoadData() {
  general.users = JSON.parse(general.ReadFromlocalStorage(general.keysObj.users)) || [];
  general.feedbacks = JSON.parse(general.ReadFromlocalStorage(general.keysObj.feedbacks)) || [];
  general.students = JSON.parse(general.ReadFromlocalStorage(general.keysObj.students)) || [];
  general.announcements = JSON.parse(general.ReadFromlocalStorage(general.keysObj.announcements)) || [];
  general.news = general.ReadJson('../data/news.json') || [];
  registerd_user = JSON.parse(sessionStorage.getItem('registerd_user')) || new User(-1, general.roles.guest, "Guest", "", "", "", new Date(), new Date(), "", "");
}
LoadData();

// Redirect if not authorized
general.RedirectIfNotAuthorized([general.roles.admin, general.roles.trainer], registerd_user, '../html/login.html')



var students = JSON.parse(localStorage.getItem("students")) || [];
var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let addTaskBtn = document
  .getElementById("add-task-btn")
  .addEventListener("click", addTask);
function populateStudentDropdown(elementId, selectedStudents) {
  var studentDropdown = document.getElementById(elementId);
  try {
    studentDropdown.innerHTML = "";
  } catch (e) {
  }
  students.forEach(function (student) {
    var option = document.createElement("option");
    option.value = student.id;
    option.text = student.firstName + " " + student.lastName;
    option.selected = selectedStudents.includes(student.id);
    try {
      studentDropdown.add(option);
    } catch (e) {
    }
  });
}
function addTask() {
  var taskInput = document.getElementById("add-task-input");
  var studentInput = document.getElementById("add-student-input");
  var task = taskInput.value.trim();
  var selectedStudents = Array.from(studentInput.selectedOptions).map(
    (option) => option.value
  );

  Swal.fire({
    title: 'Are you sure you want to add this task?',
    showDenyButton: true,
    confirmButtonText: `Add`,
    denyButtonText: `Cancel`,
  }).then((result) => {
    if (result.isConfirmed) {
      if (task !== "" && selectedStudents.length > 0) {
        tasks.push({
          task: task,
          studentIds: selectedStudents,
          deleted: false,
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        selectedStudents.forEach((studentId) => {
          var student = students.find((s) => s.id === studentId);
          if (student) {
            student.tasks.push({ task: task });
          }
        });
        localStorage.setItem("students", JSON.stringify(students));
        loadTasks();
        taskInput.value = "";
        studentInput.value = "";
      } else {
        Swal.fire('Task name and assigned students cannot be empty.', '', 'error')
      }
    } else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info')
    }
  })
}
loadTasks();
function loadTasks() {
  var taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach(function (task) {
    if (task.deleted) return;
    var taskItem = document.createElement("li");
    taskItem.classList.add("task-item");

    var studentNames = getStudentNames(task.studentIds);
    taskItem.innerHTML = `
        <span>${task.task}</span>
        <button class="show-details-btn">Show details</button>
    `;
    var showDetailsBtn = taskItem.querySelector(".show-details-btn");
    showDetailsBtn.addEventListener("click", function () {
      showTaskDetails(tasks.indexOf(task));
    });

    taskList.appendChild(taskItem);
  });
}

function getStudentNames(studentIds) {
  var names = [];
  studentIds.forEach(function (studentId) {
    var student = students.find((s) => s.id === studentId);
    if (student) {
      names.push(student.firstName + " " + student.lastName);
    }
  });
  return names.join(", ");
}
function deleteTask(taskIndex) {

  Swal.fire({
    title: 'Are you sure you want to delete this task?',
    showDenyButton: true,
    confirmButtonText: `Delete`,
    denyButtonText: `Cancel`,
  }).then((result) => {
    if (result.isConfirmed) {
      var deletedTask = tasks[taskIndex];
      tasks[taskIndex].deleted = true;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      deletedTask.studentIds.forEach((studentId) => {
        var student = students.find((s) => s.id === studentId);
        if (student) {
          var taskIndex = student.tasks.findIndex(
            (task) => task.task === deletedTask.task
          );
          if (taskIndex !== -1) {
            student.tasks.splice(taskIndex, 1);
          }

          localStorage.setItem("students", JSON.stringify(students));
          loadTasks();
          closeDetailsPopup();
        }
      });
    } else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info')
    }
  })
}

function showTaskDetails(taskIndex) {
  var detailsPopup = document.getElementById("detailsPopup");
  var detailsContent = document.getElementById("detailsContent");
  var overlay = document.getElementById("overlay");

  var task = tasks[taskIndex];
  var studentIds = task.studentIds;

  if (registerd_user.role != general.roles.admin) {
    detailsContent.innerHTML = `
    <h2>Task Details</h2>
    <div class="taskEdit">
      <p><strong>Task:</strong> <input type="text" id="editTaskName" value="${task.task
      }"></p>  
      <p><strong>Assigned Students:</strong></p>
      <select id="editStudentNames" multiple>
        ${generateStudentOptions(studentIds)}
      </select>
      <br/>
      <button class="saveBtn">Save Changes</button>
      <br/>
      <button class="deleteBtn">Delete Task</button>
    </div>
  `
  } else {
    detailsContent.innerHTML = `
    <h2>Task Details</h2>
    <div class="taskEdit">
      <p><strong>Task:</strong> <input type="text" id="editTaskName" value="${task.task
      }"></p>  
      <p><strong>Assigned Students:</strong></p>
      <select id="editStudentNames" multiple>
        ${generateStudentOptions(studentIds)}
      </select>
    </div>
  `;
  }

  if (registerd_user.role != general.roles.admin) {
    var saveBtn = detailsContent.querySelector(".saveBtn");
    var deleteBtn = detailsContent.querySelector(".deleteBtn");

    saveBtn.addEventListener("click", function () {
      saveTaskChanges(taskIndex);
    });

    deleteBtn.addEventListener("click", function () {
      deleteTask(taskIndex);
    });
  }

  detailsPopup.style.display = "block";
  overlay.classList.add("active");
  populateStudentDropdown("editStudentNames", studentIds);
}

function generateStudentOptions(selectedStudents) {
  return students
    .map(
      (student) =>
        `<option value="${student.id}" ${selectedStudents.includes(student.id) ? "selected" : ""
        }>${student.firstName} ${student.lastName}</option>`
    )
    .join("");
}

function saveTaskChanges(taskIndex) {
  var editTaskName = document.getElementById("editTaskName").value;
  var editStudentNames = Array.from(
    document.getElementById("editStudentNames").selectedOptions
  ).map((option) => option.value);

  Swal.fire({
    title: 'Are you sure you want to save changes?',
    showDenyButton: true,
    confirmButtonText: `Save`,
    denyButtonText: `Cancel`,
  }).then((result) => {
    if (result.isConfirmed) {
      if (editTaskName.trim() !== "" && editStudentNames.length > 0) {
        tasks[taskIndex].task = editTaskName;
        tasks[taskIndex].studentIds = editStudentNames;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
        closeDetailsPopup();
      }
    } else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info')
    }
  })



}

function closeDetailsPopup() {
  var detailsPopup = document.getElementById("detailsPopup");
  var overlay = document.getElementById("overlay");

  detailsPopup.style.display = "none";
  overlay.classList.remove("active");
}

document
  .getElementById("closeDetails")
  .addEventListener("click", closeDetailsPopup);

populateStudentDropdown("add-student-input", []);
populateStudentDropdown("editStudentNames", []);
loadTasks();


// disable add, edit, delete todo buttons for admin
if (registerd_user.role == general.roles.admin) {
  document.querySelector('.tasks-input-row').style.display = "none";

}
