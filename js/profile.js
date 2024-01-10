import { User } from "./models/models.js";
import { general } from "./general.js";


document
  .querySelector(".saveChangesButton")
  .addEventListener("click", function () {
    let firstName = document.getElementById("userFirstNameInput").value;
    let lastName = document.getElementById("userLastNameInput").value;
    let email = document.getElementById("userEmailInput").value;
    let image = document.getElementById("imageURl").value;
    let password = registerd_user.password;
    let role = registerd_user.role;
    let id = registerd_user.id;
    let user = new User(
      id,
      role,
      firstName,
      lastName,
      email,
      password,
      registerd_user.birthDate,
      registerd_user.hiringDate,
      image,  
      registerd_user.mobile
    );

    Swal.fire({
      title: 'Are you sure you want to save changes?',
      icon: 'question',
      confirmButtonText: 'OK',
      showCancelButton: true,
    }).then((result)=>{
      if(result.isConfirmed){
        try{
          user.update();
          sessionStorage.setItem("registerd_user", JSON.stringify(user));
          Swal.fire({
            title: 'Changes saved successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(()=>{
            location.reload();
          });
        }catch{
          Swal.fire({
            title: 'Error',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  });

let registerd_user;
function LoadData() {
  general.users =
    JSON.parse(general.ReadFromlocalStorage(general.keysObj.users)) || [];
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

  document.getElementById("userFirstNameInput").value =
    registerd_user.firstName;
  document.getElementById("userLastNameInput").value = registerd_user.lastName;
  document.getElementById("userEmailInput").value = registerd_user.email;
  document.getElementById("imageURl").value = registerd_user.imgURl;

  let image = document.querySelector(".user-image-container .user-image");
  if (registerd_user.image != "") {
    image.src = registerd_user.imgURl;
  }else{
    image = "https://api.dicebear.com/7.x/adventurer/svg?seed=" + registerd_user.firstName + registerd_user.lastName;
  }
  
  //check if image can not be loaded
  image.onerror = function () {
    image.src =
      "https://api.dicebear.com/7.x/adventurer/svg?seed=" +
      registerd_user.firstName +
      registerd_user.lastName;
  };

}
LoadData();

general.RedirectIfNotAuthorized(
  [general.roles.admin, general.roles.trainer],
  registerd_user,
  "../html/login.html"
);

// LoadData();
// function LoadData1() {
//   registerd_user = JSON.parse(general.ReadFromlocalStorage("registerd_user"));
//   document.getElementById("userFirstName").innerHTML = registerd_user.firstName;
//   document.getElementById("userLastName").innerHTML = registerd_user.lastName;
//   document.getElementById("userEmail").innerHTML = registerd_user.email;
// }
// LoadData1();

function showEdit() {
  document.getElementById("UserProfileForm").style.display = "block";
}

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit-btn")) {
    showEdit();
  }
});
