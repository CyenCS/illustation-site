class User {
  constructor(name, id) {
      this.name = name;
      this.id = id;
  }

  greet() { //for backend.js
      return `Welcome to the Menu, ${this.name}`;
  }

  static fetchName() {
      const name = localStorage.getItem('username');
      const id = localStorage.getItem('userid');
      console.log("Name & ID:", name, id);
      return new User(name || '', id || '');
  }
}

    // updateprice(newPrice) {
    //   this.price = newPrice;
    // }
    // make(){
    //   return 'Class: The car brand is ' + this.brand+"\n"+"Price: "+this.price+"\n";
    // }
  
//   mycar = new Car("Suzuki",3500);
//   mycar.updateprice(4000);