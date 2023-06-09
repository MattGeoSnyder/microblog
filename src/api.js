import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000/api';

class API {
    static async request(endpoint ,data = {}, method ='get') {
        const url = `${BASE_URL}${endpoint}`
        const params = (method === 'get') ? data : {};

        try {
            return (await axios({url, method, data, params})).data;
        } catch (err) {
            console.error("API Error", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message: [message];
        }
    }

    static async getPosts() {
        let postsRes = await this.request('/posts')
        const posts = {}
        for (let post of postsRes) {
            const {id, title, description, votes} = post;
            posts[id] = {title, description, votes}
        }
        return posts;
    }

    static async getPostById(id) {
        let post = await this.request(`/posts/${id}`)
        return post;
    }

    static async addNewPost(post) {
        let postRes = await this.request('/posts', post, 'post');
        return postRes;
    }

    static async editPost(post) {
        let postRes = await this.request(`/posts/${post.id}`, post, 'put');
        return postRes;
    }

    static async deletePost(postId) {
        await this.request(`/posts/${postId}`, {}, 'delete');
    }

    static async newComment(comment) {
        let res = await this.request(`/posts/${comment.id}/comments`, comment, 'post');
    }

    static async deleteComment(postId, commentId) {
        let res = await this.request(`/posts/${postId}/comments/${commentId}`, {}, 'delete');
    }

    static async vote(id, direction) {
        let votes = await this.request(`/posts/${id}/vote/${direction}`, {} ,'post');
        return votes;
    }
}

export default API;