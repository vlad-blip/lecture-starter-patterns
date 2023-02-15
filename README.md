# BSA patterns practices and principles homework starter

## Info

- This project saves data in memory so you don't need any database
- This project uses [NPM Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)

## Requirements

- NodeJS (16.x.x)
- NPM (8.x.x)

## Start the application

1. Install dependencies

```
npm i
```

2. Configure git hooks (Used to run prettier and linter on commits)

```
npx simple-git-hooks
```

3. Start backend

```
npm start -w server
```

4. Start client

```
npm run dev -w client
```
