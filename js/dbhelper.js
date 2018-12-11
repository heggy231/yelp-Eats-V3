const dbPromise = idb.open('keyval-store', 1, upgradeDB => {
  upgradeDB.createObjectStore('keyval');
});

/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 8887 // Change this to your server port, changed to my port: 8887
    // fetching the JSON data from sails.js
    // return 'http://localhost:1337/restaurants';
    return 'https://restaurantreviewp3.herokuapp.com/restaurants';
  }

  /**
   * Fetch all restaurants.
   */
  // fetch db restaurants
  static fetchRestaurants(callback) {
    return dbPromise.then(db => {
      // getting the cached restaurant database
      return db.transaction('keyval')
        .objectStore('keyval').get('restaurants');
    }).then(function(val) {
      if(val){
        console.log('loaded restaurant data'+val);
        callback(null, val);
      } else {
        fetch(DBHelper.DATABASE_URL)
        .then(response => response.json())
        .then(fetchedRestaurants => {
          callback(null, fetchedRestaurants);
          dbPromise.then(function(db) {
          // Putting the cached into the iDB
            var tx = db.transaction('keyval', 'readwrite');
            var keyValStore = tx.objectStore('keyval');
      
            keyValStore.put(fetchedRestaurants, 'restaurants');
            return tx.complete;
          }).then(function() {
            console.log('Added restaurant data');
        
          });
        });
      }

    });


  }

  // Getting reviews by restaurant_id
  static reviewsByID(restaurantID, callback) {
    fetch(`https://restaurantreviewp3.herokuapp.com/reviews/?restaurant_id=${restaurantID}`)
      .then(response => response.json())
      .then((fetchedReview) => {
        console.log('reviews from fetch');
        callback(null, fetchedReview);
      });
  }

  // add my review of restaurant from form and send to database so it persists
  static addReview(review, callback) {

    fetch('https://restaurantreviewp3.herokuapp.com/reviews/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(review),
    })
      .then(res => res.json())
      .then((response) => {
        console.log('Success:', response);
        // window.location.reload();
        callback(null, response);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {

        
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    // console.log(`img/${restaurant.photograph}.jpg`);
    return (`img/${restaurant.photograph}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  } 
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

  // my favorite function that has 3 parameters 
  static updateFavorite(id, favoriteState, callback) {
    // fetching from my backend server looking for restaurant id
    fetch(`https://restaurantreviewp3.herokuapp.com/restaurants/${id}/`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      // converting into boolean from string 
      body: JSON.stringify({is_favorite: favoriteState}),
    })
      .then(res => res.json())
      .catch((error) => {
        console.error('Error:', error);
        callback(error, null);
      })
      .then((response) => {
        console.log('Success:', response);

        callback(null, response);
      // update the cache when I favorite restaurant
        fetch(DBHelper.DATABASE_URL)
        .then(response => response.json())
        .then(fetchedRestaurants => {
          callback(null, fetchedRestaurants);
          dbPromise.then(function(db) {
          // Putting the cached into the iDB
            var tx = db.transaction('keyval', 'readwrite');
            var keyValStore = tx.objectStore('keyval');
      
            keyValStore.put(fetchedRestaurants, 'restaurants');
            return tx.complete;
          }).then(function() {
            console.log('Added restaurant data');
        
          });
        });
      });
  }
}


