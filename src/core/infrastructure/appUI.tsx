import * as UECA from "ueca-react";
import { ErrorFallback, Col, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import {
    AbortExecutionException, AppBusyDisplayModel, useAppBusyDisplay, AppDialogManagerModel, useAppDialogManager,
    AppAlertManagerModel, useAppAlertManager, AppRouter
} from "@core";

type AppUIStruct = UIBaseStruct<{
    children: {
        busyDisplay: AppBusyDisplayModel;
        dialogManager: AppDialogManagerModel;
        alertManager: AppAlertManagerModel;
    };

    methods: {
        appView: () => UECA.ReactElement;
    };
}>;

type AppUIParams = UIBaseParams<AppUIStruct>;
type AppUIModel = UIBaseModel<AppUIStruct>;

function useAppUI(params?: AppUIParams): AppUIModel {
    const struct: AppUIStruct = {
        props: {
            id: useAppUI.name,
        },

        children: {
            dialogManager: useAppDialogManager(),
            alertManager: useAppAlertManager(),
            busyDisplay: useAppBusyDisplay()            
        },

        messages: {
            "App.UnhandledException": async (error) => {
                _processUnhandledException(error, true);
            }            
        },

        methods: {
            appView: () => <AppRouter id={"router"} />
        },

        View: () =>
            <ErrorFallback onError={(e) => { console.error("AppUI ErrorFallback:", e) }}>
                <Col id={model.htmlId()} fill height="100vh">
                    <ErrorFallback onError={(e) => { _processReactException(e) }}>
                        <model.appView />
                    </ErrorFallback>
                    <model.busyDisplay.View />
                    <model.dialogManager.View />
                    <model.alertManager.View />
                </Col>
            </ErrorFallback>
    };

    const model = useUIBase(struct, params);
    return model;

    // Private methods
    function _processUnhandledException(error: Error, ignoreAbort: boolean) {
        if (ignoreAbort && (error instanceof AbortExecutionException)) {
            return;
        }
        model.bus.unicast("Dialog.Exception", { error });
    }

    function _processReactException(error: Error) {
        _processUnhandledException(error, false);
    }
}

const AppUI = UECA.getFC(useAppUI);

export { AppUIParams, AppUIModel, useAppUI, AppUI };
