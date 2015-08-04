## CAVLIN Network Web App

This is the home of the source code for the [CALVIN network app](http://cwn.casil.ucdavis.edu).

#### Data Repository

The data repo can be found [here](https://github.com/ucd-cws/calvin-network-data)

#### Import data

First make sure you have [NodeJS](https://nodejs.org/) as well as [MongoDB](https://www.mongodb.com/) installed and running
on the default port.  You can download MongoDB [here](https://www.mongodb.org/downloads) or use follow [these](http://docs.mongodb.org/manual/administration/install-on-linux/) instructions for using linux package managers.

Then run:

 ```
git clone https://github.com/ucd-cws/calvin-network-data.git
cd [/path/to/ca-network-app/root/dir]
npm install
node utils/import/regions [/path/to/calvin-network-data/data]
// ex:
// node utils/import/regions /home/jrmerz/dev/calvin-network-data/data
```

#### Repetitive Imports

To simplify the import process you can make a _import.json_ file in the
root of this repo.  It should look like:

```
{
  "path" : "/path/to/your/data/repo/calvin-network-data/data",
}
```

Then you can simply run this command to (re-)import data after you make changes:

```
npm run-script import
```

#### Run Application Locally

To run the application locally, first import the data repo (see above).  Make sure your have [bower](http://bower.io) installed.
```
// if you have not installed bower
npm run-script init-tools
```
Then run the following command once.  It will install all client and server dependencies.  You may need to re-run this script after a _git pull_ where the dependencies list was modified for either client or server.
```
npm run-script init-dev
```
Then to start the application (MongoDB needs to be running):
```
npm start
```

#### Supply Edits to Network Data

If you wish to make changes to the network application data, first fork to calvin-network-data
repo.  To do this go [here](https://github.com/ucd-cws/calvin-network-data) and click 'fork' in the upper right hand corner
(GitHub account required).  Then pull your newly forked repo to your local machine
and import the data using the import steps above.  Make sure you point at your forked repo!
You can then launch and test changes to the data by running the import script whenever
you make a change.  Then use the local application instance to test.  Finally if
you wish to submit changes, push your changes back to github then make a pull request
back to our data repo.
