let restaurant;
var newMap;
// const dbPromise = idb.open('keyval-store', 1, upgradeDB => {
//   upgradeDB.createObjectStore('keyval');
// });

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoiaGVnZ3loZXJlIiwiYSI6ImNqbGg3NDBsdjFieGgzcHF6ZGg3eTFsZHgifQ.ryjafTUlgckU1fDIzbJteQ',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'    
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}  
 
/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      // Get the reviews back onto screen !!!
      fetchReviewsByRestaurantID(restaurant.id, (error, reviews) => {
        console.log(reviews);
        if(error) {
          console.log(error);
          return;
        }
        restaurant.reviews = reviews;
        fillRestaurantHTML();
      });

      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {

  const favoriteButton = document.getElementById("favorite-button");

  console.log("are you working fillRestaurantHoursHTML");
  console.log(restaurant);
  // debugger;
  if(restaurant.is_favorite === true) {
    console.log("are you working Unfavorite");
    favoriteButton.innerHTML = "Unfavorite";
  // love it again after unloving it
  } else {
    favoriteButton.innerHTML = "Favorite";
  } 

  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  // adding alt name txt for restaurant.name + image
  image.alt = `${restaurant.name} Restaurant Image`;

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

// PASSING the ID of each restaurant > getting the reviews
const fetchReviewsByRestaurantID = (restaurantID, callback) => {
  DBHelper.reviewsByID(restaurantID, (error, reviews) => {
    callback(null, reviews);
  });
};

// This adds review upto server from the review form
const addReview = () => {
  console.log("Server do you have review?");
  const id = self.restaurant.id;
  const name = document.getElementById("name").value;
  const comments = document.getElementById("review-comments").value;
  const rating = document.getElementById("review-rating").value;
  const review = {
    restaurant_id:id,
    name,
    rating: parseInt(rating),
    comments
  };
  // resource on online check or offline https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine
  if(navigator.onLine) {
    // user online do the regular save to the server
    DBHelper.addReview(review, (error, reviewResponse) => {
      // what do i want to happen after review is in database
      console.log(reviewResponse);
      // adding review to DOM
      document.getElementById('reviews-form').reset();
  
      // add review with others
      const container = document.getElementById('reviews-container');
      const ul = document.getElementById('reviews-list');
      ul.appendChild(createReviewHTML(reviewResponse));
      container.appendChild(ul);
      
      // display thank you message to user for submitting a review!
      document.getElementById('review-formModal').innerHTML = '<p class="modal-wrapper-review-submit-success"><span class="close" id="close-thankyou">&times; </span>Thank you, your review has been submitted!</p>';
  
      // close thank you message modal
      document.querySelector('#close-thankyou').addEventListener('click', function (event) {
        // grab review form modal and hide it 
        var button = document.querySelector('#review-formModal');
        button.style.display = 'none';
      
        // now this person already submit review Don't show the addReview button!
      })
    });
  } else {
    // put inside of the iDB (temporary Database)
    dbPromise.then(function(db) {
      // Putting the cached into the iDB
      var tx = db.transaction('keyval', 'readwrite');
      var keyValStore = tx.objectStore('keyval');

      keyValStore.put(review, 'deferredReview');
      return tx.complete;
    });
  }
  
  return false;
};

// love restaurant on restaurant.html page
const setFavorite = () => {
  // debugger;
  console.log("setFavorite getting called now?");
  const favoriteButton = document.getElementById("favorite-button");

// this gets the text part of my favoriteButton
const buttonTextContent = favoriteButton.textContent;

// setting default favoriteValue inside of my server
let favoriteValue = false;

// When user click favorite it send to server that favorite value is true but default is false
if (buttonTextContent === "Favorite") {
  favoriteValue = true;
}

 console.log(favoriteButton.textContent);

  // updating our server to different state
  DBHelper.updateFavorite(self.restaurant.id, favoriteValue, (error, response) => {
    console.log(response);
      // display that value has changed!!

    // someone already loved button then -- after the response has changed > now unloving it

    if(response.is_favorite === true) {
      favoriteButton.innerHTML = "Unfavorite";
    // love it again after unloving it
    } else {
      favoriteButton.innerHTML = "Favorite";
    }
   
  });

};


/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = review.date;
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// register service worker code from https://developers.google.com/web/fundamentals/primers/service-workers/registration
// if(sw){ } > is a simple browser support for sw.
// if ('serviceWorker' in navigator) {
  if (navigator.serviceWorker) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('../sw.js').then(function() {
        console.log("Registration worked in rest info");
      }).catch(function() {
        console.log("Registration failed in rest info");
      });
    });
  }

self.addEventListener('fetch', function(event) {
  console.log(event.request);
});


// When submit button is pressed show the form
document.querySelector('#add-newReviewButton').addEventListener('click', function (event) {
  // hide button
  var button = document.querySelector('#add-newReviewButton');
  button.style.display = 'none';

  // show review form 
  var reviewForm = document.querySelector('#review-formModal');
  // turns on flex box!
  reviewForm.style.display = 'flex';
});

document.querySelector('#reviews-formReset').addEventListener('click', function (event) {
  //reset data on review form
  var reviewForm = document.querySelector('#reviews-formReset');
  // reviewForm.style.display = 'none';

});

document.querySelector('#close-reviewsForm').addEventListener('click', function (event) {
  // grab review form modal and hide it 
  var button = document.querySelector('#review-formModal');
  button.style.display = 'none';

  // put the add review button back on again
  var button = document.querySelector('#add-newReviewButton');
  button.style.display = 'inline-block';
});

// listen if the user is offline | online
window.addEventListener('offline', function(e) { 
  console.log('offline'); 
});

// I am online fetch deferredReview temp database and insert to my live database
window.addEventListener('online', function(e) { 
  console.log('online'); 
  dbPromise.then(db => {
    // getting the cached restaurant database
    var review = db.transaction('keyval')
      .objectStore('keyval').get('deferredReview');

    // if there is review waiting deferredReview database then add that review upto the server
    if(review) {
      DBHelper.addReview(review, (error, reviewResponse) => {
        // what do i want to happen after review is in database
        console.log(reviewResponse);
        // adding review to DOM
        document.getElementById('reviews-form').reset();
    
        // add review with others
        const container = document.getElementById('reviews-container');
        const ul = document.getElementById('reviews-list');
        ul.appendChild(createReviewHTML(reviewResponse));
        container.appendChild(ul);
        
        // display thank you message to user for submitting a review!
        document.getElementById('review-formModal').innerHTML = '<p class="modal-wrapper-review-submit-success"><span class="close" id="close-thankyou">&times; </span>Thank you, your review has been submitted!</p>';
    
        // close thank you message modal
        document.querySelector('#close-thankyou').addEventListener('click', function (event) {
          // grab review form modal and hide it 
          var button = document.querySelector('#review-formModal');
          button.style.display = 'none';
        
          // now this person already submit review Don't show the addReview button!
        })
      // checking if there no deferredReview exist in my tempDB then do nothing
      }); 
      dbPromise.then(function(db) {
        // Putting the cached into the iDB
        var tx = db.transaction('keyval', 'readwrite');
        var keyValStore = tx.objectStore('keyval');
  
        // false means there is no deferred review > do nothing
        keyValStore.put(false, 'deferredReview');
        return tx.complete;
      });
    }
    
  });
});

