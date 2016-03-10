import Ember from 'ember';

export default Ember.Component.extend({
  markers: [],
  old_marker: undefined,
  session: Ember.inject.service(),
  old_position: undefined,
  places_markers: [],
	insertMap: function() {
    var self = this;
      var center = this.get('center');
      var mapCenter = new google.maps.LatLng(center.get('latitude'), center.get('longitude'));

      var mapOptions = {
          zoom: 15,
          center: mapCenter
      };

      var map = new google.maps.Map(document.getElementById("map-canvas-one"),
    mapOptions);
      
      //searchbox

      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      searchBox.addListener('places_changed', function() {
                var places = searchBox.getPlaces();

                if (places.length == 0) {
                  return;
                }

                // Clear out the old markers.
                var places_markers = self.get('places_markers');
                places_markers.forEach(function(marker) {
                  marker.setMap(null);
                });
                places_markers = [];

                // For each place, get the icon, name and location.
                var bounds = new google.maps.LatLngBounds();
                places.forEach(function(place) {
                  var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                  };

                  // Create a marker for each place.
                  places_markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                  }));

                  if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                  } else {
                    bounds.extend(place.geometry.location);
                  }
                });
                self.set('places_markers', places_markers);
                map.fitBounds(bounds);
              });
      /////////////////////////


      var lt, lg, i, marker, latLng;

        var type = center.get('centerType');

        lt = center.get('latitude');
        lg = center.get('longitude');

        if (lt && lg) {
          latLng = new window.google.maps.LatLng(
              lt,
              lg
          );
          

        if (type === 1) {
          marker = new google.maps.Marker({
              position: latLng,
              map: map,
              animation: google.maps.Animation.DROP,
              icon: "assets/map-icons/revolt.png"
          });
        }
        else if (type === 2) {
          marker = new google.maps.Marker({
              position: latLng,
              map: map,
              animation: google.maps.Animation.DROP,
              icon: "assets/map-icons/restaurant.png"
          });
        }
        else if (type === 3) {
          marker = new google.maps.Marker({
              position: latLng,
              map: map,
              animation: google.maps.Animation.DROP,
              icon: "assets/map-icons/camping-2.png"
          });
        }
        else if (type === 4) {
          marker = new google.maps.Marker({
              position: latLng,
              map: map,
              animation: google.maps.Animation.DROP,
              icon: "assets/map-icons/cabin-2.png"
          });
        }
        else if (type === 5) {
          marker = new google.maps.Marker({
              position: latLng,
              map: map,
              animation: google.maps.Animation.DROP,
              icon: "assets/map-icons/firstaid.png"
          });
        }
        else {
          marker = new google.maps.Marker({
              position: latLng,
              map: map,
              animation: google.maps.Animation.DROP
          });          
        }


          marker.infowindow = new google.maps.InfoWindow({
              content: '<div id="content">'+
                          '<h5>' + center.get('name') + '</h5>'+
                          '<div id="bodyContent">'+
                          '<br>' + 
                          '<b>' + 'Διεύθυνση:' + ': </b>' + ParseAddress(center.get('address')) +
                          '<br>' +
                          '<b>'  + getTextCenterType(center.get('centerType')) + '</b>' +
                          '</div>'+
                          '</div>',
              options: {
                maxWidth: 200
              }
            });

          this.get('markers').pushObject(marker);
        this.set('old_marker', marker);
        this.set('old_position', latLng);
        google.maps.event.addListener(marker, 'mouseover', hoverHandler(marker));  

        google.maps.event.addListener(marker, 'mouseout', hoverOutHandler());
      }
      this.set('map', map);
    
      if (this.get('isCurrentCenter') && this.get('session.isAuthenticated')) {
        showButtonToEdit();
      }

      function showButtonToEdit() {
        var centerControlDiv = document.createElement('div');
        var centerControl = new maximize(centerControlDiv, map);

        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
        google.maps.event.clearListeners(map, 'mouseover');
/*        $("#map-canvas-one").mouseleave(function() { 
          map.controls[google.maps.ControlPosition.TOP_RIGHT].clear();
          map.addListener('mouseover', function() {showButtonToEdit() });
          Ember.run(self, self.disableEditing);
         });*/
      }

      function getTextCenterType(num) {
        switch (num) {
          case 1:
            return 'Αυτοδιαχειριζόμενη δομή';
            break;
          case 2:
            return 'Μαγειρείο';
            break;
          case 3:
            return 'Δομή πρώτης υποδοχής';
            break;
          case 4:
            return 'Ανοιχτή δομή φιλοξενίας';
            break;
          case 5:
            return 'Ναυαγωσωστική ομάδα';
            break;
          default:
          return '';
            break;

        }

      }

//maximization custom control
      
      function maximize(controlDiv, map) {
      // Set CSS for the control border.
      var controlUI = document.createElement('div');
      controlUI.style.backgroundColor = '#fff';
      controlUI.id = 'map-edit';
      controlUI.style.border = '2px solid #fff';
      controlUI.style.cursor = 'pointer';
    
      controlUI.style.textAlign = 'center';
      controlUI.title =  'Επεξεργασία τοποθεσίας';
      controlDiv.appendChild(controlUI);

      // Set CSS for the control interior.
      var controlText = document.createElement('div');
      controlText.style.paddingLeft = '0px';
      controlText.style.paddingRight = '0px';
      controlText.style.paddingTop = '0px';

      controlText.innerHTML = '<button><i class="fa fa-edit"></i></button>';

//      controlText.innerHTML = '<i class="fa fa-2x fa-arrows"></i>';
      controlUI.appendChild(controlText);

      controlUI.addEventListener('click', function() {
        if (!self.get('isEditing'))  {
          Ember.run(self, self.enableEditing);
        }
        else {
          Ember.run(self, self.disableEditingAndDontSave);
        }
      });

    }




      function hoverHandler(marker) {
        return function() {
          marker.infowindow.open(map, marker);
        };
      }

      function hoverOutHandler() {
        return function() {
          this.infowindow.close();
        };
      }


      function ParseAddress (addr) {
        if (addr) {
          return addr;
        }
        else {
          return "-"
        }
      }
  

	}.on('didInsertElement'),
  enableEditing: function() {
    var map = this.get('map');
    var markers = this.get('markers');
    var marker;
    var center = this.get('center');
    var _this = this;
    var latLng;

    if (markers.length > 0) {
      marker = markers[0];
      marker.set('draggable', true);
    }
    this.set('isEditing', true);
/*

      function maximize(controlDiv, map) {
      // Set CSS for the control border.
      var controlUI = document.createElement('div');
      controlUI.style.backgroundColor = '#fff';
      controlUI.id = 'map-edit';
      controlUI.style.border = '2px solid #fff';
      controlUI.style.borderRadius = '3px';
      controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
      controlUI.style.cursor = 'pointer';
      controlUI.style.marginTop = '22px';
      controlUI.style.marginLeft = '22px';      
      controlUI.style.textAlign = 'center';
      controlUI.title =  'Edit';
      controlDiv.appendChild(controlUI);

      // Set CSS for the control interior.
      var controlText = document.createElement('div');
      controlText.style.lineHeight = '38px';
      controlText.style.paddingLeft = '0px';
      controlText.style.paddingRight = '0px';
      controlText.style.paddingTop = '0px';
      controlText.style.height = '28px';
      controlText.style.width = '28px';
      controlText.innerHTML = "<button class='btn btn-primary'>Καταχώρηση</button>";

//      controlText.innerHTML = '<i class="fa fa-2x fa-arrows"></i>';
      controlUI.appendChild(controlText);

      controlUI.addEventListener('click', function() {

        Ember.run(_this, _this.disableEditingAndSave);
      });

    }

        var centerControlDiv = document.createElement('div');
        var centerControl = new maximize(centerControlDiv, map);

        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(centerControlDiv);
*/


    google.maps.event.addListener(map, 'click', function(event) {
      if (markers.length > 0) {
        marker = markers.pop();
        google.maps.event.clearInstanceListeners(marker);
        marker.setMap(null);
      }


        var type = center.get('centerType');


        if (type === 1) {
          marker = new google.maps.Marker({
              position: event.latLng,
              map: map,
              icon: "assets/map-icons/revolt.png"
          });
        }
        else if (type === 2) {
          marker = new google.maps.Marker({
              position: event.latLng,
              map: map,
              icon: "assets/map-icons/restaurant.png"
          });
        }
        else if (type === 3) {
          marker = new google.maps.Marker({
              position: event.latLng,
              map: map,
              icon: "assets/map-icons/camping-2.png"
          });
        }
        else if (type === 4) {
          marker = new google.maps.Marker({
              position: event.latLng,
              map: map,
              icon: "assets/map-icons/cabin-2.png"
          });
        }
        else if (type === 5) {
          marker = new google.maps.Marker({
              position: event.latLng,
              map: map,
              icon: "assets/map-icons/firstaid.png"
          });
        }
        else {
          marker = new google.maps.Marker({
              position: event.latLng,
              map: map
          });          
        }


        marker.infowindow = new google.maps.InfoWindow({
            content: '<div id="content">'+
                        '<h5>' + center.get('name') + '</h5>'+
                        '<div id="bodyContent">'+
                        '<br>' + 
                        '<b>' + 'Διεύθυνση:' + ': </b>' + ParseAddress(center.get('address')) +
                        '<br>' +
                        '<b>'  + getTextCenterType(center.get('centerType')) + '</b>' +
                        '</div>'+
                        '</div>',
            options: {
              maxWidth: 200
            }
          });

        google.maps.event.addListener(marker, 'mouseover', hoverHandler(marker));  

        google.maps.event.addListener(marker, 'mouseout', hoverOutHandler());
        marker.set('draggable', true);
        _this.get('markers').pushObject(marker);
        });

      function ParseAddress (addr) {
        if (addr) {
          return addr;
        }
        else {
          return "-"
        }
      }
  
      function getTextCenterType(num) {
        switch (num) {
          case 1:
            return 'Αυτοδιαχειριζόμενη δομή';
            break;
          case 2:
            return 'Μαγειρείο';
            break;
          case 3:
            return 'Δομή πρώτης υποδοχής';
            break;
          case 4:
            return 'Ανοιχτή δομή φιλοξενίας';
            break;
          case 5:
            return 'Ναυαγωσωστική ομάδα';
            break;
          default:
          return '';
            break;

        }

      }
      function hoverHandler(marker) {
        return function() {
          marker.infowindow.open(map, marker);
        };
      }

      function hoverOutHandler() {
        return function() {
          this.infowindow.close();
        };
      }

  },
  disableEditing: function() {
    this.set('isEditing', false);

    var map = this.get('map');
    var markers = this.get('markers');
    if (markers.length) {
      var marker = markers[0];
      marker.set('draggable', false);
    }
    map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].clear();
    google.maps.event.clearListeners(map, 'click');
  },
  disableEditingAndDontSave: function() {
    this.set('isEditing', false);

    var map = this.get('map');
    var markers = this.get('markers');
    var old_marker = this.get('old_marker');
    var marker = markers[0];
    if (marker) {
      marker.setMap(null);
      google.maps.event.clearInstanceListeners(marker);
    }
    markers = [];
    if (old_marker) {
      var latLng = new window.google.maps.LatLng(
              this.get('old_position').lat(),
              this.get('old_position').lng()
          );
//      console.log(this.get('old_position').lat(), this.get('old_position').lng())
      old_marker.set('position', latLng);
      old_marker.set('draggable', false);
      old_marker.setMap(map);
      markers.push(old_marker);
    }
    this.set('markers', markers);
    google.maps.event.clearListeners(map, 'click');
  },
  actions: {
    disableEditingAndSave: function() {
      console.log("saving")
      this.set('isEditing', false);
      var markers = this.get('markers');
      if (!markers.length) {
        Ember.run(this, this.disableEditing);
      } 
      else {
        var marker = markers[0];
        this.set('old_marker', marker);
        this.set('old_position', marker.position);
        var center = this.get('center');
        var position = marker.getPosition();
        center.set('latitude', position.lat());
        center.set('longitude', position.lng());
        center.save();
        Ember.run(this, this.disableEditing);
      }
    }
  }
});
