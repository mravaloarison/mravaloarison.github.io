gsap.from(
    "#fromBottom",
    {
        duration: 2,
        opacity: 0,
        y: 150,
        ease: "back",
    }
)

gsap.from(
    "#fromTop",
    {
        duration: 2,
        opacity: 0,
        y: -150,
        ease: "back",
    }
)

gsap.from(
    "#fromCenter",
    {
        duration: 2,
        opacity: 0,
        scale: .5,
        ease: "back",
    }
)