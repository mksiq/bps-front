/* eslint-disable valid-jsdoc */
/**
 Photo prototype
 matches:
  private Integer id;
  private String fileName;
  private Integer width;
  private Integer height;
  private Double price;
  private LocalDate date;
  private String title;
  private Integer downloads;
  private Set<Tag> tags = new HashSet<>();
  private User user;
 **/
class Photo {
  constructor(id, title, userId, price, tagsString) {
    this.id = id;
    this.filename = '';
    this.width = 0;
    this.height = 0;
    this.price = parseFloat(price);
    this.downloads = 0;
    this.title = title;
    this.user = {id: userId};
    // creates an array tags object out of a string
    const tags = tagsString.split(/[ ,\.#]/);
    this.tags = [];
    tags.forEach((tag) => this.tags.push({tag: tag}));
  }

  /** returns json of this object */
  getJson() {
    return {
      filename: this.filename,
      width: this.width,
      height: this.height,
      download: this.downloads,
      title: this.title,
      user: this.user,
      tags: this.tags,
      price: this.price,
    };
  }
}

export default Photo;
