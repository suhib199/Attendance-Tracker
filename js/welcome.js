import { User } from "./models/models.js";
import { general } from "./general.js";



general.SetSomeDataIfThereIsNo();

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

console.log(general.students);
general.RedirectIfNotAuthorized([general.roles.admin, general.roles.trainer], registerd_user,'../html/login.html')




//Welcome section
function AssignNameAndImage(){
    let name = document.getElementById('name');
    let image = document.querySelector('.welcome-section img');
    try{
        name.innerHTML = registerd_user.firstName;
        image.src = registerd_user.imgURl;
    }catch{
        name.innerHTML = "Guest";
        image.src = "https://api.dicebear.com/7.x/adventurer/svg?seed=guest";
    }

    //check if image can not be loaded
    image.onerror = function(){
        image.src = "https://api.dicebear.com/7.x/adventurer/svg?seed=guest";
    }
}
AssignNameAndImage();

// Statistic cards
function MakeStatisticCard(innerHTML) {
    const statisticCards = document.querySelector('.statistic-cards');
    let statCard = document.createElement('div');
    statCard.classList.add('statistic-card');
    statCard.innerHTML = innerHTML;
    statisticCards.appendChild(statCard);
}
function MakeStatisticCards() {
    MakeStatisticCard(`<div class="left">
    <h3><i class="fas fa-users"></i>Number of Students</h3>
    <h1>${general.students.filter((std)=>{
        return std.deleted == false;
    }).length}</h1>
</div>
<div class="right">
    <div id="progress">
        <div id="bar" style="width: ${general.students.filter((std)=>{
            return std.deleted == false;
        }).length}%;"></div>
      </div>
</div>`)
    MakeStatisticCard(`<div class="left">
    <h3><i class="fas fa-chalkboard-teacher"></i>Number of Trainers</h3>
    <h1>${general.users.filter(obj=>{
        if(obj.role == general.roles.trainer && obj.deleted ==false){
            return obj;
        }
    }).length}</h1>
</div>
<div class="right">
    <div id="progress">
        <div id="bar" style="width: ${general.users.filter(obj=>{
            if(obj.role == general.roles.trainer && obj.deleted ==false){
                return obj;
            }
        }).length}%;"></div>
      </div>
</div>`)
    MakeStatisticCard(`<div class="left">
    <h3><i class="fas fa-crown"></i>Number of Leaders</h3>
    <h1>${general.users.filter(obj=>{
        if(obj.role == general.roles.admin && obj.deleted ==false){
            return obj;
        }
    }).length}</h1>
</div>
<div class="right">
    <div id="progress">
        <div id="bar" style="width: ${general.users.filter(obj=>{
            if(obj.role == general.roles.admin && obj.deleted ==false){
                return obj;
            }
        }).length}%;"></div>
      </div>
</div>`)
}
MakeStatisticCards();

// News
function MakeNewsCard(title, description, imgURL) {
    const newsCards = document.querySelector('.news-cards');

    let newsCard = document.createElement('div');
    newsCard.classList.add('news-card');
    newsCard.innerHTML = `
        <div class="top">
            <img src="${imgURL}" alt="news" >
        </div>
        <div class="bottom">
            <h3>${title}</h3>
            <p>${description}</p>
        </div>
    `;

    newsCard.addEventListener('click', function(){
        ShowNewsModal(title, description, imgURL);
    });

    newsCards.appendChild(newsCard);
}

function MakeNewsCards(){
    general.news.then(data => {
        return data['news'];
    }).then(news => {
        news.forEach(n => {
            MakeNewsCard(n.title, n.description, n.imageUrl);
        })
    })
}
MakeNewsCards();

// Announcements
function MakeAnnouncementCard(title, description) {
    const announcementsCards = document.querySelector('.announcement-cards');

    let announcementCard = document.createElement('div');
    announcementCard.classList.add('announcement-card');
    announcementCard.innerHTML = `
                    <h3>${title}</h3>
                    <p>${description}</p>
                `

    announcementCard.addEventListener('click', function(){
        ShowAnnouncementModal(title, description);
    })

    announcementsCards.appendChild(announcementCard);
}

function MakeAnnouncementCards(){
    general.announcements.forEach(a => {
        MakeAnnouncementCard(a.title, a.description);
    })
}
MakeAnnouncementCards();


// News Modal
function ShowNewsModal(title, description, imgURL) {
    document.querySelector(".news-modal").style.visibility = "visible";
    document.querySelector(".news-modal").style.opacity = 1;
    const newsModal = document.querySelector('.news-modal');
    newsModal.innerHTML = `
        <div class="modal-content">
        <div class="modal-header">
            <h2>${title}</h2>
            <span class="close">&times;</span>
        </div>
        <div class="modal-body">
            <img src="${imgURL}" alt="news" >
            <p>${description}</p>
        </div>
    </div>
    `;
}

function ShowAnnouncementModal(title, description){
    document.querySelector(".announcement-modal").style.visibility = "visible";
    document.querySelector(".announcement-modal").style.opacity = 1;
    const announcementModal = document.querySelector('.announcement-modal');
    announcementModal.innerHTML = `
        <div class="modal-content">
        <div class="modal-header">
            <h2>${title}</h2>
            <span class="close">&times;</span>
        </div>
        <div class="modal-body">
            <p>${description}</p>
        </div> `;
}

function CloseModal() {
    var modals = document.getElementsByClassName('modal');
    for(var i = 0; i < modals.length; i++){
        modals[i].style.visibility = "hidden";
        modals[i].style.opacity = 0;
    }
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('close')) {
        CloseModal();
    }
});