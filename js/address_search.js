$( document ).ready(function() { 
   document.getElementById('results').style.display = 'none';
   $('#geocode').click(function(){
      document.getElementById('results').style.display = 'none';
      geocode()
   }); 
   function geocode(){
      var address = document.getElementById("address").value;
      var address2 = document.getElementById("address2").value;
      var city = document.getElementById("city").value;
      var state = document.getElementById("state").value;
      var postalcode = document.getElementById("zipcode").value;
      var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+address+','+address2+','+city+','+state+','+postalcode;
      $.ajax({
         url: url,
         async:true,
         type: 'GET',
         dataType: 'json',
         success: function(data) {
            address = data.results[0].formatted_address
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;
            var marker = L.marker([lat, lng]).addTo(map);
            map.setView([lat, lng], 14);            
          document.getElementById("address_result").innerText = address;

          landslide_url = "https://maps1.arcgisonline.com/ArcGIS/rest/services/USGS_Landslides/MapServer/0/query?geometry="+lng+","+lat+"&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=&time=&returnIdsOnly=false&returnGeometry=false&maxAllowableOffset=&outSR=&outFields=*&f=pjson"
          $.ajax({
            url: landslide_url,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
               var risk = data.features[0].attributes.IncAndSus;
               document.getElementById("risk_result").innerText = risk;
               document.getElementById('results').style.display = 'block';

            },
            error: function(e) {
               console.log(e)
            }   
         });

       },
       error: function(e) {
         console.log(e)
      }   
   });
   }




});




