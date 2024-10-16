const xhr = new XMLHttpRequest;
document.addEventListener('DOMContentLoaded', () => {

    const gallery = document.querySelector('.gallery');

    /*Loads photos using data from load.php file, and handle photo clicks once photos are loaded*/
    window.onload = loadPhotos();
    function loadPhotos() {	
        xhr.open("POST","http://data-cmp.infinityfreeapp.com/load.php");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
                if (xhr.readyState==4 && xhr.status==200) {

                    //Load Photos
                    let response = JSON.parse(xhr.responseText);
                    console.log("Loaded Photos: "+response);
                    const totalPhotos = (response.length - 1);
                    for (var i = 0; i < response.length; i++) { //loop for each image file in response
                        let fileName = response[i];

                        let preFileNameNoExtension = fileName.substring(0, fileName.lastIndexOf('.')); //removes file extension
                        let fileNameNoExtension = preFileNameNoExtension.replace(/[^A-Z0-9]+/ig, "_");; //removes spaces and special characters

                        console.log(fileName+" nameLength: "+fileName.lastIndexOf('.')+" name: "+fileNameNoExtension);

                        let image = document.createElement("IMG"); //creates new image element
                        image.classList.add('gallery-item');
                        image.setAttribute("src", "/photos/"+fileName);
                        image.setAttribute("data-image", fileNameNoExtension);
                        image.setAttribute("data-index", i);

                        gallery.appendChild(image); //appends image element to photos container
                    }
                    //
                    
                    //Handle Photo Clicks
                    const galleryItems = document.querySelectorAll('.gallery-item');
                    const largeContainer = document.getElementById('large-view');
                    const largeImage = document.getElementById('large-image');
                    const close = document.getElementById('close');
                    const previous = document.getElementById('previous');
                    const next = document.getElementById('next');

                    let scrollPos = 0;
                    console.log(galleryItems);
                    
                    function openLargeContainer(imageSrc, imageId, imageIndex) {
                        largeContainer.style.display = 'flex';
                        largeImage.src = imageSrc;
                        history.pushState({imageId: imageId}, null, `/view/${imageId}`);
                        window.scrollTo(0, 0);
                        document.body.style.overflow = 'hidden';

                        // hides next/previous buttons if first/last image of array is enlarged
                        if (imageIndex == 0) {
                            previous.style.visibility = 'hidden';
                            next.style.visibility = 'visible';
                        }
                        else if (imageIndex == totalPhotos) {
                            next.style.visibility = 'hidden';
                            previous.style.visibility = 'visible';
                        }
                        else {
                            next.style.visibility = 'visible';
                            previous.style.visibility = 'visible';
                        }
                        //
                    }

                    function closeLargeContainer(scrollPos) {
                        largeContainer.style.display = 'none';
                        history.pushState(null, null, '/');
                        document.body.style.overflow = 'auto';
                        console.log("Returning to "+scrollPos);
                        window.scrollTo(0, scrollPos);
                    }

                    //Stores Scroll Position so it can be restored once full sceen mode is closed
                    //Put all functions that will be used to close full screen mode inside of this function
                    function getScrollPos(scrollPos) {
                        // Close large view when clicking outside the image
                        largeContainer.addEventListener('click', (e) => clickOutsideImage(scrollPos, e));
                        close.addEventListener('click', (e) => closeBtn(scrollPos, e));

                        function clickOutsideImage(scrollPos, e) {
                            if (!e.target.closest('#large-image-info-container')) {
                                closeLargeContainer(scrollPos);
                            }
                        }

                        function closeBtn(scrollPos) {
                            closeLargeContainer(scrollPos);
                        }
                    }

                    function slideButtons(imageSrc, imageId, imageIndex, scrollPos) {

                        next.addEventListener('click', (e) => nextImage(imageSrc, imageId, ++imageIndex, scrollPos));
                        previous.addEventListener('click', (e) => nextImage(imageSrc, imageId, --imageIndex, scrollPos));

                        function nextImage(imageSrc, imageId, imageIndex, scrollPos) {
                            console.log(typeof imageIndex);
                            let selectNextImage = document.querySelector(`[data-index="${imageIndex}"]`);
                            console.log("Next Image Index = "+imageIndex);
                            imageSrc = selectNextImage.getAttribute('src');
                            imageId = selectNextImage.getAttribute('data-image');
                            //closeLargeContainer(scrollPos);
                            openLargeContainer(imageSrc, imageId, imageIndex);
                        }
                    }

                    // Handle Clicking On Photo
                    galleryItems.forEach(item => {
                        item.addEventListener('click', function () {
                            scrollPos = Math.floor(window.scrollY);
                            console.log("Scroll Pos: "+scrollPos);
                            const imageSrc = this.getAttribute('src');
                            const imageId = this.getAttribute('data-image');
                            const imageIndex = this.getAttribute('data-index');
                            console.log("Clicked Image "+imageId);
                            openLargeContainer(imageSrc, imageId, imageIndex);
                            slideButtons(imageSrc, imageId, imageIndex, scrollPos);
                            getScrollPos(scrollPos);
                        });
                    });

                     // Handle the browser back/forward buttons
                    window.addEventListener('popstate', function (event) {
                        if (event.state && event.state.imageId) {
                            // If state has an imageId, open the large view with that image
                            const imageElement = document.querySelector(`[data-image="${event.state.imageId}"]`);
                            if (imageElement) {
                                openLargeContainer(imageElement.src, event.state.imageId);
                            }
                        } else {
                            // If no state or state is null, close the large view
                            closeLargeContainer(scrollPos);
                        }
                    });

                    // On page load, check if URL is already at a specific image (e.g., /view/image1)
                    const currentPath = window.location.pathname;
                    if (currentPath.startsWith('/view/')) {
                        const imageId = currentPath.split('/view/')[1];
                        const imageElement = document.querySelector(`[data-image="${imageId}"]`);
                        let imageIndex = imageElement.getAttribute('data-index');
                        if (imageElement) {
                            openLargeContainer(imageElement.src, imageId, imageIndex);
                            slideButtons(imageElement.src, imageId, imageIndex, scrollPos);
                            getScrollPos(scrollPos);
                        }
                    }
                    //
                }
        }
        xhr.send("load=1")
    }
    

    /* When the user clicks on the menu button, 
    toggle between hiding and showing the dropdown content */
    window.onload = function() {
        console.log("JS Script Loaded");
        document.getElementById('menu_button').onclick = function() {
            console.log("Menu Button Clicked");
            document.getElementById('menu').classList.toggle('hide');
            this.style.backgroundColor = "";
        }
    }

    // Close the dropdown if the user clicks outside of it
    window.onclick = function(e) {
        if (!e.target.closest('#menu') && !e.target.matches('#menu_button')) {
        var menu = document.getElementById("menu");
            if (!menu.classList.contains('hide')) {
                menu.classList.toggle('hide');
            }
        }
    }
});