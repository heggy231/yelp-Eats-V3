#Understanding aria-labelledby:

<p id="restaurant-address" tabindex="0" aria-labelledby="address_label"></p>
       <label id="address_label" class="aria-label">Restaurant Address</label>
to do aria on this HTML element, I simply give it the attiribute aria-labelledby="address_label"
then I create another html element
<label id="address_label" class="aria-label">Restaurant Address</label>
now understand what this attribute on the label is very important class="aria-label"
in your css you are going to need to add this to your file:
.aria-label {
 display: none;
}

- What this does is effectively hide the aria-labels
now what's neat is because you can add aria labels in HTML and have them hidden, but in your JavaScript ... modify the contents! So when you are autogenerating your restaurants, you can autogenerate the aria labels too.
here is a code example here:
const aria_label = document.createElement('label');
 aria_label.id = restaurant_name + "_label";
 aria_label.className = "aria-label";
 aria_label.innerHTML = "Link: Restaurant " + restaurant.name + " Details. Neighborhood: " + restaurant.neighborhood + " Address: " + restaurant.address;
that was the aria for a label for a restaurant button. here is the code to make the restaurant button and assign the aria label to it:
const more = document.createElement('button');
 var label_attribute = document.createAttribute("aria-labelledby");
 var restaurant_name = restaurant.name;
 restaurant_name = restaurant_name.replace(/\s+/g, '');
 label_attribute.value = restaurant_name + "_label";
 more.setAttributeNode(label_attribute);
 more.innerHTML = 'View Details';


 - KatieGirl phase 1 project here: https://portfolio.katiegirl.net/2018/07/10/restaurant-reviews-app-stage-1/

 review her aria-labels