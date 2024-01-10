import { Announcement, Student, User, Feedback } from "./js/models/models.js";
import { general } from "./js/general.js";

general.SetSomeDataIfThereIsNo();

let registerd_user;
function LoadData() {
    general.users = JSON.parse(general.ReadFromlocalStorage(general.keysObj.users)) || [];
    general.students = JSON.parse(general.ReadFromlocalStorage(general.keysObj.students)) || [];
    general.announcements = JSON.parse(general.ReadFromlocalStorage(general.keysObj.announcements)) || [];
    general.news = general.ReadJson('../data/news.json') || [];
    general.tasks = JSON.parse(general.ReadFromlocalStorage(general.keysObj.tasks)) || [];
    registerd_user = JSON.parse(general.ReadFromlocalStorage('registerd_user')) || new User(-1, general.roles.guest, "Guest", "", "", "", new Date(), new Date(), "", "");
}
LoadData();
general.RedirectIfNotAuthorized([general.roles.guest], registerd_user,'./html/welcome.html');