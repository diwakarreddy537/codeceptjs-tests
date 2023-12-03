# codeceptjs-tests
Codeceptjs Test Automation

## Getting Started

   ```bash
   git clone https://github.com/diwakarreddy537/codeceptjs-tests.git
   cd codeceptjs-tests
   ```

## To run the project in locally

   ```bash
   npm install
   npx playwright install 
   npm run test
   # To run as headless browser 
   HEADLESS=true npm run test
   ```


## To run the project in docker

   ```bash
   docker compose up -d
   npm run test:docker
   ```

## How to run by make file

   ```bash
   make install
   npm run test:docker
   make test
   ```