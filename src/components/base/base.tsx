import * as UECA from "ueca-react";
import { AnchorRect, AppMessage, AppRoute, Placement, asyncSafe } from "@core";

// Base UECA Component for all components in the application

type BasePartialStruct = UECA.ComponentStruct<{
    props: {
        // Whether this component currently owns the app's tooltip. Private and non-reactive: it
        // exists only so deinit knows whether it has a bubble to take down.
        __tooltipShown: boolean;
    };

    methods: {
        // Shorthand Methods

        // Routing
        getRoute: () => Promise<AppRoute>;
        goToRoute: (route: AppRoute) => Promise<boolean>;
        setRoute: (route: AppRoute) => Promise<boolean>;
        setRouteParams: (params: Record<string, unknown>, patch: boolean) => Promise<void>;
        openNewTab: (route: AppRoute) => Promise<void>;

        // Dialogs
        dialogInfo: (title: string, message: string) => Promise<void>;
        dialogWarning: (title: string, message: string, details?: string) => Promise<void>;
        dialogError: (title: string, message: string, details?: string) => Promise<void>;
        dialogException: (title: string, error: Error) => Promise<void>;
        dialogYesNo: (title: string, message: string) => Promise<boolean>;
        dialogConfirmAction: (title?: string, message?: string, action?: string) => Promise<boolean>;
        alertInformation: (text: string) => Promise<void>;
        alertWarning: (message: React.ReactNode) => Promise<void>;
        alertSuccess: (message: React.ReactNode) => Promise<void>;
        alertError: (message: React.ReactNode) => Promise<void>;

        // Busy indicator
        setAppBusy: (value: boolean) => Promise<void>;  // IMPORTANT: counts the calls
        clearAppBusy: () => Promise<void>;              // Set the call count to 0 and set busy state to false

        // Misc
        runWithErrorDisplay: <P, R>(action: (params?: P) => Promise<R>, params?: P) => Promise<R>;
        runWithBusyDisplay: <T>(action: () => Promise<T>) => Promise<T>;
        copyToClipboard: (content: string) => Promise<void>;

        // File selection
        selectFiles: (fileMask: string, multiselect?: boolean) => Promise<File[]>;

        // Tooltip. Spread the result onto any element to give it the app's tooltip:
        //     <button {...model.tooltipProps("Switch to dark theme")}>…</button>
        // showTooltip / hideTooltip are the direct route, for a trigger that is not a hover.
        tooltipProps: (contentView: React.ReactNode, options?: { placement?: Placement; delay?: number }) => {
            onMouseEnter: (e: React.MouseEvent) => void;
            onMouseLeave: () => void;
            onFocus: (e: React.FocusEvent) => void;
            onBlur: () => void;
        };
        showTooltip: (anchor: AnchorRect, contentView: React.ReactNode, options?: { placement?: Placement; delay?: number }) => Promise<void>;
        hideTooltip: () => Promise<void>;
    }

}, AppMessage>;


type BaseStruct<T extends UECA.GeneralComponentStruct> = BasePartialStruct & UECA.ComponentStruct<T, AppMessage>;
type BaseParams<T extends BasePartialStruct> = UECA.ComponentParams<T>;
type BaseModel<T extends BasePartialStruct = BasePartialStruct> = UECA.ComponentModel<T, AppMessage>;

function useBase<T extends BasePartialStruct>(extStruct: T, params?: BaseParams<T>): BaseModel<T> {
    const struct: BasePartialStruct = {
        props: {
            __tooltipShown: false
        },

        // A trigger can disappear while its tooltip is open — the sidebar collapses, a screen
        // switches — and mouseleave never fires, which would strand the bubble on screen.
        // hideTooltip carries this component's token, so it can only close its own.
        deinit: async () => {
            if (model.__tooltipShown) {
                await model.hideTooltip();
            }
        },

        methods: {
            // Shorthand Methods

            // Routing
            getRoute: async () => await model.bus.unicast("App.Router.GetRoute"),
            goToRoute: async (route) => await model.bus.unicast("App.Router.GoToRoute", route),
            setRoute: async (route) => await model.bus.unicast("App.Router.SetRoute", route),
            setRouteParams: async (params, patch) => await model.bus.unicast("App.Router.SetRouteParams", { params, patch }),
            openNewTab: async (route) => await model.bus.unicast("App.Router.OpenNewTab", route),

            // Modal dialogs
            dialogInfo: async (title, message) => await model.bus.unicast("Dialog.Information", { title, message }),
            dialogWarning: async (title, message, details) => await model.bus.unicast("Dialog.Warning", { title, message, details }),
            dialogError: async (title, message, details) => await model.bus.unicast("Dialog.Error", { title, message, details }),
            dialogException: async (title: string, error: Error) => await model.bus.unicast("Dialog.Exception", { title, error }),
            dialogYesNo: async (title, message) => await model.bus.unicast("Dialog.Confirmation", { title, message }),
            dialogConfirmAction: async (title = "Warning", message = "Are you sure want to delete this item?", action = "Delete") => await model.bus.unicast("Dialog.ActionConfirmation", { title, message, action }),

            // Toast notifications
            alertInformation: async (text) => await model.bus.unicast("Alert.Information", { message: text }),
            alertSuccess: async (message) => await model.bus.unicast("Alert.Success", { message }),
            alertWarning: async (message) => await model.bus.unicast("Alert.Warning", { message }),
            alertError: async (message) => await model.bus.unicast("Alert.Error", { message }),

            // Busy indicator
            setAppBusy: async (value) => await model.bus.unicast("BusyDisplay.Set", value),
            clearAppBusy: async () => await model.bus.unicast("BusyDisplay.Clear"),

            // Misc
            runWithErrorDisplay: async (p) => await _runWithErrorDisplay(p),
            runWithBusyDisplay: async (action) => await _runWithBusyDisplay(action),

            // Tooltip
            tooltipProps: (contentView, options) => _tooltipProps(contentView, options),
            // The flag is set here rather than in _tooltipProps so that every route to the
            // tooltip marks it, including a direct showTooltip from a click handler.
            showTooltip: async (anchor, contentView, options) => {
                model.__tooltipShown = true;
                await model.bus.unicast("App.Tooltip.Show",
                    { token: model.htmlId(), anchor, contentView, placement: options?.placement, delay: options?.delay });
            },
            hideTooltip: async () => {
                model.__tooltipShown = false;
                await model.bus.unicast("App.Tooltip.Hide", { token: model.htmlId() });
            },
        }
    }

    const model = UECA.useExtendedComponent(struct, extStruct, params);
    return model;

    // Private methods
    function _tooltipProps(contentView: React.ReactNode, options?: { placement?: Placement; delay?: number }) {
        // The anchor rect is read from the event target, so the caller needs no ref — and it is
        // read at hover time, when it is actually correct, rather than at render time.
        const open = (target: Element) => {
            const r = target.getBoundingClientRect();
            const anchor: AnchorRect = { top: r.top, left: r.left, width: r.width, height: r.height };
            asyncSafe(() => model.showTooltip(anchor, contentView, options));
        };
        const close = () => asyncSafe(() => model.hideTooltip());

        // Focus and blur as well as the pointer pair: a tooltip that only answers the mouse is
        // invisible to keyboard users. These are raw DOM handlers and cannot be async, hence
        // asyncSafe.
        return {
            onMouseEnter: (e: React.MouseEvent) => open(e.currentTarget),
            onMouseLeave: () => close(),
            // Only KEYBOARD focus opens a tooltip. Clicking a control focuses it too, and the
            // browser restores that focus when the user returns from another tab — which would
            // pop a tooltip with the pointer nowhere near the trigger. :focus-visible is exactly
            // the keyboard-vs-pointer distinction.
            onFocus: (e: React.FocusEvent) => {
                if (!e.currentTarget.matches(":focus-visible")) {
                    return;
                }
                open(e.currentTarget);
            },
            onBlur: () => close()
        };
    }

    async function _runWithErrorDisplay<P, R>(action: (params?: P) => Promise<R>, params?: P): Promise<R> {
        try {
            return await action(params);
        } catch (error) {
            await model.dialogException("Error", error as Error);
        }
    }

    async function _runWithBusyDisplay<T>(action: () => Promise<T>): Promise<T> {
        await model.setAppBusy(true);
        try {
            return await action();
        } finally {
            await model.setAppBusy(false);
        }
    }
}

export { BaseStruct, BaseParams, BaseModel, useBase }
