const got = require('got');

module.exports = class Emby {
  constructor(host, apiKey) {
    this.host = host;
    this.client = got.extend({
      headers: {
        'X-Emby-Token': apiKey,
      },
    });
  }

  async addToCollection(collectionId, ids) {
    await this.client.post(`${this.host}/Collections/${collectionId}/Items?Ids=${ids.join(',')}`);
  }

  async createCollection(name) {
    const response = await this.client.post(`${this.host}/Collections?Name=${name}`);

    return JSON.parse(response.body);
  }

  async delete(itemId) {
    return (await this.client.delete(`${this.host}/Items?Ids=${itemId.join(',')}`)).body;
  }

  async getAllCollections(userId) {
    return JSON.parse((await this.client.get(`${this.host}/Users/${userId}/Items?Recursive=true&IncludeItemTypes=boxset`)).body);
  }

  async getAllMovies(userId) {
    return JSON.parse((await this.client.get(`${this.host}/Users/${userId}/Items?Recursive=true&IncludeItemTypes=Movie`)).body);
  }

  async getItem(itemId, userId) {
    return JSON.parse((await this.client.get(`${this.host}/Users/${userId}/Items/${itemId}`)).body);
  }

  async getUsers() {
    return JSON.parse((await this.client.get(`${this.host}/Users`)).body);
  }

  setUserId(userId) {
    this.userId = userId;
  }
};
