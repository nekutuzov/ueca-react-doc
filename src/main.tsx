import * as UECA from "ueca-react";
import { AbortExecutionException, Application, appMessageBus, runApplication } from "@core";
// Order matters: scales, then per-theme colour, then the rules that consume both.
import "./tokens.css";
import "./themes.css";
import "./theme.css";

// Enable detailed UECA trace logging as needed
UECA.globalSettings.traceLog = false;

// Application starting point
runApplication(
    () => <Application id={"app"} applicationName={"UECA React Documentation"} appVersion={"1.0.0"} />,
    "root",
    (e) => {
        if (e && !(e instanceof AbortExecutionException)) {
            appMessageBus.unicast("App.UnhandledException", e);
        }
    }
);
