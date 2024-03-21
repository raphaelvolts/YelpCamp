const allCampgrounds = rawCampData;
console.log(allCampgrounds);
/* window.addEventListener("load", (e) => { */
const pageinate = document.getElementById("pageinate");
console.dir(pageinate);
let i = 0;
let j = 50;

const classes = [
  "card",
  "mb-3",
  "row",
  "col-md-4",
  "img-fluid",
  "rounded-start",
  "col-md-8",
  "card-body",
  "card-title",
  "card-text",
  "btn",
  "btn-primary"
];
const defImgSrc =
  "https://res.cloudinary.com/dei8hlvch/image/upload/v1709305979/YelpCamp/scott-goodwill-y8Ngwq34_Ak-unsplash_zjtekb.jpg";

/* const onClick = function (e) {
  e.preventDefault();
  let pageNum = pageTab.getAttribute("id");
  i = parseInt(pageNum.replace("p", "0"));
  while (pageinate.firstChild) {
    pageinate.removeChild(pageinate.firstChild);
  }
  return;
}; */

const pageTabs = document.getElementsByClassName("pageN");
console.log(pageTabs);
for (let pageTab of pageTabs) {
  pageTab.addEventListener("click", (e) => {
    e.preventDefault();
    let page = pageTab.getAttribute("id");
    let pageNum = parseInt(page.replace("p", "0"));
    let x = 0;
    let y = 50;
    while (pageinate.firstChild) {
      pageinate.removeChild(pageinate.firstChild);
    }
    console.log(pageNum);
    y = y * pageNum;
    console.log(y);
    x = y - 50;
    console.log(x);
    while (x < y) {
      makeDispCards(x);
      x++;
    }
  });
  console.log(`Listening for events on ${pageTab}`);
}

if (i > 1) {
  j = j * i;
  i = j - 50;
  console.log(i, j);
}

const makeDispCards = function (n) {
  let div1 = document.createElement("div");
  let div2 = document.createElement("div");
  let div2_1 = document.createElement("div");
  let imgO = document.createElement("img");
  let div2_2 = document.createElement("div");
  let div3 = document.createElement("div");
  let h5 = document.createElement("h5");
  let p1 = document.createElement("p");
  let p2 = document.createElement("p");
  let small = document.createElement("small");
  let anchor = document.createElement("a");

  pageinate.append(div1);
  div1.setAttribute("class", classes[0]);
  div1.classList.add(classes[1]);
  div1.append(div2);
  div2.setAttribute("class", classes[2]);
  div2.append(div2_1);
  div2_1.setAttribute("class", classes[3]);
  div2_1.append(imgO);
  imgO.setAttribute("class", classes[4]);
  imgO.classList.add(classes[5]);
  if (allCampgrounds[n].images.length) {
    imgO.setAttribute("src", allCampgrounds[n].images[0].url);
    imgO.setAttribute("crossorigin", "anonymous");
  } else {
    imgO.setAttribute("src", defImgSrc);
    imgO.setAttribute("crossorigin", "anonymous");
  }
  div2.append(div2_2);
  div2_2.setAttribute("class", classes[6]);
  div2_2.append(div3);
  div3.setAttribute("class", classes[7]);
  div3.append(h5);
  h5.setAttribute("class", classes[8]);
  h5.append(allCampgrounds[n].title);
  div3.append(p1);
  p1.setAttribute("class", classes[9]);
  p1.append(allCampgrounds[n].description);
  div3.append(p2);
  p2.setAttribute("class", classes[9]);
  p2.append(small);
  small.setAttribute("class", "text-secondary");
  small.append(allCampgrounds[n].location);
  div3.append(anchor);
  anchor.setAttribute("href", `/campgrounds/${allCampgrounds[n]._id}`);
  anchor.setAttribute("class", classes[10]);
  anchor.classList.add(classes[11]);
  anchor.append("View Campground");
};

while (i < j) {
  makeDispCards(i);
  i++;
}
/* }); */
