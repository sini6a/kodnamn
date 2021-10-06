# Kodnamn (Codename)

![Screenshot #6](/screenshots/6.png?raw=true "Screenshot #6")

Codename is project written in **JavaScript** *Express JS* web application framework using *Pug* template engine.

This project helps users log and save code name with additional information such as customer and agent connected to it and terminals associated nick names.


## Installation

Clone this repository and change working directory.
```bash
git clone https://github.com/sini6a/kodnamn && cd kodnamn
```

Install *Kodnamn* dependencies.
```bash
npm install
```

Copy env.example to .env and modify it according to your *MongoDB* credentials.
```bash
cp env.example .env
```


## .env

Modify .env with your credentials.
```bash
MONGODB_URI="" # MongoDB Connection URI
MONGODB_PASS="" # MongoDB Database Password
SESSION_SECRET="" # Random Session String
```

## Usage

After editing environment variables start the application using npm start script.
```bash
npm start
```

Navigate your browser to following address.
```url
http://localhost:3000/
```

## Screenshots

![Screenshot #1](/screenshots/1.png?raw=true "Screenshot #1")

![Screenshot #2](/screenshots/2.png?raw=true "Screenshot #2")

![Screenshot #3](/screenshots/3.png?raw=true "Screenshot #3")

![Screenshot #4](/screenshots/4.png?raw=true "Screenshot #4")

![Screenshot #5](/screenshots/5.png?raw=true "Screenshot #5")

![Screenshot #7](/screenshots/7.png?raw=true "Screenshot #7")

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)