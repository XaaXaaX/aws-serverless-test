import * as restify from 'restify';
import * as axios from "axios";
import * as ngrok from "ngrok";

const respond = (onConfirmation: any, onMessage: any) => (req: restify.Request, res: restify.Response, next: restify.Next) => {
	const body = JSON.parse(req.body);
	
	if (res) console.log("res");

	if (body.Type === "SubscriptionConfirmation") {
		axios.default.get(body.SubscribeURL).then(() => {
			onConfirmation()
			next()
		})
	} else {
		onMessage(body.Message)
		next()
	}
}

const start = async (onConfirmation: any, onMessage: any) => {
	const port = 8000 + Math.ceil(Math.random() * 1000);
	let url: string;
	let server: restify.Server;
	await ngrok.connect(port).then((value) => {

		url = value;
		server = restify.createServer();
		
		server.post("/", respond(onConfirmation, onMessage));
	
		server.use(restify.plugins.bodyParser());

		server.listen(port);

	}).catch((err) => console.log(err));
	
	return {
		url,
		stop: async () => {
			server.close();
			await ngrok.kill();
		}
	}
}

export { start }
