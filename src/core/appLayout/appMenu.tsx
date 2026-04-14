import * as UECA from "ueca-react";
import { Col, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase, NavItemModel, useNavItem, NavItemExpandableModel, useNavItemExpandable } from "@components";
import { AppRoute } from "@core";
import { HomeIcon, DocumentIcon } from "../misc/icons";

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
                    model.codeTemplateMenuItem
                ]
            }),
            introMenuItem: useMenuItem({
                text: "Introduction",
                route: { path: "/docs/introduction" }
            }),
            technologyMenuItem: useMenuItem({
                text: "Technology",
                route: { path: "/docs/technology" }
            }),
            componentMentalModelMenuItem: useMenuItem({
                text: "Component Mental Model",
                route: { path: "/docs/component-mental-model" }
            }),
            componentIntegrationModelMenuItem: useMenuItem({
                text: "Component Integration Model",
                route: { path: "/docs/component-integration-model" }
            }),
            introComponentsMenuItem: useMenuItem({
                text: "Introduction to Components",
                route: { path: "/docs/introduction-to-components" }
            }),
            componentIdsMenuItem: useMenuItem({
                text: "Component IDs",
                route: { path: "/docs/component-ids" }
            }),
            lifecycleHooksMenuItem: useMenuItem({
                text: "Lifecycle Hooks",
                route: { path: "/docs/lifecycle-hooks" }
            }),
            stateManagementMenuItem: useMenuItem({
                text: "State Management",
                route: { path: "/docs/state-management" }
            }),
            propertyBindingsMenuItem: useMenuItem({
                text: "Property Bindings",
                route: { path: "/docs/property-bindings" }
            }),
            onchangeEventsMenuItem: useMenuItem({
                text: "Automatic onChange Events",
                route: { path: "/docs/onchange-events" }
            }),
            onchangingEventsMenuItem: useMenuItem({
                text: "Automatic onChanging Events",
                route: { path: "/docs/onchanging-events" }
            }),
            onpropEventsMenuItem: useMenuItem({
                text: "Automatic onPropChange/onPropChanging",
                route: { path: "/docs/onprop-events" }
            }),
            messageBusMenuItem: useMenuItem({
                text: "Message Bus",
                route: { path: "/docs/message-bus" }
            }),
            arraysReactivityMenuItem: useMenuItem({
                text: "Arrays and Reactivity",
                route: { path: "/docs/arrays-and-reactivity" }
            }),
            modelCachingMenuItem: useMenuItem({
                text: "Model Caching",
                route: { path: "/docs/model-caching" }
            }),
            componentExtensionMenuItem: useMenuItem({
                text: "Component Extension",
                route: { path: "/docs/component-extension" }
            }),
            specializedFactoriesMenuItem: useMenuItem({
                text: "Specialized Component Factories",
                route: { path: "/docs/specialized-factories" }
            }),
            tracingMenuItem: useMenuItem({
                text: "Tracing",
                route: { path: "/docs/tracing" }
            }),
            codeTemplateMenuItem: useMenuItem({
                text: "Standard Code Template",
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

        View: () =>
            <Col id={model.htmlId()} fill overflow={"auto"} padding={{ top: "small" }} spacing={"none"}>
                <model.homeMenuItem.View />
                <model.docsMenuItem.View />
            </Col>
    };

    const model = useUIBase(struct, params);
    return model;

    function useMenuItem(params: { text: string; route: AppRoute; icon?: React.ReactNode }): NavItemModel {
        return useNavItem({
            text: params.text,
            route: params.route,
            icon: params.icon,
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
