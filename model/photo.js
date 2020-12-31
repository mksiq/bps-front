class Photo {
  constructor(id, title, userId, price, tagsString) {
    this.id = id;
    this.filename = "";
    this.width = 0;
    this.height = 0;
    this.downloads = 0;
    this.title = title;
    this.user = { id: userId };
    //console.log(tagsString);

    const tags = tagsString.split(/[ ,\.#]/);
    console.log(tags)
    this.tags = [];
    tags.forEach(tag => this.tags.push({ tag: tag }));
  }

  getJson() {
    return {
      filename: this.filename,
      width: this.width,
      height: this.height,
      download: this.downloads,
      title: this.title,
      user: this.user,
      tags: this.tags
    };
  }
}
export default Photo;

// getJson() {
//   return JSON.stringify(
//     {
//     id: this.id,
//     filename: this.id,
//     width: this.width,
//     height: this.height,
//     download: this.downloads,
//     title: this.title,
//     userId: this.user,
//     tags: this.tags
//   });
// }