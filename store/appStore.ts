import type { Card, Option } from "~/types/components";
import type { App } from "~/types/generic";
import type { Filter } from "~/types/store";
import {
  isTrue,
  isUndefined,
  isEmptyString,
  isBlankArray,
  isNull,
  /// @ts-ignore
} from "easy-kit-utils";

export const useAppStore = defineStore("app", () => {
  let _appListOriginal = ref<Card[]>([]);
  let appList = ref<Card[]>([]);
  let filters = ref<Filter>({ keyword: "" });
  let currentApp = ref<App>({} as App);
  let currentAppOriginal = ref<App>({} as App);

  async function getAppList() {
    const { data, error } = await useFetch("/api/appController/get/list");
    const result = handleResult(data, error);

    result.value?.data.forEach((app: Card) => {
      _appListOriginal.value.push(app);
      appList.value.push(app);
    });
  }

  async function addApp() {
    let checkForm = _validateForm();

    if (isTrue(checkForm)) {
      currentAppOriginal.value = {
        ...currentApp.value,
        platforms: _setPlatformsKey(
          currentApp.value.platforms as unknown as Option[]
        ),
      };

      const { data, error } = await useFetch("/api/appController/post/app", {
        method: "POST",
        body: currentAppOriginal.value,
      });

      return handleResult(data, error);
    } else {
      return checkForm;
    }
  }

  async function deleteApp() {
    const { data, error } = await useFetch(
      `/api/appController/delete/${currentApp.value.id}`,
      {
        method: "DELETE",
      }
    );

    return handleResult(data, error);
  }

  async function editApp() {
    let checkForm = _validateForm();

    if (isTrue(checkForm)) {
      currentAppOriginal.value = {
        ...currentApp.value,
        platforms: _setPlatformsKey(
          currentApp.value.platforms as unknown as Option[]
        ),
      };

      const { data, error } = await useFetch("/api/appController/put/app", {
        method: "PUT",
        body: currentAppOriginal.value,
      });
      return handleResult(data, error);
    } else {
      return checkForm;
    }
  }

  async function editAppStatus() {}

  function setCurrentApp(app: App) {
    if (isEmptyObject(app)) {
      currentApp.value = app;
      return;
    }

    currentApp.value = {
      ...app,
      platforms: _setPlatformsValue(app) as unknown as string[],
    };
  }

  function setFilters(filter: Filter) {
    if (!isUndefined(filter.keyword)) {
      filters.value.keyword = filter.keyword;
    }

    if (!isEmptyString(filters.value.keyword!)) {
      _searchApp();
    } else {
      _resetFilters();
    }
  }

  function resetState() {
    filters.value = { keyword: "" };
    appList.value = [];
    _appListOriginal.value = [];
    currentApp.value = {} as App;
    currentAppOriginal.value = {} as App;
  }

  function _resetFilters() {
    filters.value = { keyword: "" };

    appList.value = _appListOriginal.value;
  }

  function _searchApp() {
    appList.value = _appListOriginal.value.filter(
      (x) =>
        x.title.toLowerCase().includes(filters.value.keyword!.toLowerCase()) ||
        (!isNull(x.description) &&
          !isUndefined(x.description) &&
          !isEmptyString(x.description) &&
          x.description
            .toLowerCase()
            .includes(filters.value.keyword!.toLowerCase()))
    );
  }

  function _setPlatformsKey(currentPlatforms?: Option[]) {
    let platforms: string[] = [];

    currentPlatforms!.map((platform: Option) => platforms.push(platform.key));

    return platforms;
  }

  function _setPlatformsValue(app: Card) {
    let platforms: Option[] = [];

    app.platforms.map((platform: string) => {
      let platformObj: Option = {
        key: platform,
        value: platform,
      };

      platforms.push(platformObj);
    });

    return platforms;
  }

  function _validateForm() {
    if (
      isUndefined(currentApp.value.platforms) ||
      isBlankArray(currentApp.value.platforms)
    ) {
      return false;
    }

    if (
      isUndefined(currentApp.value.title) ||
      isEmptyString(currentApp.value.title)
    ) {
      return false;
    }

    const urlStrict =
      /^(?:(?:https?):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-5])|(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))(?::\d{2,5})?(?:\/\S*)?$/;

      
    if (
      !isUndefined(currentApp.value.website) &&
      !isEmptyString(currentApp.value.website)
    ) {
      if (!urlStrict.test(currentApp.value.website!)) {
        return false;
      }
    }

    if (
      !isUndefined(currentApp.value.repository) &&
      !isEmptyString(currentApp.value.repository)
    ) {
      if (!urlStrict.test(currentApp.value.repository!)) {
        return false;
      }
    } 

    return true;
  }

  return {
    appList,
    _appListOriginal,
    filters,
    currentApp,
    getAppList,
    deleteApp,
    setFilters,
    setCurrentApp,
    resetState,
    addApp,
    editApp,
  };
});
