import * as UECA from "ueca-react";
import { AnchorRect, AppMessage, AppRoute, Placement, asyncSafe } from "@core";

// Base UECA Component for all components in the application

// `trigger` names one of several elements a component gives tooltips to — see tooltipProps.
type TooltipOptions = { placement?: Placement; delay?: number; trigger?: string };

type BasePartialStruct = UECA.ComponentStruct<{
    props: {
        // The token of the tooltip this component last opened and has not hidden. Private and
        // non-reactive: it exists only so deinit knows whether it has a bubble to take down — and
        // takes down the right one when the component drives several named triggers.
        __tooltipToken: string;
    };

    methods: {
        // Shorthand Methods

        // Routing
        getRoute: () => Promise<AppRoute>;
        goToRoute: (route: AppRoute) => Promise<boolean>;
        setRoute: (route: AppRoute) => Promise<boolean>;
        setRouteParams: (params: Record<string, unknown>, patch: boolean) => Promise<void>;
        // Patches only the anchor of the current address - the screen on show stays mounted.
        setRouteSection: (section: string) => Promise<void>;
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
        // Spread onto SEVERAL elements, name each one with `trigger`: the tooltip tells triggers
        // apart by token, and one token shared by all lets a late leave from one close the tooltip
        // another has just opened.
        tooltipProps: (contentView: React.ReactNode, options?: TooltipOptions) => {
            onMouseEnter: (e: React.MouseEvent) => void;
            onMouseLeave: () => void;
            onFocus: (e: React.FocusEvent) => void;
            onBlur: () => void;
        };
        showTooltip: (anchor: AnchorRect, contentView: React.ReactNode, options?: TooltipOptions) => Promise<void>;
        // Hides the tooltip the named trigger opened; without a name, the one this component last
        // opened.
        hideTooltip: (trigger?: string) => Promise<void>;
    }

}, AppMessage>;


type BaseStruct<T extends UECA.GeneralComponentStruct> = BasePartialStruct & UECA.ComponentStruct<T, AppMessage>;
type BaseParams<T extends BasePartialStruct> = UECA.ComponentParams<T>;
type BaseModel<T extends BasePartialStruct = BasePartialStruct> = UECA.ComponentModel<T, AppMessage>;

function useBase<T extends BasePartialStruct>(extStruct: T, params?: BaseParams<T>): BaseModel<T> {
    const struct: BasePartialStruct = {
        props: {
            __tooltipToken: undefined
        },

        // A trigger can disappear while its tooltip is open — the sidebar collapses, a screen
        // switches — and mouseleave never fires, which would strand the bubble on screen.
        // hideTooltip carries the token this component opened with, so it can only close its own.
        deinit: async () => {
            if (model.__tooltipToken) {
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

            setRouteSection: async (section) => await model.bus.unicast("App.Router.SetRouteParams", { section }),
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
            // The token is recorded here rather than in _tooltipProps so that every route to the
            // tooltip marks it, including a direct showTooltip from a click handler.
            showTooltip: async (anchor, contentView, options) => {
                const token = _tooltipToken(options?.trigger);
                model.__tooltipToken = token;
                await model.bus.unicast("App.Tooltip.Show",
                    { token, anchor, contentView, placement: options?.placement, delay: options?.delay });
            },
            hideTooltip: async (trigger) => {
                await _hideTooltip(trigger === undefined ? (model.__tooltipToken ?? model.htmlId()) : _tooltipToken(trigger));
            },
        }
    }

    const model = UECA.useExtendedComponent(struct, extStruct, params);
    return model;

    // Private methods
    function _tooltipProps(contentView: React.ReactNode, options?: TooltipOptions) {
        // The anchor rect is read from the event target, so the caller needs no ref — and it is
        // read at hover time, when it is actually correct, rather than at render time.
        const open = (target: Element) => {
            const r = target.getBoundingClientRect();
            const anchor: AnchorRect = { top: r.top, left: r.left, width: r.width, height: r.height };
            asyncSafe(() => model.showTooltip(anchor, contentView, options));
        };
        // This trigger's own token, never "whatever this component opened last": that may be a
        // neighbour's tooltip, which a late leave from here must not close.
        const close = () => asyncSafe(() => _hideTooltip(_tooltipToken(options?.trigger)));

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

    // The component's htmlId names its trigger; a named trigger adds its name after a "#", which
    // model paths do not use, so it cannot collide with a child component's id.
    function _tooltipToken(trigger?: string): string {
        return trigger === undefined ? model.htmlId() : `${model.htmlId()}#${trigger}`;
    }

    // Forgets the token only when it is the one this component has showing: a late hide from another
    // of its named triggers must not leave deinit thinking there is nothing left to close.
    async function _hideTooltip(token: string) {
        if (token === model.__tooltipToken) {
            model.__tooltipToken = undefined;
        }
        await model.bus.unicast("App.Tooltip.Hide", { token });
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
