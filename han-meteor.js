Events = new Mongo.Collection("events");

markers = [
  marker1 = ["40.749704", "-73.969175", "UNITED NATIONS HEADQUARTERS BUILT", "1952", "The United Nations was formulated among delegations from the Soviet Union, the US, the UK, and China. The United Nations Charter was officially ratified by the five permanent members of the council - the four aforementioned, and France. 46 other signatories were present. In 1945, the construction of the United Nations Headquarters in New York City was finally completed."],
  marker2 = ["40.749704", "-73.969175", "UNITED NATIONS HEADQUARTERS BUILT", "1952", "The United Nations was formulated among delegations from the Soviet Union, the US, the UK, and China. The United Nations Charter was officially ratified by the five permanent members of the council - the four aforementioned, and France. 46 other signatories were present. In 1945, the construction of the United Nations Headquarters in New York City was finally completed."],
  marker3 = ["40.749704", "-73.969175", "UNITED NATIONS HEADQUARTERS BUILT", "1952", "The United Nations was formulated among delegations from the Soviet Union, the US, the UK, and China. The United Nations Charter was officially ratified by the five permanent members of the council - the four aforementioned, and France. 46 other signatories were present. In 1945, the construction of the United Nations Headquarters in New York City was finally completed."]
];

maxDistance = 70;

geocoder = null;
map = null;
panorama = null;

if (Meteor.isClient) {
  Meteor.startup(function(){

    function initialize() {
      geocoder = new google.maps.Geocoder();
      var fenway = new google.maps.LatLng(42.345573, -71.098326);
      var mapOptions = {
        center: fenway,
        zoom: 14
      };
      map = new google.maps.Map(document.getElementById('map'), mapOptions);

      var panoramaOptions = {
        position: fenway,
        pov: {
          heading: 34,
          pitch: 10
        }
      };
      panorama = new google.maps.StreetViewPanorama(document.getElementById('sv'), panoramaOptions);
      map.setStreetView(panorama);
    };

    google.maps.event.addDomListener(window, 'load', initialize);
  });

  Template.main.events({
    'click #go': function(e, t) {
      var address = document.getElementById('location').value;
      geocoder.geocode({'address': address}, function(results, status){
        if(status == google.maps.GeocoderStatus.OK){
          map.setCenter(results[0].geometry.location);
          panorama.setPosition(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          });
        } else {
          alert("Failed geocode.");
        }
      });
    },

    'click': function(e, t) {
      for(var i=0; i<markers.length; i++) {
        var l_marker = new google.maps.LatLng(markers[i][0], markers[i][1]);
        var distance = google.maps.geometry.spherical.computeDistanceBetween(l_marker, panorama.getPosition());
        console.log(distance);
        if(distance<maxDistance) {
          Session.set("inRange", "inRange");
          Session.set("title", markers[i][2]);
          Session.set("date", markers[i][3]);
          Session.set("description", markers[i][4]);
        } else {
          Session.set("inRange", "");
          Session.set("title", "");
          Session.set("date", "");
          Session.set("description", "");
        }
      }
    }
  });

  Template.main.helpers({
    inRange: function() {
      return Session.get("inRange");
    },
    title: function(){
      return Session.get("title");
    },
    date: function(){
      return Session.get("date");
    },
    description: function(){
      return Session.get("description");
    }
  })

}
