function splitImage(imageUrl) {
    // Create a new image object
    const image = new Image();
    image.src = imageUrl;

    // Wait for the image to load
    image.onload = function () {
        // Create a canvas element to draw the image on
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Split the image into 9 equal segments
        const segmentWidth = Math.floor(canvas.width / 3);
        const segmentHeight = Math.floor(canvas.height / 3);
        const segments = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const x = j * segmentWidth;
                const y = i * segmentHeight;
                const imageData = ctx.getImageData(x, y, segmentWidth, segmentHeight);
                segments.push(imageData);
            }
        }

        // Calculate the dominant color of each segment
        const dominantColors = [];
        const kmeans = new KMeans();
        for (let i = 0; i < segments.length; i++) {
            const pixels = segments[i].data;
            const colors = kmeans.getDominantColors(pixels, 1);
            dominantColors.push(colors[0]);
        }

        // Log the dominant color of each segment
        console.log(dominantColors);
    };
}