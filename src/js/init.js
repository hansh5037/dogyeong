import { initKV } from "./kv.js";       // 파일명 정확히!
import { initCarousel } from "./carousel.js";
window.addEventListener("DOMContentLoaded", () => {
	initKV();
	initCarousel();
});
