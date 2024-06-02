const VIEWPORT_LENGTH = 75;
const CIRCLE_RADIUS = 15.5;
const SLANT = 7.25;
const RECTANGLE_WIDTH = 13.5;

const COLOR_SCHEMES = {
  GREEN: {
    CIRCLES: "rgb(4, 194, 0)",
    RECTANGLES: "rgb(255, 121, 60)",
  },
  BLUE: {
    CIRCLES: "#c65dfb",
    RECTANGLES: "#5bb3ff",
  },
};

const COLORS = COLOR_SCHEMES.BLUE;

const createSVG = () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute("width", `${VIEWPORT_LENGTH}`);
  svg.setAttribute("height", `${VIEWPORT_LENGTH}`);
  svg.setAttribute("viewBox", `0 0 ${VIEWPORT_LENGTH} ${VIEWPORT_LENGTH}`);
  svg.setAttribute("version", "1.1");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const CIRCLE_CENTERS = {
    topLeft: {
      x: SLANT + CIRCLE_RADIUS,
      y: CIRCLE_RADIUS,
    },
    topRight: {
      x: VIEWPORT_LENGTH - CIRCLE_RADIUS,
      y: CIRCLE_RADIUS,
    },
    bottomLeft: {
      x: CIRCLE_RADIUS,
      y: VIEWPORT_LENGTH - CIRCLE_RADIUS,
    },
    bottomRight: {
      x: VIEWPORT_LENGTH - SLANT - CIRCLE_RADIUS,
      y: VIEWPORT_LENGTH - CIRCLE_RADIUS,
    },
  };

  const distanceBetweenTopAndBottomCircleCenters = Math.sqrt(
    Math.pow(CIRCLE_CENTERS.topLeft.x - CIRCLE_CENTERS.bottomLeft.x, 2)
    + Math.pow(CIRCLE_CENTERS.topLeft.y - CIRCLE_CENTERS.bottomLeft.y, 2)
  );

  const distanceBetweenTopLeftAndBottomRightCircleCenters = Math.sqrt(
    Math.pow(CIRCLE_CENTERS.topLeft.x - CIRCLE_CENTERS.bottomRight.x, 2)
    + Math.pow(CIRCLE_CENTERS.topLeft.y - CIRCLE_CENTERS.bottomRight.y, 2)
  );

  const middleBetweenTopLeftAndBottomLeftCircleCenters = {
    x: (CIRCLE_CENTERS.topLeft.x + CIRCLE_CENTERS.bottomLeft.x) / 2,
    y: (CIRCLE_CENTERS.topLeft.y + CIRCLE_CENTERS.bottomLeft.y) / 2,
  };

  const middleBetweenTopLeftAndBottomRightCircleCenters = {
    x: (CIRCLE_CENTERS.topLeft.x + CIRCLE_CENTERS.bottomRight.x) / 2,
    y: (CIRCLE_CENTERS.topLeft.y + CIRCLE_CENTERS.bottomRight.y) / 2,
  };

  const middleBetweenTopRightAndBottomRightCircleCenters = {
    x: (CIRCLE_CENTERS.topRight.x + CIRCLE_CENTERS.bottomRight.x) / 2,
    y: (CIRCLE_CENTERS.topRight.y + CIRCLE_CENTERS.bottomRight.y) / 2,
  };

  const rectLeft = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  const rectLeftHeight = distanceBetweenTopAndBottomCircleCenters;
  const rectLeftCenterX = middleBetweenTopLeftAndBottomLeftCircleCenters.x;
  const rectLeftCenterY = middleBetweenTopLeftAndBottomLeftCircleCenters.y;
  const rectLeftX = rectLeftCenterX - RECTANGLE_WIDTH / 2;
  const rectLeftY = rectLeftCenterY - rectLeftHeight / 2;
  const rectLeftAngle = Math.acos(
    (CIRCLE_CENTERS.bottomLeft.y - CIRCLE_CENTERS.topLeft.y) / distanceBetweenTopAndBottomCircleCenters
  ) * 180 / Math.PI;
  rectLeft.setAttribute("style", `fill:${COLORS.RECTANGLES};fill-opacity:1`);
  rectLeft.setAttribute("width", RECTANGLE_WIDTH);
  rectLeft.setAttribute("height", rectLeftHeight);
  rectLeft.setAttribute("x", rectLeftX);
  rectLeft.setAttribute("y", rectLeftY);
  rectLeft.setAttribute("transform", `rotate(${rectLeftAngle})`);
  rectLeft.setAttribute("transform-origin", `${rectLeftCenterX}px ${rectLeftCenterY}px`);
  svg.appendChild(rectLeft);


  const rectMiddle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  const rectMiddleHeight = distanceBetweenTopLeftAndBottomRightCircleCenters;
  const rectMiddleCenterX = middleBetweenTopLeftAndBottomRightCircleCenters.x;
  const rectMiddleCenterY = middleBetweenTopLeftAndBottomRightCircleCenters.y;
  const rectMiddleX = rectMiddleCenterX - RECTANGLE_WIDTH / 2;
  const rectMiddleY = rectMiddleCenterY - rectMiddleHeight / 2;
  const rectMiddleAngle = Math.acos(
    (CIRCLE_CENTERS.topLeft.y - CIRCLE_CENTERS.bottomRight.y) / distanceBetweenTopLeftAndBottomRightCircleCenters
  ) * 180 / Math.PI;
  rectMiddle.setAttribute("style", `fill:${COLORS.RECTANGLES};fill-opacity:1`);
  rectMiddle.setAttribute("width", RECTANGLE_WIDTH);
  rectMiddle.setAttribute("height", distanceBetweenTopLeftAndBottomRightCircleCenters);
  rectMiddle.setAttribute("x", rectMiddleX);
  rectMiddle.setAttribute("y", rectMiddleY);
  rectMiddle.setAttribute("transform", `rotate(${rectMiddleAngle})`);
  rectMiddle.setAttribute("transform-origin", `${rectMiddleCenterX}px ${rectMiddleCenterY}px`);
  svg.appendChild(rectMiddle);


  const rectRight = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  const rectRightHeight = distanceBetweenTopAndBottomCircleCenters;
  const rectRightCenterX = middleBetweenTopRightAndBottomRightCircleCenters.x;
  const rectRightCenterY = middleBetweenTopRightAndBottomRightCircleCenters.y;
  const rectRightX = rectRightCenterX - RECTANGLE_WIDTH / 2;
  const rectRightY = rectRightCenterY - rectRightHeight / 2;
  const rectRightAngle = Math.acos(
    (CIRCLE_CENTERS.bottomRight.y - CIRCLE_CENTERS.topRight.y) / distanceBetweenTopAndBottomCircleCenters
  ) * 180 / Math.PI;
  rectRight.setAttribute("style", `fill:${COLORS.RECTANGLES};fill-opacity:1`);
  rectRight.setAttribute("width", RECTANGLE_WIDTH);
  rectRight.setAttribute("height", rectRightHeight);
  rectRight.setAttribute("x", rectRightX);
  rectRight.setAttribute("y", rectRightY);
  rectRight.setAttribute("transform", `rotate(${rectRightAngle})`);
  rectRight.setAttribute("transform-origin", `${rectRightCenterX}px ${rectRightCenterY}px`);
  svg.appendChild(rectRight);

  const circleTopLeft = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circleTopLeft.setAttribute("style", `fill:${COLORS.CIRCLES};fill-opacity:1`);
  circleTopLeft.setAttribute("r", CIRCLE_RADIUS);
  circleTopLeft.setAttribute("cx", CIRCLE_CENTERS.topLeft.x);
  circleTopLeft.setAttribute("cy", CIRCLE_CENTERS.topLeft.y);
  svg.appendChild(circleTopLeft);

  const circleTopRight = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circleTopRight.setAttribute("style", `fill:${COLORS.CIRCLES};fill-opacity:1`);
  circleTopRight.setAttribute("r", CIRCLE_RADIUS);
  circleTopRight.setAttribute("cx", CIRCLE_CENTERS.topRight.x);
  circleTopRight.setAttribute("cy", CIRCLE_CENTERS.topRight.y);
  svg.appendChild(circleTopRight);

  const circleBottomLeft = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circleBottomLeft.setAttribute("style", `fill:${COLORS.CIRCLES};fill-opacity:1`);
  circleBottomLeft.setAttribute("r", CIRCLE_RADIUS);
  circleBottomLeft.setAttribute("cx", CIRCLE_CENTERS.bottomLeft.x);
  circleBottomLeft.setAttribute("cy", CIRCLE_CENTERS.bottomLeft.y);
  svg.appendChild(circleBottomLeft);

  const circleBottomRight = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circleBottomRight.setAttribute("style", `fill:${COLORS.CIRCLES};fill-opacity:1`);
  circleBottomRight.setAttribute("r", CIRCLE_RADIUS);
  circleBottomRight.setAttribute("cx", CIRCLE_CENTERS.bottomRight.x);
  circleBottomRight.setAttribute("cy", CIRCLE_CENTERS.bottomRight.y);
  svg.appendChild(circleBottomRight);

  return svg;
};

const svgLarge = createSVG();
svgLarge.style.width = `400px`;
svgLarge.style.height = `400px`;
svgLarge.style.display = `block`;
svgLarge.style.backgroundColor = `antiquewhite`;
document.body.appendChild(svgLarge);

console.log(svgLarge.outerHTML);

const svgSmall = createSVG();
svgSmall.style.width = `50px`;
svgSmall.style.height = `50px`;
svgSmall.style.display = `block`;
document.body.appendChild(svgSmall);

const svgMini = createSVG();
svgMini.style.width = `16px`;
svgMini.style.height = `16px`;
svgMini.style.display = `block`;
document.body.appendChild(svgMini);