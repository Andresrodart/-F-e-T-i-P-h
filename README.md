# FETIPH
FTP server administrator. Based on [ftp-srv](https://github.com/trs/ftp-srv/) by trs.
## Getting Started


### Prerequisites
At this moment FETIPH works only with [MongoDB](https://www.mongodb.com/download-center/community) as its DB. I am planning to finish the implementation to work in a standalone mode on the future. We will need a DB, for example `FETIPH`. On mongo shell you can type 

```bash
 use FETIPH
```

### Installing
Clone and download dependencies via :
```bash
git clone https://github.com/Andresrodart/Fetiph.git
npm i
```
To start use npm command:
```bash
npm start
```
The FTP server will be running at ```[ftp://localhost:5050]``` by default.By default the administration page will be running on ```[localhost:3000](localhost:3000)```. The first time it will ask you to crete an admin account. After that you will be redirected to the work area as I call the admin page. Once there you will need to go to users label and add a User so he can use the FTP server:

![USER REGISTRATION EXAMPLE](https://raw.githubusercontent.com/Andresrodart/Fetiph/master/src/public/images/IMAGE_1.png)

Open the **conf.json** and add your main folder. **NOTE:** Inside this folder all rooms (user root folder) should exist already. 
```JSON
{
...
"main_folder":	<your_absolute_path_folder>,
...
}
```
Use the the init_resources command to upload the resources to mongo. Each resource contains a field _cantAccess_ which is use to avoid a user to even see the file. It can contain a string with an IP or user name:
```bash
npm run init_resources
```
## Configuration
There are a few things we can configure via the **conf.json** file:
*   db: Use define the database. By default is `"monogo"` and it's the only one by the moment
*   main_folder: The absolute path to the folder where FTP resources are stored. E.g. `"/DB"`
*   ftp_conf: Options for the FTP server. Is an object as decribe in [ftp-srv](https://github.com/trs/ftp-srv/)
*   mongo_conf: This object contains mongo settings. It contains the fields:
    *   mongo_uri: The URI to which FETIPH will connect to mongo. By default is	`"mongodb://localhost:27017"`
    *   mongo_db: the name of the database in mongo. By default `"FETIPH"`
*   http_admin_tool: This object define the HTTP server settings. It contains the fields:
    *   secret:	 The session secret. E.g. `"session secret"`
    *   host: The domain name of the server. By default `"localhost"`
    *   port: The port from where we request the web service. By default `3000`

End with an example of getting some data out of the system or using it for a little demo

## Built With

* [ftp-srv](https://github.com/trs/ftp-srv/) - The FTP server
* [ExpressJs](https://expressjs.com/) - The web server framework
* [Bulma.io](https://bulma.io/) - CSS framework

## Authors

* **[Andrés Rodarte L.](https://twitter.com/WYHN_)**
