# USU 4610 Reptile Husbandry
This project serves as a backend to a reptile husbandry project.

## Get Started
### Clone the repo
```bash
git clone git@github.com:calvintb/Reptile-Husbandry.git
```
Once cloned you can delete the `.git` folder and reinitialize with your own repo

```bash
rm -rf .git
git init
```
The create your remote repository and commit and push to it.

### Install the dependencies

With yarn
```bash
yarn
```

With npm
```bash
npm install
```

## Development
### .env
Copy the contents of `.env.example` into a new file called `.env`.

### Database
Create the database by running
```bash
yarn db:migrate
```
You will need the re-run this command anytime you make changes to the schema file.

### Running thhe server
Start the server by running:

With yarn
```bash
yarn dev
```

With npm
```bash
npm run dev
```

## Production
Build the project by running

With yarn
```bash
yarn build
```

With npm
```bash
npm run build
```
