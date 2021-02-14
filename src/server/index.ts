import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import { createExpressServer } from "routing-controllers";
import { Controller } from "./controller";
import { resolve } from "path";

const app = createExpressServer({
    controllers: [Controller],
});

const port = 5000;

const corsOptions: any = {
    optionSuccessStatus: 200
};

const staticPath = `${__dirname}/../../public`

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": false}));
app.use(express.static(staticPath));

app.get(/^\/(?!api).*$/, (_: any, response: any) => {
    response.sendFile(resolve(staticPath, 'index.html'));
});

app.listen(port, () =>
    console.log(`Server running on http://localhost:${port}`)
)