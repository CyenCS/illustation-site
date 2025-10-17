// import api from "../Script/axiosInstance";

export function getAccountMenuData(name) {
  return {
    name,
    links: [
      { id: 'profileLink', text: 'Profile', action: profile },
      { id: 'logoutLink', text: 'Sign Out', action: signout },
    ],
  };
}

function profile() {
  alert('Navigating to Profile...');
  // Your profile logic goes here
}

async function signout() {
  // try {
  //   await api.post("/fetch/logout"); // tells server to clear refresh token cookie
  // } catch (err) {
  //   console.error("Error during logout", err);
  // }

  localStorage.clear(); // Remove all user data
  sessionStorage.clear();
  alert('You have been logged out!');
  window.location.href = '/';
}

// export function handleFormSubmit(url, formData, onSuccess, onError) {
//   fetch(url, {
//     method: 'POST',
//     body: formData,
//   })
//     .then(response => response.json())
//     .then(data => {
//       if (data.success) {
//         localStorage.setItem('name', data.name);
//         localStorage.setItem('userid', data.id);
//         // if (data.name && data.id) {
//         //     try {
//         //       new User(data.name, data.id);
//         //       // You can do something with the user instance here
//         //     } catch (err) {
//         //       console.error('Error creating user:', err);
//         //     }
//         //   }
//         onSuccess(data);
//       } else {
//         onError(data.message);
//       }
      
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       onError('An error occurred. Please try again.');
//     });
// }
