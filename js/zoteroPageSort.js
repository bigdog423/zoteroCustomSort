function zoteroPageSort(key, sortBy, usergroup, id){

  //Overloading parameters
  if(!usergroup) {console.log("You forgot the usergroup parameter, 'groups' selected");usergroup = "groups";}
  if(!id) {console.log("You forgot the id parameter, '430843' selected");id = "430843";}
  if(!key) {console.log("You forgot the key parameter, '8U86CMSC' selected");key = "8U86CMSC";}
  if(!sortBy) {console.log("You forgot the sortBy parameter, sorting by firstPage");sortBy = "firstPage";}

  console.log("init");
  //creating a new Asynchronous request
  var xhttp = new XMLHttpRequest();

  //when the response is received, we execute the logic if it's a http 200 response (everything went well)
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      //parsing the response into an object
      data = JSON.parse(xhttp.responseText);
      console.log("data received");
      var sortedArray = [];
      //for every row of the data object, do stuff (if you want to add new key/value for each row)
      for(i=0;i<data.length;i++){


        //if creators is defined, we create a new key/value named authors containing all the names in FirstName lastName order;
        if(typeof data[i].data.creators !== "undefined"){
          data[i].data.authors = "";
          for(j=0;j<data[i].data.creators.length;j++){
            if(data[i].data.creators[j].creatorType == "author"){
              data[i].data.authors += data[i].data.creators[j].firstName+" "+data[i].data.creators[j].lastName;
              data[i].data.authors += ", ";
            }
          }
        }
        //else populate empty one
        else{
          data[i].data.authors = "";
        }


        //if pages are defined, create a new key/value named firstPage
        if(typeof data[i].data.pages !== "undefined"){
          firstpage = data[i].data.pages.split("-");
          data[i].data.firstPage = firstpage[0];
        }
        //else populate empty ones
        else{
          data[i].data.firstPage = 0;
          data[i].data.pages = 0;
        }

        //If you need new key/value to display or sort by, add your code here

      }
      //Sort fonction
      data.sort(customSort(sortBy));

      //display the result in #zoteroPageSort
      for(i=0;i<data.length;i++){
        if(data[i].data.pages != 0){
        //document.getElementById("zoteroPageSort").innerHTML = document.getElementById("zoteroPageSort").innerHTML+"Titre : <a href=\""+data[i].data.url+"\">"+data[i].data.title+"</a><br>Auteur(s) : "+data[i].data.authors+"<br>pages : "+data[i].data.pages+"<br><br>";
        document.getElementById("zoteroPageSort").innerHTML = document.getElementById("zoteroPageSort").innerHTML+data[i].data.authors+" <a href=\""+data[i].data.url+"\">"+data[i].data.title+"</a>, p. "+data[i].data.pages+".<br><br>";
        }
      }
    }
  };

  //Open the Asynchronous request
  xhttp.open("GET", "https://api.zotero.org/"+usergroup+"/"+id+"/collections/"+key+"/items?v=3", true);

  //send it
  xhttp.send();
}

//customSort function that is ingested by the sort function, do not change stuff here (or if you know what you're doing there)
function customSort(sortBy) {
    return function(a, b) {
        return a.data[sortBy] - b.data[sortBy];
    }
}
