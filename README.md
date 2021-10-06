# Kodnamn (Codename)

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


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
