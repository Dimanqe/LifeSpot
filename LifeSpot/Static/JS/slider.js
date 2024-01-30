document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".carousel");
    const firstImg = carousel.querySelectorAll("img")[0];
    let isDragStart = false, isClick = false, prevPageX, prevScrollLeft, positionDiff;
    let scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    let buttons = document.querySelectorAll(".wrapper button");
    let currentIndex = 0;

    const showHideButtons = () => {
        buttons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
        buttons[1].style.display = carousel.scrollLeft == scrollWidth ? "none" : "block";
        console.log(carousel.scrollLeft);
    };

    buttons.forEach(button => {
        button.addEventListener("mousedown", (e) => {
            // Reset isClick to true when the button is clicked
            isClick = true;
            dragStop(e);
            let firstImageWidth = firstImg.clientWidth;
            if (button.id == "left") {
                carousel.scrollLeft -= firstImageWidth;
            } else {
                carousel.scrollLeft += firstImageWidth;
            }
            setTimeout(() => showHideButtons(), 60);
        });

        // Add a mouseover event listener to prevent sliding when hovering over buttons
        button.addEventListener("mouseover", () => {
            isClick = false; // Set isClick to false when hovering over the buttons
        });
    });

    // Add a mouseout event listener to prevent sliding when the mouse leaves the carousel
    carousel.addEventListener("mouseout", (e) => {
        if (isDragStart || isClick) {
            e.preventDefault();
        }
        isClick = false;
    });

    const autoSlide = () => {
        let firstImgWidth = firstImg.clientWidth;
        currentIndex = Math.round(carousel.scrollLeft / firstImgWidth);

        if (carousel.scrollLeft > prevScrollLeft) {
            currentIndex += 1;
        } else {
            currentIndex -= 1;
        }

        currentIndex = Math.max(0, Math.min(currentIndex, Math.floor(scrollWidth / firstImgWidth)));

        let targetScrollLeft = currentIndex * firstImgWidth;

        carousel.scrollLeft = targetScrollLeft;

        showHideButtons();
        updateIndicators();
    };

    const dragStart = (e) => {
        isDragStart = true;
        isClick = true;
        prevPageX = e.pageX;
        prevScrollLeft = carousel.scrollLeft;
    };

    const dragStop = (e) => {
        isDragStart = false;
        carousel.classList.remove("dragging");

        if (isClick || e.type === "mouseout") {
            e.preventDefault();
        } else {
            autoSlide();
        }
    };

    const dragging = (e) => {
        if (!isDragStart) return;
        e.preventDefault();
        isClick = false;
        carousel.classList.add("dragging");
        positionDiff = e.pageX - prevPageX;
        carousel.scrollLeft = prevScrollLeft - positionDiff;
        showHideButtons();
    };

    const updateIndicators = () => {
        const indicators = document.querySelectorAll(".carousel-indicator");
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle("active", index === currentIndex);
        });
    };

    carousel.addEventListener("mousedown", (e) => dragStart(e));
    carousel.addEventListener("mousemove", (e) => dragging(e));
    carousel.addEventListener("mouseup", (e) => dragStop(e));
    carousel.addEventListener("mouseleave", (e) => dragStop(e));

    const indicatorsContainer = document.createElement("div");
    indicatorsContainer.classList.add("carousel-indicators");
    document.querySelector(".wrapper").appendChild(indicatorsContainer);

    for (let i = 0; i < carousel.childElementCount; i++) {
        const indicator = document.createElement("div");
        indicator.classList.add("carousel-indicator");
        indicatorsContainer.appendChild(indicator);
    }

    showHideButtons();
    updateIndicators();
});
