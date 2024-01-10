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



// Make Student Card that contains student name, feedback title, feedback description and delete button.
const studentsCards = document.querySelector('.students-cards');
function MakeStudentCard(id, student, title, description) {

    let studentCard = document.createElement('tr');

    studentCard.setAttribute('feedbackID', id);


    let studentNameTD = document.createElement('td');
    studentNameTD.innerHTML = student.firstName + " " + student.lastName;
    studentCard.appendChild(studentNameTD);

    let studentTitle = document.createElement('td');
    studentTitle.innerHTML = title;
    studentCard.appendChild(studentTitle);

    let studentDescription = document.createElement('td');
    studentDescription.innerHTML = description;
    studentCard.appendChild(studentDescription);


    let studentDeleteTD = document.createElement('td');
    let studentDeleteBtn = document.createElement('button');
    studentDeleteBtn.classList.add('btn');
    studentDeleteBtn.setAttribute('id', 'deleteFeedbackBtn');
    studentDeleteBtn.innerHTML = "Delete Feedback";
    studentDeleteTD.appendChild(studentDeleteBtn);
    if (registerd_user.role == general.roles.trainer) {
        studentCard.appendChild(studentDeleteTD);
    }


    studentDeleteBtn.addEventListener('click', function () {
        let feedback = new Feedback(id, student.id, title, description, registerd_user.id);
        feedback.delete();
        location.reload();
    });

    studentsCards.appendChild(studentCard);
}
// list all feedbacks
for (let feedback of general.feedbacks) {
    if (feedback.deleted) continue;
    let student = general.students.find((obj) => obj.id == feedback.student_id);
    MakeStudentCard(feedback.id, student, feedback.title, feedback.description)
}

document.getElementById('searchInput').addEventListener('keyup', function (e) {
    let searchStr = e.target.value;
    studentsCards.innerHTML = "";
    if (studentsCards) {
        for (let feedback of general.feedbacks) {
            general.searchByName(searchStr, general.students).forEach(function (student) {
                if (feedback.student_id == student.id) {
                    MakeStudentCard(feedback.id, student, feedback.title, feedback.description)
                }
            });
        }
    }
});

// Modal Code
const modal = document.getElementById('addFeedbackModal');
const modalBtn = document.getElementById('addFeedbackBtn');
const closeBtn = document.getElementById('closeModal');
const studentList = document.getElementById('studentSelect');
const submitBtn = document.getElementById('addFeedbackSubmitBtn');

// fill students list
for (let student of general.students) {
    let option = document.createElement('option');
    option.setAttribute('value', student.id);
    option.innerHTML = student.firstName + " " + student.lastName;
    studentList.appendChild(option);
}


modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

function openModal() {
    modal.style.opacity = 1;
    modal.style.visibility = "visible";
}

function closeModal() {
    modal.style.opacity = 0;
    modal.style.visibility = "hidden";
}

// add feedback
submitBtn.addEventListener('click', function (e) {
    e.preventDefault();
    try {
        Swal.fire({
            title: 'Are you sure you want to add this feedback?',
            icon: 'question',
            confirmButtonText: 'Yes',
            showCancelButton: true,
        }).then((result) => {
            if(result.isConfirmed){
                let student_id = studentList.value;
                let title = document.getElementById('feedbackTitle').value;
                let description = document.getElementById('feedbackDesc').value;
                let createdBy = registerd_user.id;

                let largerID;
                try {
                    largerID = general.feedbacks.reduce((prev, current) => (prev.id > current.id) ? prev : current).id;
                } catch (error) {
                    largerID = 0;
                }

                let feedback = new Feedback(Number(largerID) + 1, student_id, title, description, createdBy);
                feedback.add();

                let student = general.students.find((obj) => obj.id == feedback.student_id);
                student.feedbacks.push(feedback.id);
                let std = new Student(student.id, student.firstName, student.lastName, student.email, student.password, student.birthDate, student.team_leader_id, student.mobile, student.imgUrl, student.rate, student.absence, student.doneTasks, student.tasks, student.feedbacks);
                std.update();

                Swal.fire({
                    title: 'Feedback added successfully',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    MakeStudentCard(feedback.id, student, feedback.title, feedback.description)
                    closeModal();
                });
            }
        })
    } catch(error) {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK',
        });

    }
});



// delete add, edit, delete buttons for admin
if (registerd_user.role == general.roles.admin) {
    document.getElementById("addFeedbackBtn").style.display = "none";
    document.querySelector(".delete-btn-form").style.display = "none";

    document.querySelectorAll("#deleteFeedbackBtn").forEach(function (deleteBtn) {
        deleteBtn.style.display = "none";
    });
}
