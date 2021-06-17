import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import api from '../../../config';
import axios from 'axios';
import '../styles/_discover.scss';
export default class Discover extends Component {
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
    axios(api.api.authUrl, {
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
