const workGallery = document.querySelector(".work-gallery");
let galleryDocument = ``;
gallery_array.forEach((gallery) => {
  galleryDocument += `
            <div class="work-container">
                    <a href="/photos.html?folder=${gallery.code}" class="folder">
                        <div class="front">
                            <img src="./assets/work_photos/${gallery.code}/${gallery.img}">
                        </div>
                        <div class="back">
                        </div>
                    </a>
                    <span>${gallery.label}</span>
                </div>
            `;
});
workGallery.innerHTML = galleryDocument;
