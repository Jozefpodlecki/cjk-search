import * as bodyParser from "body-parser";
import { createExpressServer } from 'routing-controllers';
import { Controller } from './Controller';

const app = createExpressServer({
  controllers: [Controller],
});

const port = 5000;

const corsOptions: any = {
  optionSuccessStatus: 200
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": false}));
//app.use(express.static(__dirname + "/public"));