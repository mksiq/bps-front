class Transaction {
  constructor(photoId) {
    this.photo = photoId;
  }

  getJson() {
    return {
      photo: {id: this.photo},
    };
  }
}

export default Transaction;
