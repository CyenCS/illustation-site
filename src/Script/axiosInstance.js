import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', 
  setCredentials: true, // send cookies to refresh token
});

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('accessToken');
    if(token){
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

//Refreshes token if expired
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.respone && error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try{
                const res = await api.post('/fetch/refresh');
                const newAccessToken = res.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);

                //Retry the original request with new token
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err){
                console.error('Refresh token error:', err);
                localStorage.clear();
                window.location.href = '/registry'; // redirect to login
            }
        }
        return Promise.reject(error);
    }
);

export default api;
