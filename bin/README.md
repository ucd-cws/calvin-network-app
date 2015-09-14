Simple wrapper for:
```
node lib/cmd *
```

## Functions

#### Edit Node Location
Edit location point geometry of a node.

- Path: full path to data repo or '.'  If '.' is used the script will assume the data repo and the app repo share the same parent folder.
- Prmname: name of the node you wish to edit
- lnglat: Longitute and latitude of new point.
- reverse: if you are suppling the new point as latitude,longitute pass this flag as true and the script will reverse.


```
./cwn -m node -f editLocation [path] [prmname] [lnglat] [reverse]

./cwn -m node -f editLocation . C87 38.581517,-121.708689 true
```
