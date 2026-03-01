import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(config => {
    const communityId = localStorage.getItem('selected_community_id');
    if (communityId) {
        config.headers['x-community-id'] = communityId;
    }
    return config;
});

export default api;
