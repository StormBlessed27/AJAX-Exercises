const d = document,
  $main = d.querySelector("main"),
  $dropzone = document.querySelector(".drop-zone");

const uploader = (file) => {
    //console.log(file);
    const xhr = new XMLHttpRequest(),
      formData = new FormData();
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
    xhr.setRequestHeader("enc-type", "multipart/form-data");
    xhr.send(formData);
  },
  progressUpload = (file) => {
    console.log(file);
    const $progress = d.createElement("progress"),
      $span = d.createElement("span");
    $progress.value = 0;
    $progress.max = 100;
    $main.insertAdjacentElement("beforeend", $progress);
    $main.insertAdjacentElement("beforeend", $span);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.addEventListener("progress", (e) => {
      let progress = parseInt((e.loaded * 100) / e.total);
      $progress.value = progress;
      $span.innerHTML = `<b>${file.name} - ${progress}%</b>`;
    });
    fileReader.addEventListener("loadend", (e) => {
      uploader(file);
      setTimeout(() => {
        $main.removeChild($progress);
        $main.removeChild($span);
      }, 3000);
    });
  };

$dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.stopPropagation();
  $dropzone.classList.add("is-active");
});
$dropzone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  e.stopPropagation();
  $dropzone.classList.remove("is-active");
});
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
