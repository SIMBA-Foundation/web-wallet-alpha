/**
 * Global Components
 */
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import AppSectionLoader from "Components/AppSectionLoader/AppSectionLoader";
import AppDialogLoader from "Components/DialogBox/Loader";
import { RotateSquare2 } from "vue-loading-spinner";

// delete Confirmation Dialog
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// App Card component
import AppCard from "Components/AppCard/AppCard";

const GlobalComponents = {
    install(Vue) {
        Vue.component("appCard", AppCard);
        Vue.component("deleteConfirmationDialog", DeleteConfirmationDialog);
        Vue.component("vuePerfectScrollbar", VuePerfectScrollbar);
        Vue.component("appSectionLoader", AppSectionLoader);
        Vue.component("appDialogLoader", AppDialogLoader);
        Vue.component("pageTitleBar", PageTitleBar);
        Vue.component("rotateSquare2", RotateSquare2);
    }
};

export default GlobalComponents;
