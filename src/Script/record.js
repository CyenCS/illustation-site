// import { Search } from '../Class/search.js';

export function handleDataInsert(url, formData, userid){
    fetch(url, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Item inserted successfully');
                        // const search = new Search('', userid);
                        // search.search();
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error: ', error);
                });
}