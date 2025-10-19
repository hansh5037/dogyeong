module.exports = function(eleventyConfig) {
	// 정적 복사 (CSS/이미지/비디오만)
	eleventyConfig.addPassthroughCopy({ "src/css": "css" });
	eleventyConfig.addPassthroughCopy({ "src/images": "images" });
	eleventyConfig.addPassthroughCopy({ "src/videos": "video" }); // src/videos → /video

	// 변경 감지
	eleventyConfig.addWatchTarget("src/scss");
	eleventyConfig.addWatchTarget("src/css");
	eleventyConfig.addWatchTarget("src/images");
	eleventyConfig.addWatchTarget("src/videos");

	return {
		dir: {
			input: "src",
			includes: "html",
			output: "dist"
		},
		templateFormats: ["html", "njk", "md"],
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk"
	};
};
