class User {
  constructor(id, username, email, password) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  getJson() {
    return {
      id: this.user,
      userName: this.username,
      email: this.email,
      password: this.password,
    };
  }
}

export default User;
