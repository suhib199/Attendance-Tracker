
import { Announcement, Student, User, Feedback } from "./models/models.js";
import { general } from "./general.js";

general.SetSomeDataIfThereIsNo();

let registerd_user;
function LoadData() {
    general.users = JSON.parse(general.ReadFromlocalStorage(general.keysObj.users)) || [];
    general.students = JSON.parse(general.ReadFromlocalStorage(general.keysObj.students)) || [];
    general.announcements = JSON.parse(general.ReadFromlocalStorage(general.keysObj.announcements)) || [];
    general.news = general.ReadJson('../data/news.json') || [];
    general.tasks = JSON.parse(general.ReadFromlocalStorage(general.keysObj.tasks)) || [];
    registerd_user = JSON.parse(sessionStorage.getItem('registerd_user')) || new User(-1, general.roles.guest, "Guest", "", "", "", new Date(), new Date(), "", "");
}
LoadData();

general.RedirectIfNotAuthorized([general.roles.guest], registerd_user,'../html/welcome.html')


let loginForm = document.querySelector('.form-Container');

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let user = validateUser(email, password);

    if (user) {
        window.location.href = `welcome.html`;
        sessionStorage.setItem('registerd_user', JSON.stringify(user));

    } else {
        alert('Invalid credentials');
    }
});

function validateUser(email, password) {
    let storedData = JSON.parse(general.ReadFromlocalStorage('users')) ;
    return storedData.find((user) => user.email === email && user.password === password);
}
