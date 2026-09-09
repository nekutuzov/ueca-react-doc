import { createRoot } from "react-dom/client";
import * as UECA from "ueca-react";
import { ErrorFallback } from "@components";

function runApplication(AppView: () => UECA.ReactElement, rootElementId: string, onExcept?: UECA.ErrorHandler) {
    try {
        UECA.globalSettings.errorHandler = onExcept;
        const root = createRoot(document.getElementById(rootElementId));
        root.render(
            // React.StrictMode is supported as of ueca-react 3.0 (its double-invoked renders no longer
            // inflate the mount count, so unmount/deinit still run). It stays off here because UECA
            // abstracts React away from the developer, so it buys this application nothing.
            <ErrorFallback onError={(error, info) => {
                console.error("React Error Boundary caught an error:", error, info);
                onExcept?.(error);
            }}>
                <AppView />
            </ErrorFallback>
        );
    } catch (e) {
        displayCrashError((e as Error).message, rootElementId);
    }
}

function displayCrashError(error: string, rootElementId: string) {
    const root = document.getElementById(rootElementId);
    if (!root) {
        console.error(`The root element with ID "${rootElementId}" was not found.`);
        console.error("The application has crashed. Please try refreshing the page.");
        console.error(`Error: ${error}`);
        window.alert("The application has crashed. Please check the console log for details.");
        return;
    }
    const errorContainer = document.createElement("div");
    errorContainer.style.display = "flex";
    errorContainer.style.flexDirection = "column";

    _addText("The application has crashed. Please try refreshing the page.");
    _addText(`Error: ${error}`);

    root.appendChild(errorContainer);

    function _addText(text: string) {
        const span = document.createElement("span");
        span.appendChild(document.createTextNode(text));
        errorContainer.appendChild(span);
    }
}

export { runApplication, displayCrashError }
