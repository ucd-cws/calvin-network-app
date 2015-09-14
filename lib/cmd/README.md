## Command Line Tool

/lib/cmd let's you interact with the app's models.  You have access to all models and their functions.

#### Commands

Print all available models and functions.  Ignore the callback parameter, it's not required.
```
node lib/cmd --help
```

Run model function.
```
node lib/cmd [-m | --model] [model_name] [-f | --function] [function_name] parameters
```

Any parameter that 'looks like' JSON will be parsed as such.
