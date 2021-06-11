import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import SpotifyWebApi from 'spotify-web-api-js';
import '../styles/_discover.scss';
import api from '../../../config';

export default class Discover extends Component {
  accessToken= 'BQDd8_RHG6X5-26JwAoE2dP1iAykG1MuAyeLC62ZX5gbUdIJTyIdwfP2Tc355bhnD0mblT6Gtwn-G3hJTwLXoIk7tehfJtXtMnjg3GAv6E3-dgEa9ALFZ8rYwFgWRYIHahg8muZJTx0utG-AmXbBemSiSbqnHbhiVd1DtEI';
  spotifyApi = new SpotifyWebApi();
  getApi = api.baseUrl;
  headObj = {
    headers: new Headers({
      'Authorization': 'Bearer ' + this.accessToken,
    })
  };
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: []
    };
  }

  componentDidMount(){
    fetch('https://api.spotify.com/v1/browse/new-releases?country=SE&offset=0&limit=20', this.headObj)
    .then((res) => {
      if(res) {
        this.state.newReleases = res.albums.items;
      }
    }, (err) => {
      console.log('Error Occure', err);
    });

    fetch('https://api.spotify.com/v1/browse/featured-playlists?country=SE&timestamp=2015-05-18T06:44:32&offset=0&limit=2', this.headObj)
    .then((res) => {
      if(res) {
        this.state.playlists = res.playlists.items;
      }
    }, (err) => {
      console.log('Error Occure', err);
    });

    fetch('https://api.spotify.com/v1/browse/categories?offset=0&limit=20', this.headObj)
    .then((res) => {
      if(res) {
        this.state.categories = res.categories.items;
      }
    }, (err) => {
      console.log('Error Occure', err);
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
