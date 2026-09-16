import * as UECA from "ueca-react";
import { Col, Row, Block, CloseIconButton, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import { asyncSafe } from "@core";
import "./drawer.css";

type DrawerStruct = UIBaseStruct<{
    props: {
        open: boolean;
        titleView: React.ReactNode;
        contentView: React.ReactNode;
        actionView: React.ReactNode;
        anchor: "left" | "top" | "right" | "bottom";
        variant: "permanent" | "persistent" | "temporary";
        width?: number;
        // Where focus was when a modal drawer opened — the trigger, as a rule — to give back on close.
        __returnFocus: HTMLElement;
        // Set on opening a modal drawer, cleared by the first draw that puts focus into the panel.
        __focusPending: boolean;
    };

    events: {
        onOpen: (source: DrawerModel) => UECA.MaybePromise;
        onClose: (source: DrawerModel) => UECA.MaybePromise;
    };
}>;

type DrawerParams = UIBaseParams<DrawerStruct>;
type DrawerModel = UIBaseModel<DrawerStruct>;

function useDrawer(params?: DrawerParams): DrawerModel {
    const struct: DrawerStruct = {
        props: {
            id: useDrawer.name,
            open: false,
            titleView: undefined,
            contentView: undefined,
            actionView: undefined,
            anchor: "left",
            variant: "temporary",
            width: undefined,
            __returnFocus: undefined,
            __focusPending: false
        },

        events: {
            onChangeOpen: (v) => {
                if (v) {
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

        // A modal drawer takes focus once its panel is on screen, as Dialog does: aria-modal tells a
        // screen reader to stay inside it, so focus must not be left on the page behind the backdrop.
        draw: () => {
            if (!model.__focusPending || !model.open || !_isModal()) {
                return;
            }
            const panel = document.getElementById(model.htmlId());
            if (panel) {
                model.__focusPending = false;
                if (!panel.contains(document.activeElement)) {
                    panel.focus();
                }
            }
        },

        // A drawer torn down while still open would otherwise leave focus on the page it no longer covers.
        unmount: () => {
            if (model.open) {
                _returnFocus();
            }
        },

        View: () => {
            const showBackdrop = model.variant === "temporary";
            const isVertical = model.anchor === "top" || model.anchor === "bottom";
            const anchorClass = `drawer-anchor-${model.anchor}`;
            const openClass = model.open ? "drawer-open" : "drawer-closed";

            return (
                <UECA.IF condition={model.open || model.variant === "permanent"}>
                    {showBackdrop && model.open && (
                        <div className="ueca-drawer-backdrop" onClick={_close} />
                    )}
                    <div
                        id={model.htmlId()}
                        className={`ueca-drawer ${anchorClass} ${openClass}`}
                        // Only the temporary variant is modal — it alone has a backdrop. Permanent and
                        // persistent drawers sit beside the page and claim nothing.
                        role={_isModal() ? "dialog" : undefined}
                        aria-modal={_isModal() ? "true" : undefined}
                        aria-labelledby={_isModal() && model.titleView ? _titleId() : undefined}
                        tabIndex={_isModal() ? -1 : undefined}
                        style={{
                            ...(model.width && !isVertical ? { width: `${model.width}px` } : {}),
                            ...(isVertical ? { height: `${model.width || 600}px`, maxHeight: "60vh" } : {})
                        }}
                    >
                        <Col fill overflow="hidden">
                            <Row verticalAlign="center" horizontalAlign="spaceBetween" className="drawer-title">
                                <div id={_titleId()}>{model.titleView}</div>
                                <Block render={model.variant !== "permanent"}>
                                    <CloseIconButton onClick={_close} />
                                </Block>
                            </Row>
                            <Col fill overflow="auto">
                                <div className="drawer-content">
                                    {model.contentView}
                                </div>
                            </Col>
                            {model.actionView && (
                                <div className="drawer-actions">
                                    {model.actionView}
                                </div>
                            )}
                        </Col>
                    </div>
                </UECA.IF>
            );
        },
    };

    const model = useUIBase(struct, params);
    return model;

    // Private methods
    function _close() {
        model.open = false;
    }

    function _isModal(): boolean {
        return model.variant === "temporary";
    }

    function _titleId(): string {
        return `${model.htmlId()}-title`;
    }

    function _focusOnDraw() {
        if (!_isModal()) {
            return;
        }
        model.__returnFocus = document.activeElement as HTMLElement;
        model.__focusPending = true;
    }

    // Only while focus is still the drawer's to give back: inside the panel, or dropped to the page
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

const Drawer = UECA.getFC(useDrawer);

export { DrawerModel, DrawerParams, useDrawer, Drawer };
