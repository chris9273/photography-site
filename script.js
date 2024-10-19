var lazyLoadInstance = new LazyLoad({
    // Your custom settings go here
});

const xhr = new XMLHttpRequest;
document.addEventListener('DOMContentLoaded', () => {

    const gallery = document.querySelector('.gallery');
    let globalIndex = -1;

    /*Loads photos using data from load.php file, and handle photo clicks once photos are loaded*/
    window.onload = loadPhotos();
    function loadPhotos() {	
        xhr.open("POST","https://photography-site-438818.nw.r.appspot.com/");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
                if (xhr.readyState==4 && xhr.status==200) {

                    //Load Photos
                    let response = JSON.parse(xhr.responseText);
                    console.log("Loaded Photos: "+response);
                    const albumData = [];
                    const photoData = [];
                    let currentView = 1; //0 - photos view, 1 - album view
                    console.log(albumData,photoData);
                    for (var i = 0; i < response.length; i++) { //loop for each album folder in response
                        let albumIndex = -1;

                        albumData.push({
                            name: response[i].name,
                            files: response[i].files,
                            albumId: response[i].name.replace(/[^A-Z0-9]+/ig, "_"), //removes spaces and special characters,
                        });

                        //CREATE NEW ELEMENTS FOR ALBUM THUMBNAIL
                        let albumDiv = document.createElement("DIV");
                        albumDiv.classList.add('gallery-item');
                        //albumDiv.style.backgroundImage = "url('/photos/"+albumData[i].name+"/"+albumData[i].files[0]+"')";
                        //albumDiv.style.backgroundSize = "cover";
                        albumDiv.classList.add('album-thumbnail');
                        albumDiv.setAttribute("data-album-name", albumData[i].name);
                        albumDiv.setAttribute("data-album-id", albumData[i].albumId);

                        let bgImg = document.createElement("IMG");
                        /*bgImg.setAttribute('src', '/photos/'+albumData[i].name+'/'+albumData[i].files[0]);*/
                        bgImg.setAttribute('data-src', 'https://photography-site-438818.nw.r.appspot.com/photos/'+albumData[i].name+'/'+albumData[i].files[0]);
                        bgImg.classList.add('lazy');

                        let bgOverlay = document.createElement("DIV");
                        bgOverlay.classList.add('background-image-overlay');
                        albumDiv.appendChild(bgOverlay);
                          
                        let albumDivName = document.createElement("SPAN");
                        albumDivName.innerText = albumData[i].name;
                        //

                        albumDiv.appendChild(albumDivName); //appends album name element to album div
                        albumDiv.appendChild(bgImg);
                        albumDiv.appendChild(bgOverlay);
                        gallery.appendChild(albumDiv); //appends album element to photos container


                        response[i].files.forEach(file => {
                            globalIndex++;  //increments global index by 1 so images can be ordered (used for slideshow system)
                            albumIndex++;   //used to give each image a local index relaive to the album its part of
                            let fileName = file;
                            let albumName = response[i].name;
                            //console.log(fileName+' '+albumName);

                            let preFileNameNoExtension = fileName.substring(0, fileName.lastIndexOf('.')); //removes file extension
                            let fileNameNoExtension = preFileNameNoExtension.replace(/[^A-Z0-9]+/ig, "_");; //removes spaces and special characters

                            //console.log(fileName+" nameLength: "+fileName.lastIndexOf('.')+" name: "+fileNameNoExtension);

                            //CREATE NEW IMAGE ELEMENT
                            let image = document.createElement("IMG");
                            image.classList.add('gallery-item');
                            //image.setAttribute("src", "/photos/"+albumName+"/"+fileName);
                            image.setAttribute("data-src", "https://photography-site-438818.nw.r.appspot.com/photos/"+albumName+"/"+fileName);
                            image.classList.add('lazy');
                            image.setAttribute("data-image", fileNameNoExtension);
                            image.setAttribute("data-index", globalIndex);
                            image.setAttribute("data--album-index", albumIndex);
                            //

                            gallery.appendChild(image); //appends image element to photos container

                            photoData.push({ //adds new photo object to array of objects containing details about photo
                                fileNameRaw: fileName,
                                dataImage: fileNameNoExtension,
                                dataIndex: globalIndex,
                                album: albumName,
                                albumId: albumName.replace(/[^A-Z0-9]+/ig, "_"),
                                dataAlbumIndex: albumIndex, 
                                description: "No description",
                            });
                        });
                        /*let fileName = response[i];

                        let preFileNameNoExtension = fileName.substring(0, fileName.lastIndexOf('.')); //removes file extension
                        let fileNameNoExtension = preFileNameNoExtension.replace(/[^A-Z0-9]+/ig, "_");; //removes spaces and special characters

                        console.log(fileName+" nameLength: "+fileName.lastIndexOf('.')+" name: "+fileNameNoExtension);

                        let image = document.createElement("IMG"); //creates new image element
                        image.classList.add('gallery-item');
                        image.setAttribute("src", "/photos/"+fileName);
                        image.setAttribute("data-image", fileNameNoExtension);
                        image.setAttribute("data-index", i);
                        
                        gallery.appendChild(image); //appends image element to photos container*/
                    }
                    //
                    
                    lazyLoadInstance.update();

                    //Load Albums
                    //
                    
                    const galleryContainer = document.querySelector('.gallery');
                    const galleryItems = document.querySelectorAll('.gallery-item');
                    const largeContainer = document.getElementById('large-view');
                    const largeImage = document.getElementById('large-image');
                    const close = document.getElementById('close');
                    const previous = document.getElementById('previous');
                    const next = document.getElementById('next');
                    const changeViewButton = document.getElementById('change-view');
                    const albumNav = document.getElementById('album-navigation');
                    const albumNavBackBtn = document.getElementById('album-nav-back');
                    const albumNavName = document.getElementById('current-album-name');
                    
                    let scrollPos = 0;
                    console.log(galleryItems);
                    /* no work
                    //Album View Mobile Mode
                    function mobile(widthCheck) {
                        if (widthCheck.matches) { // If media query matches
                            if (currentView == 1) {
                                console.log(currentView);
                                galleryContainer.style.gridAutoRows = "350px";
                            }
                            else if (currentView == 0) {
                                console.log(currentView);
                                galleryContainer.style.gridAutoRows = "auto";
                            }
                        } else {
                            galleryContainer.style.gridAutoRows = "350px";
                        }
                    }
                    
                    // Create a MediaQueryList object
                    var widthCheck = window.matchMedia("(max-width: 700px)")
                    
                    // Call listener function at run time
                    mobile(widthCheck);
                    
                    // Attach listener function on state changes
                    changeViewButton.addEventListener("click", (e) => {
                        mobile(widthCheck);
                        widthCheck.addEventListener("change", function() {
                            mobile(widthCheck);
                        }); 
                    });
                    //
                    */

                    //Album Hover
                    galleryItems.forEach(hoverItem => {
                        hoverItem.addEventListener('mouseenter', (e) => showOverlay(e));
                        hoverItem.addEventListener('mouseleave', (e) => hideOverlay(e));
                    });

                    function showOverlay(e) {
                        if (e.target.classList.contains('album-thumbnail')) {
                            e.target.lastChild.style.opacity = '.15';
                            e.target.getElementsByTagName('img')[0].style.transform = "scale(1.15)"; //scale background image
                        }
                    }

                    function hideOverlay(e) {
                        if (e.target.classList.contains('album-thumbnail')) {
                            e.target.lastChild.style.opacity = '0';
                            e.target.getElementsByTagName('img')[0].style.transform = "scale(1)";
                        }
                    }
                    // End album hover

                    //Handle Photo Clicks

                    //handle clicking change view button
                    changeViewButton.addEventListener('click', () => {
                        if (currentView == 0) { //if photos view
                            currentView = 1;
                            changeView(currentView);
                        }
                        else if (currentView == 1) { //if albums view
                            currentView = 0;
                            changeView(currentView);
                        }
                    });
                    //

                    //album navigation back button
                    albumNavBackBtn.addEventListener('click', () => albumNavBack())

                    function albumNavBack() {
                        history.back();
                    }
                    //

                    // Handle Clicking On Photo
                    galleryItems.forEach(item => {
                        item.addEventListener('click', function () {
                            if (!this.classList.contains('album-thumbnail')) { //check if album is not clicked on or if photo is clicked on
                                scrollPos = Math.floor(window.scrollY);
                                console.log("Scroll Pos: "+scrollPos);
                                const imageSrc = this.getAttribute('src');
                                const imageId = this.getAttribute('data-image');
                                const imageIndex = this.getAttribute('data-index');
                                console.log("Clicked Image "+imageId+". Current View: "+currentView+" (0 = photos view, 1 = albums view)");
                                openLargeContainer(imageSrc, imageId, imageIndex, currentView);
                                slideButtons(imageSrc, imageId, imageIndex, scrollPos);
                                //
                                if (currentView == 1) { //if in album view, return to album when large image is closed
                                    console.log("Current View: "+currentView+".     Passing Params To getScrollPos");
                                    albumId = getAlbumIdFromImage(imageIndex);
                                    getScrollPos(scrollPos,albumId);
                                }
                                else if (currentView == 0) { //if in photo view, return to all photos gallery when large image is closed
                                    console.log("Current View: "+currentView+".     Passing Params To getScrollPos");
                                    getScrollPos(scrollPos);
                                }
                                //
                            }

                            else { //if album is clicked on
                                let albumId = item.getAttribute('data-album-id');
                                openAlbum(albumId);
                                //getScrollPos(scrollPos,albumId);
                                /*
                                item.style.display = 'none';
                                galleryItems.forEach(photoItem => {
                                    const imageIndex = photoItem.getAttribute('data-index');

                                    //hide all images not in album
                                    if (!photoItem.classList.contains('album-thumbnail')) {
                                        if (item.getAttribute('data-album-name') != photoData[imageIndex].album) {
                                            console.log(photoItem.getAttribute('data-image')+" "+photoData[imageIndex].album);
                                            photoItem.style.display = 'none';
                                        }
                                    }
                                    //

                                    //hide all album thumbnails
                                    else{
                                        photoItem.style.display = 'none';
                                    }
                                    //
                                });*/
                            }
                        });
                    });

                    function openAlbum(albumId, backButton, noPush) {
                        window.scrollTo(0, 0);
                        let item = document.querySelector(`[data-album-id="${albumId}"]`);
                        item.style.display = 'none';
                        albumNav.style.display = 'flex';
                        changeViewButton.style.display = 'none';
                        albumNavName.innerText = item.getAttribute('data-album-name');
                        if (!backButton && !noPush) {
                            history.pushState({albumId: albumId}, null, `/album/${albumId}`);
                        }
                        galleryItems.forEach(photoItem => {
                            const imageIndex = photoItem.getAttribute('data-index');

                            //show and hide correct images
                            if (!photoItem.classList.contains('album-thumbnail')) {
                                if (item.getAttribute('data-album-name') != photoData[imageIndex].album) {
                                    //console.log(photoItem.getAttribute('data-image')+" "+photoData[imageIndex].album);
                                    photoItem.style.display = 'none';
                                }
                                else {
                                    photoItem.style.display = 'block'
                                }
                            }
                            //

                            //hide all album thumbnails
                            else{
                                photoItem.style.display = 'none';
                            }
                            //
                        });
                    }

                    function closeAlbum() {
                        history.pushState(null, null, `/albums`);
                        window.scrollTo(0, 0);
                        albumNav.style.display = 'none';
                        changeViewButton.style.display = 'inline';
                        galleryItems.forEach(galleryItem => {
                            if (galleryItem.classList.contains('album-thumbnail')) { //display albums
                                galleryItem.style.display = 'flex';
                            }

                            else {
                                galleryItem.style.display = 'none'; //hide non albums
                            }
                        });
                    }

                    function changeView(currentView, noPush) {
                        switch (currentView) {
                            case 0: //switch to photo view
                                console.log('photo view');
                                changeViewButton.innerText = 'album view';
                                if (!noPush) {
                                    history.replaceState({currentView: currentView}, null, `/`);
                                }
                                galleryItems.forEach(galleryItem => {
                                    if (galleryItem.classList.contains('album-thumbnail')) {
                                        galleryItem.style.display = 'none';
                                    }

                                    else {
                                        galleryItem.style.display = 'block';
                                    }         
                                });
                                break;
                            case 1: //switch to album view
                                changeViewButton.innerText = 'photo view';
                                galleryItems.forEach(galleryItem => {
                                    if (galleryItem.classList.contains('album-thumbnail')) {
                                        galleryItem.style.display = 'flex';
                                    }

                                    else {
                                        galleryItem.style.display = 'none';
                                    }         
                                });
                                console.log('album view');
                                if (!noPush) {
                                    history.replaceState({currentView: currentView}, null, `/albums`);
                                }
                                break;
                        }
                    }
                    //large container start
                    function openLargeContainer(imageSrc, imageId, imageIndex, currentView) {
                        largeContainer.style.display = 'flex';
                        largeImage.src = imageSrc;
                        if (currentView == 1) {
                            console.log("Changing URL based on album view");
                            history.pushState({imageId: imageId}, null, `/album/view/${imageId}`);
                        }
                        else if (currentView == 0) {
                            console.log("Changing URL based on photo view");
                            history.pushState({imageId: imageId}, null, `/view/${imageId}`);
                        }
                        window.scrollTo(0, 0);
                        document.body.style.overflow = 'hidden';
                        
                        // hides next/previous buttons if first/last image of array is enlarged
                        if (imageIndex == 0) {
                            previous.style.visibility = 'hidden';
                            next.style.visibility = 'visible';
                        }
                        else if (imageIndex == globalIndex) {
                            next.style.visibility = 'hidden';
                            previous.style.visibility = 'visible';
                        }
                        else {
                            next.style.visibility = 'visible';
                            previous.style.visibility = 'visible';
                        }
                        //
                    }

                    function closeLargeContainer(scrollPos, albumOpen) {
                        largeContainer.style.display = 'none';

                        if (albumOpen) {
                            console.log("Album open, returning to index.html/album/"+albumOpen);
                            history.replaceState({albumId: albumOpen}, null, `/album/${albumOpen}`);
                        }
                        else {
                            console.log("Album not open, returning to index.html/");
                            history.replaceState(null, null, '/');
                        }

                        document.body.style.overflow = 'auto';
                        window.scrollTo(0, scrollPos);
                    }

                    function getAlbumIdFromImage(imageIndex) {
                        let albumId = "";
                        photoData.forEach(photo => matchPhoto(photo, imageIndex));
                        function matchPhoto(photo, imageIndex) {
                            if (imageIndex == photo.dataIndex) {
                                albumId = photo.albumId;
                            }
                        }
                        return albumId;
                    }

                    //Stores Scroll Position so it can be restored once full sceen mode is closed
                    //Put all functions that will be used to close full screen mode inside of this function
                    function getScrollPos(scrollPos, albumId) {
                        // Close large view when clicking outside the image
                        console.log('getScrollPos function called.      scrollPos: '+scrollPos+'        albumId:'+albumId);
                        largeContainer.addEventListener('click', (e) => clickOutsideImage(scrollPos, albumId, e));
                        close.addEventListener('click', (e) => closeBtn(scrollPos, albumId, e));

                        function clickOutsideImage(scrollPos, albumId, e) {
                            if (!e.target.closest('#large-image-info-container')) {
                                console.log("Clicked outisde image.     Current Album: "+albumId);
                                closeLargeContainer(scrollPos, albumId);
                            }
                        }

                        function closeBtn(scrollPos, albumId, e) {
                            console.log("Close Button Clicked.      Current Album: "+albumId);
                            closeLargeContainer(scrollPos, albumId);
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


                     // Handle the browser back/forward buttons (this code is trash)
                    window.addEventListener('popstate', function (event) {
                        if (event.state && event.state.imageId) {
                            // If state has an imageId, open the large view with that image
                            const imageElement = document.querySelector(`[data-image="${event.state.imageId}"]`);
                            if (imageElement) {
                                openLargeContainer(imageElement.src, event.state.imageId);
                            }
                        } 
                        else if (event.state && event.state.albumId) {
                            // back button for exiting album view
                            console.log("Back button pressed while in album view")
                            //history.replaceState(null, null, `/albums`); //open albums page first, so when back button is clicked enough times user will return to abum view page
                            //openAlbum(event.state.albumId, 1);
                            closeAlbum();
                        }
                        else if (event.state && event.state.currentView) {
                            // back button for album view
                            if (event.state.currentView == 1) {
                                console.log('back buttton pressed: album');
                                closeAlbum();
                                changeView(1);
                            }
                            else if (event.state.currentView == 0) {
                                console.log('back buttton pressed: photo');
                                changeView(0);
                            }
                        }
                        else {
                            console.log("PushState: none");
                            // If no state or state is null, close the large view
                            closeLargeContainer(scrollPos);
                            closeAlbum();
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

                    else if (currentPath.startsWith('/album/') && !currentPath.startsWith('/album/view/')) { //opens album on refresh
                        console.log('page refreshed and album');
                        const albumId = currentPath.split('/album/')[1];
                        const albumElement = document.querySelector(`[data-album-id="${albumId}"]`);
                        if (albumElement) {
                            //history.replaceState({currentView: 1}, null, `/albums`); //open albums page first, so when back button is clicked enough times user will return to abum view page
                            openAlbum(albumId, null, noPush = 1);
                        }
                    }

                    else if (currentPath.startsWith('/album/view/')) { //opens photo on refresh
                        console.log('page refreshed and album photo view');
                        const imageId = currentPath.split('/album/view/')[1];
                        const imageElement = document.querySelector(`[data-image="${imageId}"]`);
                        let imageIndex = imageElement.getAttribute('data-index');
                        console.log("image element to be opened:"+imageId);
                        if (imageElement) {
                            openLargeContainer(imageElement.src, imageId, imageIndex);
                            slideButtons(imageElement.src, imageId, imageIndex, scrollPos);
                            getScrollPos(scrollPos);
                        }
                    }

                    else if (currentPath == '/albums') {
                        currentView = 1;
                        changeView(currentView);
                    }
                    //
                    else {
                        console.log("loading default view");
                        changeView(1/*, noPush = 1*/); //default view, nopush prevents url from being from being set to default after refresh
                    }
                }
        }
        xhr.send("load=1")
    }
    

    /* When the user clicks on the menu button, 
    toggle between hiding and showing the dropdown content */
    window.onload = function() {
        console.log("JS Script Loaded");
        document.getElementById("loading").style.display="none";
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