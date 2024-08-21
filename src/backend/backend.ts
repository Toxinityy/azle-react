import express from 'express';
import { Server, ic, query } from 'azle';
import {
    HttpResponse,
    HttpTransformArgs,
} from 'azle/canisters/management';

export default Server(
    // Server section
    () => {
        const app = express();
        app.use(express.json());

        let posts = {
            'First Post': { 'content': 'This is the content of the first post.', 'added': new Date() }
        };

        app.get('/posts', (_req, res) => {
            res.json(posts);
        });

        app.post('/posts/add', (req, res) => {
            if (Object.keys(posts).includes(req.body.title)) {
                res.json({ error: 'Post with this title already exists' });
            } else {
                const newPost = { [req.body.title]: { content: req.body.content, added: new Date() } };
                posts = { ...posts, ...newPost };
                res.json({ status: 'Post added successfully' });
            }
        });

        app.get('/greet', (req, res) => {
            res.json({ greeting: `Hello, ${req.query.name}` });
        });

        app.post('/swapi', async (req, res) => {
            ic.setOutgoingHttpOptions({
                maxResponseBytes: 20_000n,
                cycles: 500_000_000_000n, // HTTP outcalls cost cycles. Unused cycles are returned.
                transformMethodName: 'transform'
            });

            const id = '1';
            const response = await (await fetch(`https://swapi.dev/api/${req.body.category}/spot?date=${id}`)).json();
            res.json(response);
        });

        app.use(express.static('/dist'));
        return app.listen();
    },
    // Candid section
    {
        // The transformation function for the HTTP outcall responses.
        // Required to reach consensus among different results the nodes might get.
        // Only if they all get the same response, the result is returned, so make sure
        // your HTTP requests are idempotent and don't depend e.g. on the time.
        transform: query([HttpTransformArgs], HttpResponse, (args) => {
            return {
                ...args.response,
                headers: []
            };
        })
    }
);
