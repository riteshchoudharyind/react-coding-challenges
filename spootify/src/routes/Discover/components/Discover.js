import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import SpotifyWebApi from 'spotify-web-api-js';
import '../styles/_discover.scss';
import api from '../../../config';
import axios from 'axios';
export default class Discover extends Component {
  accessToken= 'BQDd8_RHG6X5-26JwAoE2dP1iAykG1MuAyeLC62ZX5gbUdIJTyIdwfP2Tc355bhnD0mblT6Gtwn-G3hJTwLXoIk7tehfJtXtMnjg3GAv6E3-dgEa9ALFZ8rYwFgWRYIHahg8muZJTx0utG-AmXbBemSiSbqnHbhiVd1DtEI';
  spotifyApi = new SpotifyWebApi();
  getApi = api.baseUrl;
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: [],
      token: ''
    };
  }

  componentDidMount(){
    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(api.api.clientId + ':' + api.api.clientSecret)
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .then(tokenResponse => {
      this.setState({ token: tokenResponse.data.access_token });
      const headObj = {
        headers: {
          'Authorization': 'Bearer ' + tokenResponse.data.access_token,
        }
      };

      Promise.all([
        axios('https://api.spotify.com/v1/browse/new-releases?country=SE&offset=0&limit=20', headObj),
        axios('https://api.spotify.com/v1/browse/featured-playlists?country=SE&timestamp=2015-05-18T06:44:32&offset=0&limit=2', headObj),
        axios('https://api.spotify.com/v1/browse/categories?offset=0&limit=20', headObj)
      ]).then(([res1, res2, res3]) => {
        this.setState({
          newReleases: res1.data.albums.items,
          playlists: res2.data.playlists.items,
          categories: res3.data.categories.items  
        });
      }).then(function (data) {
        console.log(data);
      }).catch(function (error) {
        console.log(error);
      });
    });
  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases} />
        <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
        <DiscoverBlock text="BROWSE" id="browse" data={categories} imagesKey="icons" />
      </div>
    );
  }
}
