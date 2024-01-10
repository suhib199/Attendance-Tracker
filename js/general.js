import {
  User,
  Announcement,
  Student,
  Feedback,
} from "./models/models.js";

async function ReadJson(path) {
  let respones = await fetch(path);
  let data = respones.json();
  return data;
}

function WriteOnlocalStorage(key, json) {
  localStorage.setItem(key, json);
}

function ReadFromlocalStorage(key) {
  return localStorage.getItem(key);
}

let keysObj = {
  users: "users",
  students: "students",
  announcements: "announcements",
  tasks: "tasks",
  feedbacks: "feedbacks",
  news: "news",
};

let roles = {
  admin: "admin",
  trainer: "trainer",
  student: "student",
  guest: "guest",
};

let users = [];
let students = [];
let announcements = [];
let tasks = [];
let feedbacks = [];
let news = [];

function SetSomeDataIfThereIsNo() {
  if (!localStorage.getItem(keysObj.users)) {
    let user = new User(
      1,
      roles.admin,
      "Admin",
      "Admin",
      "admin@weboffice.com",
      "Admin@123",
      new Date(),
      new Date(),
      "https://api.dicebear.com/7.x/adventurer/svg?seed=admin",
      "07949854994"
    );
    user.add();
    WriteOnlocalStorage(keysObj.users, JSON.stringify(users));
  }

  if (!localStorage.getItem(keysObj.announcements)) {
    for (let i = 1; i <= 4; i++) {
      let announcement = new Announcement(i, "Title", "Description", 1);
      announcement.add();
    }
    WriteOnlocalStorage(keysObj.announcements, JSON.stringify(announcements));
  }

  if (!localStorage.getItem(keysObj.feedbacks)) {
    feedbacks = [];
    WriteOnlocalStorage(keysObj.feedbacks, JSON.stringify(feedbacks));
  }

  if (!localStorage.getItem(keysObj.students)) {
    WriteOnlocalStorage(keysObj.students, JSON.stringify(students));
  }

  if (!localStorage.getItem(keysObj.tasks)) {
    WriteOnlocalStorage(keysObj.tasks, JSON.stringify(tasks))
  }
}


function RedirectIfNotAuthorized(rolesAllowed, registerd_user, path) {
  for (let role of rolesAllowed) {
    if (role == registerd_user.role) {
      return;
    }
  }
  window.location.href = path;
}

function searchByName(str, arr) {
  let result = [];
  for (let item of arr) {
    let fullName = item.firstName + " " + item.lastName;
    if (item.firstName.toLowerCase().includes(str.toLowerCase()) || item.lastName.toLowerCase().includes(str.toLowerCase()) || fullName.toLowerCase().includes(str.toLowerCase())) {
      result.push(item);
    }
  }
  return result || [];
}

export let general = {
  searchByName,
  RedirectIfNotAuthorized,
  SetSomeDataIfThereIsNo,
  ReadJson,
  WriteOnlocalStorage,
  ReadFromlocalStorage,
  roles,
  users,
  students,
  announcements,
  tasks,
  feedbacks,
  news,
  keysObj,
};
