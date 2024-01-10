import { User, Student } from "./models/models.js";
import { general } from "./general.js";

let registerd_user;
function LoadData() {
    general.users = JSON.parse(general.ReadFromlocalStorage(general.keysObj.users)) || [];
    general.students = JSON.parse(general.ReadFromlocalStorage(general.keysObj.students)) || [];
    general.announcements = JSON.parse(general.ReadFromlocalStorage(general.keysObj.announcements)) || [];
    general.news = general.ReadJson('../data/news.json') || [];
    general.todos = JSON.parse(general.ReadFromlocalStorage(general.keysObj.todos)) || [];
    registerd_user = JSON.parse(sessionStorage.getItem('registerd_user')) || new User(-1, general.roles.guest, "Guest", "", "", "", new Date(), new Date(), "", "");
}
LoadData();
general.RedirectIfNotAuthorized([general.roles.admin], registerd_user, '../html/welcome.html');




//retrieve trainers name from local storage(users array)
let trainers = general.users.filter(user => user.role === general.roles.trainer);
function trainerName() {

    return trainers.map(trainer => `${trainer.firstName} ${trainer.lastName}`);
}



function deleteSpecificTrainer(trainerId) {
    const index = general.users.findIndex(trainer => trainer.id === trainerId);
    if (index !== -1) {
        general.users.splice(index, 1);
        general.WriteOnlocalStorage(general.keysObj.users, JSON.stringify(general.users));
        location.reload();
    }
}

//appear triner name in the trainers table
function trainersTable() {
    let allrTrainerNames = trainerName();
    var tableBody = document.querySelector("table tbody");
    allrTrainerNames.forEach(function (trainerName, idx) {
        let row = tableBody.insertRow();
        let speccifyTrainer = trainers[idx];//connect each trainer name with his id 
        row.innerHTML = `<td>${trainerName}</td>
      <td><button class="editBtn" data-trainer-id="${speccifyTrainer.id
            }">Edit</button></td>
    <td><button class="deleteBtn" data-trainer-id="${speccifyTrainer.id
            }">Delete</button> `;



        //delete trainer
        row.querySelector(".deleteBtn").addEventListener("click", function () {
            Swal.fire({
                title: 'Delete Trainer',
                text: 'Are you sure you want to delete this trainer info?',
                icon: 'question',
                confirmButtonText: 'OK',
                showCancelButton: true,
            }).then((result) => {
            
                if (result.isConfirmed) {
                    let trainerId = parseInt(this.getAttribute("data-trainer-id"));
                    deleteSpecificTrainer(trainerId);
                    Swal.fire({
                        title: 'Student edited successfully',
                        icon: 'success',
                        confirmButtonText: 'Yes',
                    }).then(() => {
                        location.reload();
                    });
                }
            })

        });

    });

}
trainersTable();


// for search field
document.getElementById('searchInput').addEventListener('keyup', function (e) {
    trainerTabl();
})
function trainerTabl() {
    let searchStr = document.getElementById('searchInput').value;
    let trainers = general.users.filter(user => user.role === general.roles.trainer) || [];
    if (searchStr) {
        trainers = general.searchByName(searchStr, trainers);
    }
}

// document.getElementById("submitBtn").addEventListener("click", submit);
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



