const video = document.getElementById("camera");
const startButton = document.getElementById("startCamera");
const takeButton = document.getElementById("takePhoto");
const canvas = document.getElementById("photo");
const countdown = document.getElementById("countdown");
const photoCounter = document.getElementById("photoCounter");
const context = canvas.getContext("2d");
const photoStrip = document.getElementById("photoStrip");
const stripContext = photoStrip.getContext("2d");
const downloadButton = document.getElementById("downloadPhoto");
const stripColor = document.getElementById("stripColor");
const filterSelect = document.getElementById("filter");
const photoCount = document.getElementById("photoCount");
const retakeButton = document.getElementById("retakePhoto");


photoCount.addEventListener("change", () => {
    totalPhotos = Number(photoCount.value);
});

stripColor.addEventListener("input", () => {
    if (photos.length > 0) {
        createPhotoStrip();
    }
});

let photoNumber = 0;
let totalPhotos = 3;
let photos = [];


startButton.addEventListener("click", async () => {

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        video.srcObject = stream;

    } catch (error) {

        console.error(error);
        alert("Camera access was denied.");

    }

});


takeButton.addEventListener("click", startPhotobooth);


function startPhotobooth() {

    photoNumber = 0;
    photos = [];
    takeButton.disabled = true;

    takeNextPhoto();

}

function takeNextPhoto() {

    photoNumber++;

    photoCounter.textContent =
        `Photo ${photoNumber} of ${totalPhotos}`;

    let count = 3;

    countdown.textContent = count;


    const timer = setInterval(() => {

        count--;


        if (count > 0) {

            countdown.textContent = count;

        } else {

            clearInterval(timer);

            countdown.textContent = "SNAP!";


       
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            context.translate(canvas.width, 0);
            context.scale(-1, 1);

            context.filter = getFilter();

            context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );
            context.filter = "none";
                context.restore();
                
            const photo = canvas.toDataURL("image/png");
             photos.push(photo);
           
            if (photoNumber < totalPhotos) {

                setTimeout(() => {

                    countdown.textContent = "";

                    takeNextPhoto();

                }, 1500);


            } else {

               
                setTimeout(() => {

                    countdown.textContent = "";
                    photoCounter.textContent = "Done!";
                    createPhotoStrip();

                    takeButton.disabled = false;

                }, 1000);

            }

        }

    }, 1000);

}
function createPhotoStrip() {

    const width = 640;
    const height = 480;

    const spacing = 20;

    photoStrip.width = width;
    photoStrip.height =
        (height * totalPhotos) +
        (spacing * (totalPhotos + 1));

    stripContext.fillStyle = stripColor.value;

stripContext.fillRect(
    0,
    0,
    photoStrip.width,
    photoStrip.height
);


    photos.forEach((photo, index) => {

        const image = new Image();

        image.onload = () => {

            const y =
                spacing +
                (index * (height + spacing));

            stripContext.drawImage(
                image,
                spacing,
                y,
                width - (spacing * 2),
                height
            );

        };

        image.src = photo;

    });

}
    downloadButton.addEventListener("click", () => {

    const link = document.createElement("a");

    link.download = "my-photobooth.png";

    link.href = photoStrip.toDataURL("image/png");

    link.click();

});

    const bgColor = document.getElementById("bgColor");

    bgColor.addEventListener("input", () => {
    document.body.style.backgroundColor = bgColor.value;
});

function getFilter() {

    switch (filterSelect.value) {

        case "grayscale":
            return "grayscale(100%)";

        case "sepia":
            return "sepia(100%)";

        case "brightness":
            return "brightness(130%)";

        default:
            return "none";
    }
}
retakeButton.addEventListener("click", () => {

    // Clear previous photos
    photos = [];
    photoNumber = 0;

    // Clear latest photo
    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Clear photo strip
    stripContext.clearRect(
        0,
        0,
        photoStrip.width,
        photoStrip.height
    );

    // Reset text
    photoCounter.textContent = "";
    countdown.textContent = "";

    // Start taking photos again
    takeButton.disabled = true;

    takeNextPhoto();

});