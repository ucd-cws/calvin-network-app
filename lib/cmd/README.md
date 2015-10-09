## Command Line Tool

/lib/cmd let's you interact with the app's models.  You have access to all models and their functions.

#### Overview

Print all available models and functions.  Ignore the callback parameter, it's not required.
```
node lib/cmd --help
```

Run model function.
```
node lib/cmd [-m | --model] [model_name] [-f | --function] [function_name] parameters
```

Any parameter that 'looks like' JSON will be parsed as such.

## Functions

#### Edit Node Location
Edit location point geometry of a node.

- Path: full path to data repo or '.'  If '.' is used the script will assume the data repo and the app repo share the same parent folder.
- Prmname: name of the node you wish to edit
- lnglat: Longitute and latitude of new point.
- reverse: if you are suppling the new point as latitude,longitute pass this flag as true and the script will reverse.


```
node lib/cmd -m node -f editLocation [path] [prmname] [lnglat] [reverse]

// ex:
node lib/cmd -m node -f editLocation . C87 38.581517,-121.708689 true
```

#### Edit Node Properties
Edit location point geometry of a node.

- Path: full path to data repo or '.'  If '.' is used the script will assume the data repo and the app repo share the same parent folder.
- Prmname: name of the node you wish to edit
- properties: JSON object containing properties you wish to update


```
node lib/cmd -m node -f editLocation [path] [prmname] [properties]

// ex:
node lib/cmd -m node -f editLocation . C87 "{description: 'my new update'}"
```

#### Dump Node Locations
Dump csv of all node prmnames, path and location.  This function reads from database not a data
repository on the filesystem.

```
node lib/cmd -m network -f dumpLocation
```

#### Aggregate
Aggregate data for Regions or Region Links.

Type Options:
 - flow
 - inflows
 - sink

```
node lib/cmd -m regions -f aggregate [type] [region/origin prmname] [terminal prmname]
```

The terminal parameter is for Region Links only.  The region parameter is origin.
One or both of the origin/terminal must be a Region.
