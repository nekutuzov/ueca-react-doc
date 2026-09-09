import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser"

const apiBaseUrl = "http://localhost:8080/api"

const handlers = [
    // Add your mock API handlers here
    http.get(`${apiBaseUrl}/hello`, async () => {
        return HttpResponse.json({ message: "Hello from MSW!" });
    }),
];

export async function initMocks() {
    // Await this before the application starts: a screen that fetches during startup would otherwise
    // issue its request before the worker intercepts it, and reach the dev server as a 404.
    // Registration failing must not stop the app booting - the caller runs before
    // globalSettings.errorHandler is installed, so nothing else would catch a throw here.
    try {
        const worker = setupWorker(...handlers);
        await worker.start({
            serviceWorker: {
                url: "/ueca-react-doc/mockServiceWorker.js",
            },
            onUnhandledRequest: "bypass",
        });
    } catch (error) {
        console.error("MSW worker failed to start. API requests will not be mocked.", error);
    }
}

export { apiBaseUrl };
