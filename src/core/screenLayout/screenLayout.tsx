import * as UECA from "ueca-react";
import { AlertDrawerModel, BlockProps, Col, Row, UIBaseModel, UIBaseParams, UIBaseStruct, useAlertDrawer, useUIBase } from "@components";
import { Breadcrumb, LocationBreadcrumbsModel, useLocationBreadcrumbs, UECAContactsModel, useUECAContacts } from "@core";
import { ThemeToggleModel, useThemeToggle } from "../appComponents/themeToggle/themeToggle";
import "./screenLayout.css";

type ScreenLayoutStruct = UIBaseStruct<{
    props: {
        breadcrumbs: Breadcrumb[];
        toolsView: React.ReactNode;
        hiddenToolsView: React.ReactNode;
        contentView: React.ReactNode;
        contentPaddings: "none" | "default" | BlockProps["padding"],
    };

    children: {
        breadcrumbsControl: LocationBreadcrumbsModel;
        drawerPanel: AlertDrawerModel;
        themeToggle: ThemeToggleModel;
        contacts: UECAContactsModel;
    };
}>;

type ScreenParams = UIBaseParams<ScreenLayoutStruct>;
type ScreenLayoutModel = UIBaseModel<ScreenLayoutStruct>;

function useScreenLayout(params?: ScreenParams): ScreenLayoutModel {
    const struct: ScreenLayoutStruct = {
        props: {
            id: useScreenLayout.name,
            breadcrumbs: [],
            toolsView: undefined,
            hiddenToolsView: undefined,
            contentView: undefined,
            contentPaddings: "default",
        },

        children: {
            breadcrumbsControl: useLocationBreadcrumbs({
                items: () => model.breadcrumbs
            }),

            drawerPanel: useAlertDrawer({
                titleView: "Alert",
                contentView: "This is an alert drawer.",
                width: 1000,
            }),

            themeToggle: useThemeToggle(),

            contacts: useUECAContacts({
                orientation: "horizontal"
            })
        },

        View: () => {
            const contentPaddings: BlockProps["padding"] =
                model.contentPaddings === "none" ?
                    undefined :
                    (model.contentPaddings === "default" || !model.contentPaddings) ?
                        {
                            top: "small",
                            left: "small",
                        } :
                        model.contentPaddings;

            return (
                <Col id={model.htmlId()} fill overflow={"hidden"}>
                    <Row
                        className="app-topbar"
                        verticalAlign={"center"}
                        horizontalAlign={"spaceBetween"}
                        padding={{ leftRight: "medium" }}
                        height={"var(--topbar-h)"}
                    >
                        <model.breadcrumbsControl.View />
                        <Row spacing={"tiny"} verticalAlign={"center"}>
                            {model.toolsView}
                            <div className="app-topbar-divider" />
                            <model.themeToggle.View />
                            <model.contacts.View />
                            {/* <HiddenToolsButton items={model.hiddenToolsView} /> */}
                        </Row>
                    </Row>
                    {/* overflow stays a prop: Col writes `overflow: visible` inline when it is
                        omitted, which would outrank the stylesheet. */}
                    <Col className="app-content" fill padding={contentPaddings} overflow={"auto"}>
                        {model.contentView}
                    </Col>
                    <model.drawerPanel.View />
                </Col>
            )
        }
    }

    const model = useUIBase(struct, params);
    return model;
}

const ScreenLayout = UECA.getFC(useScreenLayout);

export { ScreenParams, ScreenLayoutModel, useScreenLayout, ScreenLayout };
