
exports.debug = true;
exports.node = 'node';

exports.dev = true;

var root = '/Users/jrmerz/dev/watershed/ca-water-network';

exports.db = {
	//initd           : "mongod --port 27017",

	// connection string for the database, includes database name
	url             : "mongodb://localhost:27017/calvin",

	// collection where the queryable items are stored
	mainCollection  : "network",
	regionCollection : "regions",


  indexedFilters : ['properties.type', 'properties.regions'],

  // currently MQE only allows one sort option, place the attribute you wish to sort on here
  sortBy            : 'properties.prmname',

  // currently Mongo only allows the creation of text search on one attribute.  MQE will
  // combine all filters listed below into a single attribute that will be used for
  // the text search index
  textIndexes       : ['properties.type','properties.description', 'properties.prmname', 'properties.origin',
                      'properties.terminus'],

  searchWhitelist : ['_id', 'type', 'properties']
}

exports.server = {
	host : "localhost",

	// port outside world goes to.  most likely 80
	remoteport : 80,

	// local port on machine
	localport : 3003,

	// remote hosts that are allowed to access this sites mqe
	allowedDomains : [],

	script : root+"/server"
}
