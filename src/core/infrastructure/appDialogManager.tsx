import * as UECA from "ueca-react";
import { AlertDialog, AlertDialogModel, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import { DetailedError } from "@core";


type AppDialogManagerStruct = UIBaseStruct<{
    props: {
        _openDialogs: UECA.ReactElement[];
        // Counts the dialogs opened, for each one's React key.
        __dialogCount: number;
    }
}>;

type AppDialogManagerParams = UIBaseParams<AppDialogManagerStruct>;
type AppDialogManagerModel = UIBaseModel<AppDialogManagerStruct>;

type DialogKind = "notification" | "information" | "warning" | "error" | "confirmation" | "action";

function useAppDialogManager(params?: AppDialogManagerParams): AppDialogManagerModel {
    const struct: AppDialogManagerStruct = {
        props: {
            id: useAppDialogManager.name,
            _openDialogs: [],
            __dialogCount: 0
        },

        messages: {
            "Dialog.Information": async (p) => { await _openDialog("information", p.title, p.message); },
            "Dialog.Warning": async (p) => { await _openDialog("warning", p.title, p.message, p.details); },
            "Dialog.Error": async (p) => { await _openDialog("error", p.title, p.message, p.details); },
            "Dialog.Exception": async (p) => { await _openExceptionDialog(p.title, p.error); },
            "Dialog.Confirmation": async (p) => { return await _openDialog("confirmation", p.title, p.message); },
            "Dialog.ActionConfirmation": async (p) => { return await _openDialog("action", p.title, p.message, undefined, p.action); },
        },

        View: () => <>{model._openDialogs[model._openDialogs.length - 1]}</>
    }

    const model = useUIBase(struct, params);
    return model;

    // Private methods  
    async function _openDialog(_kind: DialogKind, title: React.ReactNode, message: React.ReactNode, details?: React.ReactNode, action?: string) {
        let onDialogClose: AlertDialogModel["onClose"];

        const promise = new Promise<boolean>((resolve) => {
            onDialogClose = (result) => {
                resolve(!!result);
                model._openDialogs.pop();
                model.bus.unicast("BusyDisplay.SetVisibility", true);
            }
        });

        const severity = _getSeverity(_kind);

        // Every dialog shows as "activeDialog", so the key and cacheable={false} are what give each
        // one a model of its own. Sharing one, a nested dialog took over the model of the dialog
        // beneath it, whose `init` — the OK button's verb and colour — never ran again, and the
        // nested dialog wore the other's button. Uncached, a dialog brought back when the one above
        // it closes starts from its own parameters again.
        const newDialog = (
            <AlertDialog
                key={++model.__dialogCount}
                cacheable={false}
                id={"activeDialog"}
                titleView={title}
                contentView={message}
                detailsView={details}
                severity={severity}
                buttons={{ okCancel: true, details: true }}
                open={true}                
                init={(m) => { 
                    if (action) {
                        m.okButton.contentView = action; 
                    }
                    if (_kind === "action") {
                        m.okButton.color = "error.main";
                    } else {
                        m.okButton.color = "primary.main";
                    }
                }}
                onClose={onDialogClose}
            />
        );

        await model.bus.unicast("BusyDisplay.SetVisibility", false);
        model._openDialogs.push(newDialog);

        return promise;
    }

    async function _openExceptionDialog(title: string, error: Error) {
        title = title ? title : "Error";
        const message = error.message ? error.message : "An error has occurred.";
        let details = (error as DetailedError).details;
        details = details ? `${message}\n\n${details}` : message;
        details = error.stack ? `${details}\n\nCall Stack:\n${error.stack}` : details;
        await _openDialog("error", title, message, details);
    }

    function _getSeverity(kind: DialogKind): "success" | "info" | "warning" | "error" | undefined {
        switch (kind) {
            case "information":
                return "info";
            case "warning":
                return "warning";
            case "error":
                return "error";
            default:
                return undefined;
        }
    }
}

const AppDialogManager = UECA.getFC(useAppDialogManager);

export { AppDialogManagerParams, AppDialogManagerModel, useAppDialogManager, AppDialogManager }
