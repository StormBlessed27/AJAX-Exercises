//We declare the main DOM elements that we are gonna to use.
const d = document,
  $main = d.querySelector("main"),
  $dropzone = document.querySelector(".drop-zone");

//Create the main function that gonna interact with the server through a PHP script and using the XMLhttpRequest object. This function send the files captured in the drag-zone.
const uploader = (file) => {
    const xhr = new XMLHttpRequest(),
      formData = new FormData(); //Create a form-model to append de data and send it to the server
    formData.append("file", file);
    xhr.addEventListener("readystatechange", (e) => {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status <= 300) {
        let json = JSON.parse(xhr.responseText);
        console.log(json);
      } else {
        let message = xhr.statusText || "Ha ocurrido un Error!";
        console.log(xhr.responseText);
        alert(`Error ${xhr.status}: ${message}`);
      }
    });

    xhr.open("POST", "assets/uploader.php");
    xhr.setRequestHeader("enc-type", "multipart/form-data"); //Creating the header of the request
    xhr.send(formData);
  },
  //This function interact with the DOM, creating a progress bar for all the files that was drop on the drag-zone and calling the upload() function for send each file.
  progressUpload = (file) => {
    //We create the progress bar, its values and inner elements
    const $progress = d.createElement("progress"),
      $span = d.createElement("span");
    $progress.value = 0;
    $progress.max = 100;
    $main.insertAdjacentElement("beforeend", $progress);
    $main.insertAdjacentElement("beforeend", $span);

    //This 'file reader' interprets the uploading information of every file
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    //Function that calculate the uploading percentage of each file.
    fileReader.addEventListener("progress", (e) => {
      let progress = parseInt((e.loaded * 100) / e.total);
      $progress.value = progress;
      $span.innerHTML = `<b>${file.name} - ${progress}%</b>`;
    });

    //Deleting the progress (es) bar(s)
    fileReader.addEventListener("loadend", (e) => {
      uploader(file);
      setTimeout(() => {
        $main.removeChild($progress);
        $main.removeChild($span);
      }, 3000);
    });
  };

//Event when the file(s) are dragged over the drag-zone, in this case an animation start when are files over the drag-zone
$dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.stopPropagation();
  $dropzone.classList.add("is-active");
});

//Event when the file(s) leave the drag-zone. The animation ends
$dropzone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  e.stopPropagation();
  $dropzone.classList.remove("is-active");
});

//Event when the file(s) are dropped in the drag-zone. The animations ends and the function progressUpload() its called.
$dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  e.stopPropagation();
  $dropzone.classList.remove("is-active");
  console.log(e.dataTransfer);
  let files = Array.from(e.dataTransfer.files);
  files.forEach((file) => {
    progressUpload(file);
  });
});
