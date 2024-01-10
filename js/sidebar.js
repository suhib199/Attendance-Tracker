import { User } from "./models/models.js";
import { general } from "./general.js";


//data
let registerd_user;
function LoadData() {
     registerd_user = JSON.parse(sessionStorage.getItem('registerd_user')) || new User(-1, general.roles.guest, "Guest", "", "", "", new Date(), new Date(), "", "");
   
     //DOM
    let sidebarUserName = document.getElementById('sidebar-user-name'); 
    let sidebarRole = document.getElementById('sidebar-role'); 
    let sidebarLogout = document.getElementById('sidebar-logout'); 
    let sidebareProfile =  document.getElementById('sidebare-profile'); 

    sidebarUserName.textContent = registerd_user.firstName + " " + registerd_user.lastName;
    sidebarRole.textContent = registerd_user.role.toUpperCase();
    sidebarLogout.style.cursor = "pointer"
    sidebarLogout.addEventListener('click', ()=>{
        if(confirm("Are you sure you want to logout?") == true){
            sessionStorage.removeItem('registerd_user');
            location.reload();
        }       

    })
    sidebareProfile.addEventListener('click', ()=>{
        location.href = "../html/profile.html";
    })
}
LoadData();


// Design
let sidebarContainer = document.querySelector('.sidebar-container');
let sidebar = document.querySelector('.sidebar');
let addTrainer = document.querySelector('.add-trainer');
let trainerControl = document.querySelector('.addTrainer');
let trainerImage = document.querySelector('.profile-name-image img');

if(registerd_user.image != ""){
    trainerImage.src = registerd_user.imgURl;
}



if(registerd_user.role != general.roles.admin){
    addTrainer.style.display = "none";
    trainerControl.style.display = "none";
}


const sidebarOverlay = document.querySelector('.sidebar-overlay');
sidebarOverlay.addEventListener('click', ()=>{
    sidebarContainer.style.opacity = "0";
    sidebarContainer.style.visibility = "hidden";
    sidebar.style.transform = "translateY(-100%)";
})

const sidebarBurgerToggle = document.querySelector('.sidebar-burger-toggle');
sidebarBurgerToggle.addEventListener('click', ()=>{
    sidebarContainer.style.opacity = "1";
    sidebarContainer.style.visibility = "visible";
    sidebar.style.transform = "translateY(0)";
})