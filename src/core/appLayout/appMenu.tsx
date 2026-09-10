import * as UECA from "ueca-react";
import { Col, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase, NavItemModel, useNavItem, NavItemExpandableModel, useNavItemExpandable } from "@components";
import { AppRoute } from "@core";
import { HomeIcon, DocumentIcon } from "../misc/icons";
import "./appMenu.css";

type AppMenuStruct = UIBaseStruct<{
    props: {
        iconsOnly: boolean;
        _activeRoute: AppRoute;
    };

    children: {
        homeMenuItem: NavItemModel;
        docsMenuItem: NavItemExpandableModel;
        introMenuItem: NavItemModel;
        technologyMenuItem: NavItemModel;
        componentMentalModelMenuItem: NavItemModel;
        componentIntegrationModelMenuItem: NavItemModel;
        introComponentsMenuItem: NavItemModel;
        componentIdsMenuItem: NavItemModel;
        lifecycleHooksMenuItem: NavItemModel;
        stateManagementMenuItem: NavItemModel;
        propertyBindingsMenuItem: NavItemModel;
        onchangeEventsMenuItem: NavItemModel;
        onchangingEventsMenuItem: NavItemModel;
        onpropEventsMenuItem: NavItemModel;
        messageBusMenuItem: NavItemModel;
        arraysReactivityMenuItem: NavItemModel;
        modelCachingMenuItem: NavItemModel;
        componentExtensionMenuItem: NavItemModel;
        specializedFactoriesMenuItem: NavItemModel;
        tracingMenuItem: NavItemModel;
        errorHandlingMenuItem: NavItemModel;
        utilityFunctionsMenuItem: NavItemModel;
        codeTemplateMenuItem: NavItemModel;
    }
}>;

type AppMenuParams = UIBaseParams<AppMenuStruct>;
type AppMenuModel = UIBaseModel<AppMenuStruct>;

function useAppMenu(params?: AppMenuParams): AppMenuModel {
    const struct: AppMenuStruct = {
        props: {
            id: useAppMenu.name,
            iconsOnly: false,
            _activeRoute: undefined
        },

        children: {
            homeMenuItem: useMenuItem({
                text: "Home",
                route: { path: "/home" },
                icon: <HomeIcon />
            }),
            docsMenuItem: useGroupMenuItem({
                text: "API Documentation",
                icon: <DocumentIcon />,      
                expanded: true,          
                subItems: () => [
                    model.introMenuItem,
                    model.technologyMenuItem,
                    model.componentMentalModelMenuItem,
                    model.componentIntegrationModelMenuItem,
                    model.introComponentsMenuItem,
                    model.componentIdsMenuItem,
                    model.lifecycleHooksMenuItem,
                    model.stateManagementMenuItem,
                    model.propertyBindingsMenuItem,
                    model.onchangeEventsMenuItem,
                    model.onchangingEventsMenuItem,
                    model.onpropEventsMenuItem,
                    model.messageBusMenuItem,
                    model.arraysReactivityMenuItem,
                    model.modelCachingMenuItem,
                    model.componentExtensionMenuItem,
                    model.specializedFactoriesMenuItem,
                    model.tracingMenuItem,
                    model.errorHandlingMenuItem,
                    model.utilityFunctionsMenuItem,
                    model.codeTemplateMenuItem
                ]
            }),
            introMenuItem: useMenuItem({
                text: "Introduction",
                number: "01",
                route: { path: "/docs/introduction" }
            }),
            technologyMenuItem: useMenuItem({
                text: "Technology",
                number: "02",
                route: { path: "/docs/technology" }
            }),
            componentMentalModelMenuItem: useMenuItem({
                text: "Component Mental Model",
                number: "03",
                route: { path: "/docs/component-mental-model" }
            }),
            componentIntegrationModelMenuItem: useMenuItem({
                text: "Component Integration Model",
                number: "04",
                route: { path: "/docs/component-integration-model" }
            }),
            introComponentsMenuItem: useMenuItem({
                text: "Introduction to Components",
                number: "05",
                route: { path: "/docs/introduction-to-components" }
            }),
            componentIdsMenuItem: useMenuItem({
                text: "Component IDs",
                number: "06",
                route: { path: "/docs/component-ids" }
            }),
            lifecycleHooksMenuItem: useMenuItem({
                text: "Lifecycle Hooks",
                number: "07",
                route: { path: "/docs/lifecycle-hooks" }
            }),
            stateManagementMenuItem: useMenuItem({
                text: "State Management",
                number: "08",
                route: { path: "/docs/state-management" }
            }),
            propertyBindingsMenuItem: useMenuItem({
                text: "Property Bindings",
                number: "09",
                route: { path: "/docs/property-bindings" }
            }),
            onchangeEventsMenuItem: useMenuItem({
                text: "Automatic onChange Events",
                number: "10",
                route: { path: "/docs/onchange-events" }
            }),
            onchangingEventsMenuItem: useMenuItem({
                text: "Automatic onChanging Events",
                number: "11",
                route: { path: "/docs/onchanging-events" }
            }),
            onpropEventsMenuItem: useMenuItem({
                text: "Automatic onPropChange/onPropChanging",
                number: "12",
                route: { path: "/docs/onprop-events" }
            }),
            messageBusMenuItem: useMenuItem({
                text: "Message Bus",
                number: "13",
                route: { path: "/docs/message-bus" }
            }),
            arraysReactivityMenuItem: useMenuItem({
                text: "Arrays and Reactivity",
                number: "14",
                route: { path: "/docs/arrays-and-reactivity" }
            }),
            modelCachingMenuItem: useMenuItem({
                text: "Model Caching",
                number: "15",
                route: { path: "/docs/model-caching" }
            }),
            componentExtensionMenuItem: useMenuItem({
                text: "Component Extension",
                number: "16",
                route: { path: "/docs/component-extension" }
            }),
            specializedFactoriesMenuItem: useMenuItem({
                text: "Specialized Component Factories",
                number: "17",
                route: { path: "/docs/specialized-factories" }
            }),
            tracingMenuItem: useMenuItem({
                text: "Tracing",
                number: "18",
                route: { path: "/docs/tracing" }
            }),
            errorHandlingMenuItem: useMenuItem({
                text: "Error Handling",
                number: "19",
                route: { path: "/docs/error-handling" }
            }),
            utilityFunctionsMenuItem: useMenuItem({
                text: "Utility Functions",
                number: "20",
                route: { path: "/docs/utility-functions" }
            }),
            codeTemplateMenuItem: useMenuItem({
                text: "Standard Code Template",
                number: "21",
                route: { path: "/docs/code-template" }
            }),
        },

        messages: {
            "App.Router.AfterRouteChange": async (route) => {
                model._activeRoute = route;
            },
        },

        init: async () => {
            model._activeRoute = await model.getRoute();
        },

        // overflow is visible on purpose: the sidebar's scroll wrapper is the single scroller,
        // and a second one here would nest two scrollbars in the same rail.
        View: () =>
            <Col id={model.htmlId()} fill overflow={"visible"} padding={{ top: "small" }} spacing={"none"}>
                <model.homeMenuItem.View />
                <model.docsMenuItem.View />
            </Col>
    };

    const model = useUIBase(struct, params);
    return model;

    function useMenuItem(params: { text: string; route: AppRoute; icon?: React.ReactNode; number?: string }): NavItemModel {
        return useNavItem({
            text: params.text,
            route: params.route,
            // The chapter number rides in the icon slot. The guide is read in order, so the
            // number is real information, and it survives the collapse to an icon rail.
            icon: params.number
                ? <span className="app-menu-number">{params.number}</span>
                : params.icon,
            active: () => model._activeRoute?.path === params.route.path || params.route.path === "/home" && model._activeRoute?.path === "/",
            mode: () => model.iconsOnly ? "icon-only" : "icon-text"
        });
    }

    function useGroupMenuItem(params: { text: string; icon?: React.ReactNode, subItems?: () => NavItemModel[], expanded?: boolean }): NavItemExpandableModel {
        const menuItem = useNavItemExpandable({
            text: params.text,
            icon: params.icon,
            expanded: params.expanded,
            active: () => params.subItems?.().some(item => item.active),
            mode: () => model.iconsOnly ? "icon-only" : "icon-text",
            subItems: params.subItems,
            onChangeActive: (active) => {
                if (active && !model.iconsOnly) {
                    menuItem.expanded = true;
                }
            }
        });
        return menuItem;
    }
}

const AppMenu = UECA.getFC(useAppMenu);

export { AppMenuParams, AppMenuModel, useAppMenu, AppMenu };
