import * as UECA from "ueca-react";
import { Row, CloseIconButton, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import { asyncSafe } from "@core";
import "./dialog.css";

type DialogStruct = UIBaseStruct<{
    props: {
        open: boolean;
        titleView: React.ReactNode;
        contentView: React.ReactNode;
        actionView: React.ReactNode;
        fullScreen: boolean;
        fullWidth: boolean;
        maxWidth: "xs" | "sm" | "md" | "lg" | "xl" | false;
        // Where focus was when the dialog opened — the trigger, as a rule — to give back on close.
        __returnFocus: HTMLElement;
        // Set on opening, cleared by the first draw that can put focus into the panel.
        __focusPending: boolean;
    };

    events: {
        onOpen: (source: DialogModel) => UECA.MaybePromise;
        onClose: (source: DialogModel) => UECA.MaybePromise;
    };
}>;

type DialogParams = UIBaseParams<DialogStruct>;
type DialogModel = UIBaseModel<DialogStruct>;

function useDialog(params?: DialogParams): DialogModel {
    const struct: DialogStruct = {
        props: {
            id: useDialog.name,
            open: false,
            titleView: undefined,
            contentView: undefined,
            actionView: undefined,
            fullScreen: false,
            fullWidth: false,
            maxWidth: "sm",
            __returnFocus: undefined,
            __focusPending: false
        },

        events: {
            onChangeOpen: () => {
                if (model.open) {
                    _focusOnDraw();
                    asyncSafe(() => model.onOpen?.(model));
                } else {
                    _returnFocus();
                    asyncSafe(() => model.onClose?.(model));
                }
            }
        },

        constr: () => {
            if (model.open) {
                _focusOnDraw();
                asyncSafe(() => model.onOpen?.(model));
            }
        },

        // A dialog torn down while still open would otherwise leave focus on the page it no longer covers.
        unmount: () => {
            if (model.open) {
                _returnFocus();
            }
        },

        // Focus moves into the panel once it is on screen. aria-modal tells a screen reader to stay
        // inside the dialog, so focus left on the trigger behind the backdrop would sit somewhere it
        // has just been told to ignore.
        draw: () => {
            if (!model.__focusPending || !model.open) {
                return;
            }
            const panel = document.getElementById(model.htmlId());
            if (panel) {
                model.__focusPending = false;
                panel.focus();
            }
        },

        View: () => {
            if (!model.open) return null;
            
            const maxWidthClass = model.maxWidth ? `dialog-max-${model.maxWidth}` : "";
            const fullScreenClass = model.fullScreen ? "dialog-fullscreen" : "";
            const fullWidthClass = model.fullWidth ? "dialog-fullwidth" : "";

            return (
                <div className="ueca-dialog-backdrop" onClick={_close}>
                    <div
                        id={model.htmlId()}
                        className={`ueca-dialog ${maxWidthClass} ${fullScreenClass} ${fullWidthClass}`}
                        // Without these, assistive technology could not tell a modal was up at all.
                        // Named by the title text alone, not the title row, which holds the ×.
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={model.titleView ? _titleId() : undefined}
                        // Focusable from code only, for draw to move focus into; never a Tab stop.
                        tabIndex={-1}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="dialog-title">
                            <Row verticalAlign="center" horizontalAlign="spaceBetween">
                                <div id={_titleId()}>{model.titleView}</div>
                                <CloseIconButton onClick={_close} />
                            </Row>
                        </div>
                        <div className="dialog-content">
                            <div className="dialog-content-text">
                                {model.contentView}
                            </div>
                        </div>
                        {model.actionView && (
                            <div className="dialog-actions">
                                {model.actionView}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    };

    const model = useUIBase<DialogStruct>(struct, params);
    return model;

    // Private methods
    function _close() {
        model.open = false;
    }

    function _titleId(): string {
        return `${model.htmlId()}-title`;
    }

    function _focusOnDraw() {
        model.__returnFocus = document.activeElement as HTMLElement;
        model.__focusPending = true;
    }

    // Only while focus is still the dialog's to give back: inside the panel, or dropped to the page
    // because the panel went away. Focus the user has moved elsewhere stays where they put it.
    function _returnFocus() {
        const target = model.__returnFocus;
        model.__returnFocus = undefined;
        model.__focusPending = false;
        const active = document.activeElement;
        const panel = document.getElementById(model.htmlId());
        const focusIsOurs = !active || active === document.body || !!panel?.contains(active);
        if (focusIsOurs && target?.isConnected && target !== document.body) {
            target.focus();
        }
    }
}

const Dialog = UECA.getFC(useDialog);

export { DialogModel, DialogParams, useDialog, Dialog };
