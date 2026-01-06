import { useAppStore } from "~/store/appStore";
import { useModalStore } from "~/store/modalStore";
import type { App } from "~/types/generic";
import easyKitUtils from "easy-kit-utils";

export const useAppComposable = async () => {
  const { isDefined } = easyKitUtils;
  const appStore = useAppStore();
  const modalStore = useModalStore();

  if (appStore.appList.length == 0) {
    await appStore.getAppList();
  }

  function changeInputText(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    appStore.setFilters({ keyword: inputElement.value });
  }

  function setStateDeleteModal(currentApp?: App) {
    modalStore.handleDeleteModal();

    _setCurrentApp(currentApp);
  }

  function setStateHandleDataModal(currentApp?: App) {
    modalStore.handleDataModal(true);

    _setCurrentApp(currentApp);
  }

  function setStateHandleStatusModal(currentApp?: App) {
    modalStore.handleStatusModal();

    _setCurrentApp(currentApp);
  }

  function setErrorModal() {
    modalStore.handleErrorModal();
  }

  async function deleteApplication() {
    const result = await appStore.deleteApp();

    if (result) {
      await _handleDataAfterDelete();
    }
  }

  function _setCurrentApp(currentApp?: App) {
    if (!isDefined(currentApp)) {
      appStore.setCurrentApp({} as App);
    } else {
      appStore.setCurrentApp(currentApp!);
    }
  }

  async function _handleDataAfterDelete() {
    appStore.resetState();
    setStateDeleteModal();
    await appStore.getAppList();
  }

  return {
    changeInputText,
    setStateDeleteModal,
    deleteApplication,
    setStateHandleDataModal,
    setStateHandleStatusModal,
    setErrorModal,
    modalStore,
    appStore,
  };
};
